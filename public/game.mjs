import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import gameConfig from './gameConfig.mjs';
import drawUI from './drawUI.mjs';


const {
  title,
  controlInfo,
  gameWindowWidth,
  padding,
  avatar,
  infoFieldHeight,
  consoles,
  field,
} = gameConfig;



let posX = 20;

const socket = io();
const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

const canvasWidth = gameConfig.canvasWidth;
const canvasHeight = gameConfig.canvasHeight;

// Pre-Load graphics
function loadIcon (src) {
  const icon = new Image();
  icon.src = src;
  return icon;
} 

const collectibleIcons = gameConfig.collectibles.iconSrc.map( (src) => {
  return loadIcon(src); 
});

const playerIcons = gameConfig.avatar.iconSrc.map( (src) => {
  return loadIcon(src); 
});

let group = [];
let player;
let collectible = null;
let playerRank = "Rank: ";
let playerScore = " ";

// Client handling
socket.on("connect", () => {
  
  // Creating a new player object for the socket/player with random coords
  socket.on("freeNr", (freeNr) => {
    if (consoles) console.log(`C: Received ${freeNr} for socketID: ${socket.id}`);
    player = new Player({x: padding + Math.max(0, Math.floor(Math.random()*field.width) - avatar.width), 
                        y: infoFieldHeight + Math.max(0, Math.floor(Math.random()*field.height) - avatar.height), 
                        score: 0, id: socket.id, playerNr: freeNr});
    if (consoles) console.log("C: Created new player: \n", player);
    group.push(player);
    socket.emit("joinRequest", player);
  })
});

socket.on("newEnemy", (enemy) => {
  let enemyObject = new Player(enemy);
  console.log("S: New enemy created: \n", enemyObject);
  group.push(enemyObject);
})


// Listener to update the group item (which will be drawn)
socket.on("groupUpdate", (groupS) => {

  

 // Let's first ensure there are no duplicates in the client group
  // Create a Map using the id as the key to track unique objects
  const uniqueMap = new Map();
  group.forEach(obj => {
    uniqueMap.set(obj.id, obj);
  });

  // Convert the Map back to an array
  group = Array.from(uniqueMap.values());

  
  // Loops through each player on the server
  groupS.forEach((sPlayer) => {

    // Looks up the index in the group array: either number or -1
    let indexPlayer = group.findIndex((cPlayer) => cPlayer.id === sPlayer.id);
    if (socket.id != sPlayer.id) {
      if (indexPlayer >= 0) {
        // If found: Adjust coordinates
        // if (consoles) console.log("S: Adjusting coordinates for:\n", sPlayer.id);
        group[indexPlayer].updateStats(sPlayer);
      
      } else if (indexPlayer == -1) {
        // if not found: Create a new player (enemy) object and add it to the group
        if (consoles) console.log(`Index not found: ${indexPlayer} for ${sPlayer.id}`);
        let newEnemy = new Player(sPlayer);  
        if (consoles) console.log("S: New enemy created and added: \n", newEnemy, "\nGroup is now: \n", group);
        group.push(newEnemy);
      }
    } else if (socket.id == sPlayer.id) {
      group[indexPlayer].updateStats({score: sPlayer.score});
    }

    
    playerRank = player.calculateRank(group);
    playerScore = player.score;
  })

  // find "disconnected" players in client version
  let moreServer = groupS.length < group.length;
  if (moreServer) {
    if (consoles) console.log("Too big client group:", group, "\n vs server: \n", groupS);
    let groupKeys = new Set(groupS.map(obj => obj.id)); // set of keys in groupS
    console.log("Group keys: ", groupKeys);
    group = group.filter(obj => groupKeys.has(obj.id));
    if (consoles) console.log("Reduced client group to:", group);

    moreServer = groupS.length < group.length;

  }

})

socket.on("newCollectible", (collectibleS) => {
  if (consoles) console.log("C: Collectible rec.: \n", collectibleS);
  collectible = new Collectible(collectibleS);
})


// Variables to track the individual movement directions
let verticalDir = null;
let horizontalDir = null;

// Listeners to identify avatar movement
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      verticalDir = 'up';
      break;
    case 's':
    case 'ArrowDown':
      verticalDir = 'down';
      break;
    case 'a':
    case 'ArrowLeft':
      horizontalDir = 'left';
      break;
    case 'd':
    case 'ArrowRight':
      horizontalDir = 'right';
      break;
    default:
      // Nothing
  }

  // Determine the overall movement direction
  if (verticalDir && horizontalDir) {
    player.dir = `${verticalDir}-${horizontalDir}`; // Combine vertical and horizontal directions
  } else if (verticalDir) {
    player.dir = verticalDir;
  } else if (horizontalDir) {
    player.dir = horizontalDir;
  }

  socket.emit('playerMove', player);
});

// Listener to reset individual movement directions
document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      verticalDir = null;
      break;
    case 's':
    case 'ArrowDown':
      verticalDir = null;
      break;
    case 'a':
    case 'ArrowLeft':
      horizontalDir = null;
      break;
    case 'd':
    case 'ArrowRight':
      horizontalDir = null;
      break;
    default:
      // Nothing
  }

  // Determine the overall movement direction
  if (verticalDir && horizontalDir) {
    player.dir = `${verticalDir}-${horizontalDir}`; // Combine vertical and horizontal directions
  } else if (verticalDir) {
    player.dir = verticalDir;
  } else if (horizontalDir) {
    player.dir = horizontalDir;
  }

  socket.emit('playerMove', player);
});

// Avatar movement stops
document.addEventListener('keyup', (event) => {
  if (
    player &&
    (event.key === 'w' ||
      event.key === 's' ||
      event.key === 'a' ||
      event.key === 'd' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight')
  ) {
    player.dir = null;
    socket.emit('playerMove', player);
  }
});


function renderGame() {

  // Create the game canvas minus pedding
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw UI
  drawUI(ctx, `${playerRank}, Points: ${playerScore}`);
  
  // Draw players
  for (let i = 0; i < group.length; i++) {
    const curPlayer = group[i];
    curPlayer.drawPlayer(ctx, playerIcons[curPlayer.playerNr % playerIcons.length]);

    if (curPlayer.collision(collectible)) {
      if (consoles) console.log("C: Collision reported for: ", curPlayer.id, " at ", `x: ${curPlayer.x}, y: ${curPlayer.y}`);
      socket.emit('collision', curPlayer, collectible);
    }
  }

  // Draw collectible
  if (collectible instanceof Collectible) {
    collectible.draw(ctx, collectibleIcons[collectible.icon - 1]);
  }

    // Adjust the desired frame rate by introducing a delay
    setTimeout(() => {
      requestAnimationFrame(renderGame);
    }, 1000 / 180); // Set the frame rate to 30 frames per second (fps)

}

renderGame();