require('dotenv').config();
const http = require("http");
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socketio = require('socket.io');
const helmet = require('helmet');
const nocache = require('nocache');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const app = express();
const server = http.createServer(app);
const io = new socketio(server);
const { v4: uuidv4 } = require('uuid'); // Creates unique ids via uuidv4();



const Group = require('./helper/group');
const group = new Group();


// Game mechanic requirements
import Player from "./public/Player.mjs";
import gameConfig from './public/gameConfig';
import Collectible from "./public/Collectible.mjs";
import createRandomCollectible from "./helper/collectibles.js";

const consoles = gameConfig.consoles; // Variable to print console logs while testing

/*
app.use(
  helmet({
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: {
      setTo: 'PHP 7.4.3',
    },
  })
);*/

app.use(
  helmet.xssFilter(),
  (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  },
  helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' })
);

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

app.use(nocache());

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 



//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

function emitGroup (io) {
  io.emit("groupUpdate", group.getGroup()); // Broadcasts players object to all
}

function broadcastGroup (socket) {
  // Broadcasts group only to all other players
  io.broadcasts.emit("groupUpdate", group.getGroup());
}

// Initiate first collectible
let collectible = createRandomCollectible();

// Set up listeners

// Listen for a new connection
io.on('connection', (socket) => {
  let socketID = socket.id;
  
  socket.emit('freeNr', group.nextFree());

  socket.on('joinRequest', (player) => {
    if (consoles) console.log("S: New player joined: ", socket.id, "\n Now connected players: ", group.getPlayerNrs());
    group.addPlayer(player);  
    emitGroup(io);
  })

  socket.emit('newCollectible', collectible);
  if (consoles) console.log("S: Emitted new collectible: \n", collectible);

  
  // Event listener for player movement
  socket.on('playerMove', (player) => {
    if (player){
      group.updatePlayer(player);
      emitGroup(io);
    }
  })



  // Logic to react to collectible collisions
  socket.on('collision', (player, collectible) => {
    // Player gets the value
    group.increaseScore(player, collectible);
    // Send stat update
    emitGroup(io);
    // Create and send new collectible
    collectible = createRandomCollectible();
    io.emit('newCollectible', collectible);
  })
  

  // Remove player when disconnected
  socket.on("disconnect", () => {
    if (consoles) console.log(`S: Removing player: ${socketID} from group: `, group.getGroup());
    group.removePlayer(socketID);
    if (consoles) {console.log(">>>>S:\n  S: Client disconnected: ", socketID, 
              "\n  Now connected: ", group.getPlayerNrs())};
    emitGroup(io);
    console.log("S: Player removed. Group: ", group.getGroup());
  
  })

});




// Set up server and tests

server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = server; // For testing
