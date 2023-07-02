import gameConfig from './gameConfig.mjs'

const {title, 
  controllInstructions, 
  padding, 
  infoFieldHeight, 
  field,
  gamescreenWidth,
  gamescreenHeight} = gameConfig;

function drawUI(ctx, playerRank) {
  // We import the context to be drawn and the current playerRank

  // Draw game field
  ctx.beginPath();
  ctx.rect(padding, infoFieldHeight, field.width, field.height);
  ctx.strokeStyle = '#a8a8ac';
  ctx.stroke();
  ctx.closePath();

  // Game info text y position
  const infoTextPosY = infoFieldHeight / 1.5;

  // Game control
  ctx.fillStyle = '#000000';
  ctx.font = `12px Arial`;
  ctx.textAlign = 'start';
  ctx.fillText(controllInstructions, padding, infoTextPosY);

  // Game title
  ctx.fillStyle = '#000000';
  ctx.font = `15px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(title, gamescreenWidth / 2, infoTextPosY);

  // Player's rank
  ctx.fillStyle = '#000000';
  ctx.font = `12px Arial`;
  ctx.textAlign = 'end';
  ctx.fillText(playerRank, gamescreenWidth - padding, infoTextPosY);
}



export default drawUI;