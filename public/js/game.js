const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    } 
  };

this.socket = io();
const game = new Phaser.Game(config);

function preload() {
    this.load.image("overworld", "./assets/img/overworld.png")
    this.load.image("character", "./assets/img/character.png")
    this.load.image("objects", "./assets/img/objects.png")

    this.load.tilemapTiledJSON("map", "./assets/maps/map.json")
}

function create() {

    // CAMERA SETUP
    // 1600x1600 for current tilemap size
    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.setZoom(2);
    this.cameras.main.centerOn(800, 800);

    // MAP SETUP

    // generated tiled map
    let map = this.add.tilemap("map");
    let overworld = map.addTilesetImage("overworld")
    // not required atm but will in future
    // let objects = map.addTilesetImage("objects")
    // let character = map.addTilesetImage("character")
    // let npc_test = map.addTilesetImage("npc_test")

    // layers
    let topLayer = map.createStaticLayer("top", [overworld], 0, 0).setDepth(1);
    let middleLayer = map.createStaticLayer("middle", [overworld], 0, 0).setDepth(-1);
    let baseLayer = map.createStaticLayer("base", [overworld], 0, 0).setDepth(-2);

    // map collisions
    // by tile property in top layer
    topLayer.setCollisionByProperty({collides: true});

    // UI SETUP

    // playerRisk UI
    let playerRisk = this.add.text(16, 16, 'Infection risk', {
        fontSize: '16px',
        padding: { x: 10, y: 5 },
        backgroundColor: 'red',
        fill: 'black'
    });
    // makes playerRisk so it will stay in same place on screen
    playerRisk.setScrollFactor(0);

}

function update() {}