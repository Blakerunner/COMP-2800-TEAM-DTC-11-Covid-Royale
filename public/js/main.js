import {LoadScene} from "../scenes/LoadScene.js"
import {MenuScene} from "../scenes/MenuScene.js"
import {LobbyScene} from "../scenes/LobbyScene.js"
import {GameScene} from "../scenes/GameScene.js"
import {GameUI} from "../scenes/GameUI.js"
import {GameVirtualController} from "../scenes/GameVirtualController.js"
// Config game
const config = {
    type: Phaser.AUTO,
    parent: "phaser-game",
    width: 640,
    height: 360,
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    },
    render: {
        roundPixels: true,
        pixelArt: true
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }
      }
    },
    scene: [
        LoadScene, 
        MenuScene,
        LobbyScene,
        GameScene
      ]
  };

// Create game
const game = new Phaser.Game(config);