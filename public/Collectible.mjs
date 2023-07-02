import gameConfig from './gameConfig.mjs';
const {
  title,
  controllInstructions,
  gameWindowWidth,
  padding,
  avatar,
  collectibles,
  infoFieldHeight,
  field,
} = gameConfig;


class Collectible {
  constructor({x, y, value, id, icon}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.icon = icon;
  }

  draw(ctx, icon) {
    ctx.drawImage(icon, this.x, this.y, collectibles.width, collectibles.height);
  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
