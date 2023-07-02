import gameConfig from './gameConfig.mjs';
const {
  title,
  controllInstructions,
  gameWindowWidth,
  padding,
  collectibles,
  avatar,
  consoles,
  infoFieldHeight,
  field,
} = gameConfig;



export default class Player {
  constructor({x, y, score, id, playerNr, rank}) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.dir = null;
    this.score = score;
    this.id = id;
    this.playerNr = playerNr;
    this.rank = rank;

  }

  // Function to move the player towards a direction given by WASD
  movePlayer(dir, speed) {
    
    const directions = dir.split("-"); // Split the composite direction if present
  
    for (const direction of directions) {
      switch (direction) {
        case "up":
          this.y = Math.max(this.y - this.speed, infoFieldHeight);
          break;
        case "down":
          this.y = Math.min(this.y + this.speed, infoFieldHeight + field.height - avatar.height);
          break;
        case "right":
          this.x = Math.min(this.x + this.speed, field.width - avatar.width);
          break;
        case "left":
          this.x = Math.max(this.x - this.speed, padding);
          break;
        default:
          // Nothing
      }
    }
  }

  drawPlayer(ctx, playerIcon) {
    // Move before drawing (if direction) and then draw

    if (this.dir) {
      this.movePlayer(this.dir, this.speed);
    }

    ctx.drawImage(playerIcon, this.x, this.y, avatar.width, avatar.height);
  }

  updateStats({x, y, score}) {
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
    if (score !== undefined) this.score = score;
  }

  updateScore(score) {
    this.score = score;
  }

  collision(item) {
    // Calculate the boundaries of the items
    const thisLeft = this.x;
    const thisRight = this.x + avatar.width;
    const thisTop = this.y;
    const thisBottom = this.y + avatar.height;
    const itemLeft = item.x;
    const itemRight = item.x + collectibles.width;
    const itemTop = item.y;
    const itemBottom = item.y + collectibles.height;
  
    // Check for overlap
    if (
      thisLeft < itemRight &&
      thisRight > itemLeft &&
      thisTop < itemBottom &&
      thisBottom > itemTop
    ) {
      if (consoles) console.log("C: Collision detected");
      return true;
    } else {
      return false;
    }
  }
  
  

  calculateRank(arr) {
    // Take an array of players in and check which position this player has
    // Return the position of the player
    arr.sort((a,b) => b.score - a.score);
    const rank = arr.findIndex(player => player.id == this.id) + 1;
    this.rank = `Rank: ${rank}/${arr.length}`;
    return this.rank;
  }
}
