const iconPathPlayersPNG = '/assets/icons/playerPNG';
const iconPathCollectiblesPNG = '/assets/icons/collectiblePNG';

const isSvgSupported = typeof SVGRect !== 'undefined'

const gameConfig = {
  title: "Kinda snakey snake game",
  controllInstructions: "Controll with WASD or arrow keys",
  gamescreenWidth: 640,
  gamescreenHeight: 480,
  padding: 0,
  infoFieldHeight: 40,
  consoles: true,
  get field() {
    return {
      width: (this.gamescreenWidth),
      height: (this.gamescreenHeight - this.infoFieldHeight)
    };
  },
  avatar: {
    width: 40,
    height: 40,
    iconSrc: [iconPathPlayersPNG + "/p1.png", 
      iconPathPlayersPNG + "/p2.png", 
      iconPathPlayersPNG + "/p3.png", 
      iconPathPlayersPNG + "/p4.png", 
      iconPathPlayersPNG + "/p5.png"],
  },
  collectibles: {
    width: 20,
    height: 20,
    iconSrc: [iconPathCollectiblesPNG + '/c1.png', 
      iconPathCollectiblesPNG + '/c2.png', 
      iconPathCollectiblesPNG + '/c3.png', 
      iconPathCollectiblesPNG + '/c4.png', 
      iconPathCollectiblesPNG + '/c5.png']
  }
};

export default gameConfig;  