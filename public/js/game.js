const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1600,
    physics: {
      default: 'arcade',
      roundPixels: true,
      pixelArt: true,
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

const game = new Phaser.Game(config);

function preload() {
    

    this.load.image("overworld", "./assets/img/overworld.png");
    this.load.image("objects", "./assets/img/objects.png");
    // this.load.tilemapTiledJSON("map", "./assets/maps/map.json");
    this.load.tilemapTiledJSON("bottom_left_skirt", "./assets/maps/map_skirts/bottom_left_skirt.json");
    this.load.tilemapTiledJSON("bottom_right_skirt", "./assets/maps/map_skirts/bottom_right_skirt.json");
    this.load.tilemapTiledJSON("bottom_skirt", "./assets/maps/map_skirts/bottom_skirt.json");
    this.load.tilemapTiledJSON("left_skirt", "./assets/maps/map_skirts/left_skirt.json");
    this.load.tilemapTiledJSON("right_skirt", "./assets/maps/map_skirts/right_skirt.json");
    this.load.tilemapTiledJSON("top_left_skirt", "./assets/maps/map_skirts/top_left_skirt.json");
    this.load.tilemapTiledJSON("top_right_skirt", "./assets/maps/map_skirts/top_right_skirt.json");
    this.load.tilemapTiledJSON("top_skirt", "./assets/maps/map_skirts/top_skirt.json");
    this.load.tilemapTiledJSON("chunk1", "./assets/maps/map_chunks/chunk1.json");
    this.load.tilemapTiledJSON("chunk2", "./assets/maps/map_chunks/chunk2.json");
    this.load.tilemapTiledJSON("chunk3", "./assets/maps/map_chunks/chunk3.json");
    this.load.tilemapTiledJSON("chunk4", "./assets/maps/map_chunks/chunk4.json");
    this.load.tilemapTiledJSON("chunk5", "./assets/maps/map_chunks/chunk5.json");
    this.load.tilemapTiledJSON("chunk6", "./assets/maps/map_chunks/chunk6.json");
    this.load.tilemapTiledJSON("chunk7", "./assets/maps/map_chunks/chunk7.json");
    this.load.tilemapTiledJSON("chunk8", "./assets/maps/map_chunks/chunk8.json");
    this.load.tilemapTiledJSON("chunk9", "./assets/maps/map_chunks/chunk9.json");
    this.load.atlas("character", "./assets/img/characterSprites.png", "./assets/img/characterSprites.json");
}

function create() {
  
  // CAMERA SETUP
    // 1600x1600 for current tilemap size
    //unzoomed camera, used to see the whole map
    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.setZoom(1);

    //zoomed camera, used for gameplay
    // this.cameras.main.setBounds(0, 0, 1600, 1600);
    // this.cameras.main.setZoom(2);

    // MAP SETUP
    // set game world boundary
    this.physics.world.setBounds(0, 0, 1600, 1600);

    // generated tiled map
    const top_left_skirt = this.add.tilemap("top_left_skirt");
    const top_right_skirt = this.add.tilemap("top_right_skirt");
    const top_skirt = this.add.tilemap("top_skirt");
    const left_skirt = this.add.tilemap("left_skirt");
    const right_skirt = this.add.tilemap("right_skirt");
    const bottom_left_skirt = this.add.tilemap("bottom_left_skirt");
    const bottom_right_skirt = this.add.tilemap("bottom_right_skirt");
    const bottom_skirt = this.add.tilemap("bottom_skirt");
    const chunk1 = this.add.tilemap("chunk1");
    const chunk2 = this.add.tilemap("chunk2");
    const chunk3 = this.add.tilemap("chunk3");
    const chunk4 = this.add.tilemap("chunk4");
    const chunk5 = this.add.tilemap("chunk5");
    const chunk6 = this.add.tilemap("chunk6");
    const chunk7 = this.add.tilemap("chunk7");
    const chunk8 = this.add.tilemap("chunk8");
    const chunk9 = this.add.tilemap("chunk9");
    //I think these can be heavily condensed to only one for the overworld and one for the objects
    const overworld = chunk1.addTilesetImage("overworld");
    const objects = chunk1.addTilesetImage("objects");
    // not required atm but will in future
    // let objects = map.addTilesetImage("objects")
    // let character = map.addTilesetImage("character")
    // let npc_test = map.addTilesetImage("npc_test")

    // LAYERS
    //top left corner skirt layer
    const top_left_skirt_baseLayer = top_left_skirt.createStaticLayer("base", [overworld], 0, 0).setDepth(-2);
    //top middle corner skirt layer
    const top_skirt_baseLayer = top_skirt.createStaticLayer("base", [overworld], 560, 0).setDepth(-2);
    //top right corner skirt layer
    const top_right_skirt_baseLayer = top_right_skirt.createStaticLayer("base", [overworld], 1040, 0).setDepth(-2);
    //left skirt layer
    const left_skirt_baseLayer = left_skirt.createStaticLayer("base", [overworld], 0, 560).setDepth(-2);
    //right skirt layer
    const right_skirt_baseLayer = right_skirt.createStaticLayer("base", [overworld], 1120, 560).setDepth(-2);
    //bottom left corner skirt layer
    const bottom_left_skirt_baseLayer = bottom_left_skirt.createStaticLayer("base", [overworld], 0, 1040).setDepth(-2);
    //bottom middle corner skirt layer
    const bottom_skirt_baseLayer = bottom_skirt.createStaticLayer("base", [overworld], 560, 1120).setDepth(-2);
    //bottom right corner skirt layer
    const bottom_right_skirt_baseLayer = bottom_right_skirt.createStaticLayer("base", [overworld], 1040, 1040).setDepth(-2);

    // array filled with chunks
    const chunk_array = new Array(chunk1, chunk2, chunk3, chunk4, chunk5, chunk6, chunk7, chunk8, chunk9);

    // randomly generated layers
    // this var is a randomly generated chunk in an array between 0 and the length of the chunk array - 1
    var first_chunk = chunk_array[Math.floor(Math.random() * chunk_array.length)]
    const first_chunk_top = first_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*0, 80 + 30*0).setDepth(1);
    const first_chunk_middle = first_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*0, 80 + 30*0).setDepth(-1);
    const first_chunk_bottom = first_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*0, 80 + 30*0).setDepth(-2);
    // this removes the randomly chosen chunk from the array, reducing the size of the array by 1
    chunk_array.splice(chunk_array.indexOf(first_chunk), 1);

    var second_chunk = chunk_array[Math.floor(Math.random() * chunk_array.length)]
    const second_chunk_top = second_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*16, 80 + 30*0).setDepth(1);
    const second_chunk_middle = second_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*16, 80 + 30*0).setDepth(-1);
    const second_chunk_bottom = second_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*16, 80 + 30*0).setDepth(-2);
    chunk_array.splice(chunk_array.indexOf(second_chunk), 1);

    var third_chunk = chunk_array[Math.floor(Math.random() * chunk_array.length)]
    const third_chunk_top = third_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*32, 80 + 30*0).setDepth(1);
    const third_chunk_middle = third_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*32, 80 + 30*0).setDepth(-1);
    const third_chunk_bottom = third_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*32, 80 + 30*0).setDepth(-2);
    chunk_array.splice(chunk_array.indexOf(third_chunk), 1);

    var fourth_chunk = chunk_array[Math.floor(Math.random() * chunk_array.length)]
    const fourth_chunk_top = fourth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*0, 80 + 30*16).setDepth(1);
    const fourth_chunk_middle = fourth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*0, 80 + 30*16).setDepth(-1);
    const fourth_chunk_bottom = fourth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*0, 80 + 30*16).setDepth(-2);
    chunk_array.splice(chunk_array.indexOf(fourth_chunk), 1);

    var fifth_chunk = chunk_array[Math.floor(Math.random() * chunk_array.length)]
    const fifth_chunk_top = fifth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*16, 80 + 30*16).setDepth(1);
    const fifth_chunk_middle = fifth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*16, 80 + 30*16).setDepth(-1);
    const fifth_chunk_bottom = fifth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*16, 80 + 30*16).setDepth(-2);
    chunk_array.splice(chunk_array.indexOf(fifth_chunk), 1);

    var sixth_chunk = chunk_array[Math.floor(Math.random() * chunk_array.length)]
    const sixth_chunk_top = sixth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*32, 80 + 30*16).setDepth(1);
    const sixth_chunk_middle = sixth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*32, 80 + 30*16).setDepth(-1);
    const sixth_chunk_bottom = sixth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*32, 80 + 30*16).setDepth(-2);
    chunk_array.splice(chunk_array.indexOf(sixth_chunk), 1);

    var seventh_chunk = chunk_array[Math.floor(Math.random() * chunk_array.length)]
    const seventh_chunk_top = seventh_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*0, 80 + 30*32).setDepth(1);
    const seventh_chunk_middle = seventh_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*0, 80 + 30*32).setDepth(-1);
    const seventh_chunk_bottom = seventh_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*0, 80 + 30*32).setDepth(-2);
    chunk_array.splice(chunk_array.indexOf(seventh_chunk), 1);

    var eighth_chunk = chunk_array[Math.floor(Math.random() * chunk_array.length)]
    const eighth_chunk_top = eighth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*16, 80 + 30*32).setDepth(1);
    const eighth_chunk_middle = eighth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*16, 80 + 30*32).setDepth(-1);
    const eighth_chunk_bottom = eighth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*16, 80 + 30*32).setDepth(-2);
    chunk_array.splice(chunk_array.indexOf(eighth_chunk), 1);

    var ninth_chunk = chunk_array[Math.floor(Math.random() * chunk_array.length)]
    const ninth_chunk_top = ninth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*32, 80 + 30*32).setDepth(1);
    const ninth_chunk_middle = ninth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*32, 80 + 30*32).setDepth(-1);
    const ninth_chunk_bottom = ninth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*32, 80 + 30*32).setDepth(-2);


    // map collisions
    // by tile property in top layer
    // first_chunk_top.setCollisionByProperty({collides: true});
 

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

    // PLAYER SETUP

    let self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();

    this.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });

    this.socket.on('currentPlayers', function (players) {
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id]);
        } else {
          addOtherPlayers(self, players[id]);
        }
      });
    });

    this.socket.on('newPlayer', function (playerInfo) {
      addOtherPlayers(self, playerInfo);
    });

    this.socket.on('disconnect', function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });

    function addPlayer(self, playerInfo) {
      // generate 
      self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'character', 0).setOrigin(0.5, 0.5);
      self.player.setCollideWorldBounds(true);
      self.player.set

      // set camera to follow player
      self.cameras.main.startFollow(self.player);

      // Player Animations

      self.anims.create({
          key: 'walkDown',
          repeat: -1,
          frameRate: 10,
          frames: self.anims.generateFrameNames("character", {
            prefix: "character_",
            suffix: ".png",
            start: 1,
            end: 4,
            zeroPad: 2
          })
      });

      self.anims.create({
          key: 'walkUp',
          repeat: -1,
          frameRate: 10,
          frames: self.anims.generateFrameNames("character", {
            prefix: "character_",
            suffix: ".png",
            start: 20,
            end: 23,
            zeroPad: 2
          })
      });

      self.anims.create({
          key: 'walkLeft',
          repeat: -1,
          frameRate: 10,
          frames: self.anims.generateFrameNames("character", {
            prefix: "character_",
            suffix: ".png",
            start: 28,
            end: 31,
            zeroPad: 2
          })
      });

      self.anims.create({
        key: 'walkRight',
        repeat: -1,
        frameRate: 10,
        frames: self.anims.generateFrameNames("character", {
          prefix: "character_",
          suffix: ".png",
          start: 9,
          end: 12,
          zeroPad: 2
        })
      });

      self.anims.create({
        key: 'stand',
        repeat: -1,
        frameRate: 10,
        frames: self.anims.generateFrameNames("character", {
          prefix: "character_",
          suffix: ".png",
          start: 28,
          end: 31,
          zeroPad: 2
        })
      });

    }

    function addOtherPlayers(self, playerInfo) {
      const otherPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'character', 0).setOrigin(0.5, 0.5);
      otherPlayer.playerId = playerInfo.playerId;
      self.otherPlayers.add(otherPlayer);
    }
    
    // CONTROLS SETUP
    // keyboard inputs
    self.cursors = this.input.keyboard.createCursorKeys();

    // TESTING
    
  }

