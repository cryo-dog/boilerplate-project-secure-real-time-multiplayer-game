
class group {
  constructor() {
    this.playerArray = [];
  }

  getPlayerNrs() {
    return this.playerArray.length;
  }

  getPlayerNrById(id) {
    // Checks if ID is in the player array. Returns index if yes, false if not
    let playerIndex = this.playerArray.findIndex((item) => item.id === id);
    return playerIndex >= 0 ? this.playerArray[playerIndex].playerNr : false;
  }

  getGroup() {
    return this.playerArray;
  }

  addPlayer({id, x, y, score, playerNr, rank}) {
    let playerIndex = this.getPlayerNrById(id);
    if (!this.getPlayerNrById(id) && id) {
      this.playerArray.push({id: id, 
            playerNr: playerNr,
            x: x,
            y: y,
            score: score,
            rank: rank});
          }
  }

  increaseScore({id}, {value}) {
    const playerItem = this.playerArray.find(player => player.id == id);
    playerItem.score = playerItem.score + value + 1;
  }

  updatePlayer({id, x, y, score, rank}) {
    try {
      let playerIndex = this.playerArray.findIndex((item) => item.id === id);

      if (playerIndex !== -1) {
        this.playerArray[playerIndex] = {
          ...this.playerArray[playerIndex],
          x: x,
          y: y,
          score: score,
          rank: rank
        }
      }
    } catch (err) {
      console.error("Could not update: \n", err);
    }
  }

  removePlayer(id) {
    this.playerArray = this.playerArray.filter((x) => x.id !== id);
  }

  nextFree(i = 1) {
    const existingNumbers = this.playerArray.map((player) => player.playerNr);
    while (existingNumbers.includes(i)) {
      i += 1;
    }
    return i;
  }


}

module.exports = group;
