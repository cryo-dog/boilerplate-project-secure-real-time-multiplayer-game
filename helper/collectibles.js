import gameConfig from '../public/gameConfig';
import Collectible from "../public/Collectible.mjs";
const { v4: uuidv4 } = require('uuid'); // Creates unique ids via uuidv4();

const {field,
      padding,
      infoFieldHeight,
      collectibles} = gameConfig;

const numCollectibles = gameConfig.collectibles.iconSrc.length;

function createRandomCollectible() {
  // Random number beteween 1 and nr. of collectibles. Will correspond with the picture
  const randomNr = Math.round(Math.random() * (numCollectibles - 1)) + 1; 
  const ranX = Math.floor(Math.random() * (field.width - collectibles.width)) + 1 + padding;
  const rany = Math.floor(Math.random() * (field.height - collectibles.height)) + 1 + infoFieldHeight;
  const collectible = new Collectible({x: ranX, y: rany, value: randomNr, id: uuidv4(), icon: randomNr });
  return collectible;
}


try {
  module.exports = createRandomCollectible;
} catch(e) {}

export default createRandomCollectible;