function update() {

  // PLAYER MOVEMENT

  let playerMovementSpeed = 100;
  if (this.player) {
      // left button down walk left
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-playerMovementSpeed);
        this.player.setVelocityY(0);
        this.player.anims.play('walkLeft', true);
      }
      // right button down walk right
      else if (this.cursors.right.isDown) {
        this.player.setVelocityX(playerMovementSpeed);
        this.player.setVelocityY(0);
        this.player.anims.play('walkRight', true);
      }
      // down button down walk down
      else if (this.cursors.down.isDown){
        this.player.setVelocityY(playerMovementSpeed);
        this.player.setVelocityX(0);
        this.player.anims.play('walkDown', true);
      }
      // up button down walk up
      else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-playerMovementSpeed);
        this.player.setVelocityX(0);
        this.player.anims.play('walkUp', true);
      }
      // no button down stop animation and stop player velocity
      else {
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.anims.stop();
      }

      // emit player movement
      let x = this.player.x;
      let y = this.player.y;
      if (this.player.oldLocation && (x !== this.player.oldLocation.x || y !== this.player.oldLocation.y)) {
        this.socket.emit('playerMovement', {x: this.player.x, y: this.player.y});
      }
      
      // save old position data
      this.player.oldLocation = {
        x: this.player.x,
        y: this.player.y,
      };
  }

}