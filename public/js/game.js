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

const game = new Phaser.Game(config);

function preload() {
    

    this.load.image("overworld", "./assets/img/overworld.png")
    this.load.image("objects", "./assets/img/objects.png")
    this.load.tilemapTiledJSON("map", "./assets/maps/map.json")
    this.load.atlas("character", "./assets/img/characterSprites.png", "./assets/img/characterSprites.json")
}

function create() {
  
  // CAMERA SETUP
    // 1600x1600 for current tilemap size
    this.cameras.main.setBounds(0, 0, 800, 800);
    this.cameras.main.setZoom(2.5);
    this.cameras.main.centerOn(400, 300);
    this.cameras.roundPixels = true;

    // MAP SETUP
    // set game world boundary
    // game.world.setBounds(0, 0, 800, 800);

    // generated tiled map
    const map = this.add.tilemap("map");
    const overworld = map.addTilesetImage("overworld")
    // not required atm but will in future
    // let objects = map.addTilesetImage("objects")
    // let character = map.addTilesetImage("character")
    // let npc_test = map.addTilesetImage("npc_test")

    // layers
    const topLayer = map.createStaticLayer("top", [overworld], 0, 0).setDepth(1);
    const middleLayer = map.createStaticLayer("middle", [overworld], 0, 0).setDepth(-1);
    const baseLayer = map.createStaticLayer("base", [overworld], 0, 0).setDepth(-2);

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

  // Lock camer to player
  // this.cameras.startFollow(this.player)

  let playerMovementSpeed = 100;
  if (this.player) {
      // left button down walk left
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-playerMovementSpeed);
        this.player.anims.play('walkLeft', true);
      }
      // right button down walk right
      else if (this.cursors.right.isDown) {
        this.player.setVelocityX(playerMovementSpeed);
        this.player.anims.play('walkRight', true);
      }
      // down button down walk down
      else if (this.cursors.down.isDown){
        this.player.setVelocityY(playerMovementSpeed);
        this.player.anims.play('walkDown', true);
      }
      // up button down walk up
      else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-playerMovementSpeed);
        this.player.anims.play('walkUp', true);
      }
      // no button down stand
      else {
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        // this.player.anims.play('stand');
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