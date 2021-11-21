import { LoadScene } from "../scenes/LoadScene.js";
import { MenuScene } from "../scenes/MenuScene.js";
import { LobbyScene } from "../scenes/LobbyScene.js";
import { GameScene } from "../scenes/GameScene.js";
import { GameUI } from "../scenes/GameUI.js";
import { GameVirtualController } from "../scenes/GameVirtualController.js";
import { PostRoundScene } from "../scenes/PostRoundScene.js";
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
  input: {
    activePointers: 3,
  },
  render: {
    antialias: false,
    roundPixels: true,
    pixelArt: true,
    clearBeforeRender: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: [
    LoadScene,
    MenuScene,
    LobbyScene,
    GameScene,
    GameVirtualController,
    GameUI,
    PostRoundScene,
  ],
};

// Grab fullscreen status for different browsers
function fullScreenStatus() {
  if (document.fullscreenElement) {
    return true;
  } else if (document.webkitFullscreenElement) {
    return true;
  } else if (document.mozFullScreenElement) {
    return true;
  } else {
    return false;
  }
}

// call canvas to fullscreen if avaliable
function goFullscreen() {
  // end early if already at fullscreen
  if (fullScreenStatus()) {
    return;
  }

  let canvas = document.getElementsByTagName("canvas");
  let requestFullScreen =
    canvas.requestFullscreen ||
    canvas.msRequestFullscreen ||
    canvas.mozRequestFullScreen ||
    canvas.webkitRequestFullscreen;

  if (requestFullScreen) () => requestFullScreen.call(canvas);
}

document.addEventListener("DOMContentLoaded", (event) => {
  // Create game
  const game = new Phaser.Game(config);

  // make sure canvas has been built before attempting to go fullscreen
  goFullscreen();
});
