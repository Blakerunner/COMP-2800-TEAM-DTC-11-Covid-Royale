import {GameUI} from "../scenes/GameUI.js"
import {GameVirtualController} from "../scenes/GameVirtualController.js"
export class GameScene extends Phaser.Scene {
  constructor(){
    super({
      key: "GameScene",
      active: false
      })

      this.virtualControllerStates = {}
      this.mapBlueprint = []
  }

  init(){
    console.log("GameScene start")
    // initilise socket
    this.socket = io();
  }
  
  preload(){
    
  }
  
  create(){

    // ADD SCENES
    this.scene.add('GameVirtualController', GameVirtualController, true, { x: 0, y: 0 });
    this.scene.add('GameUI', GameUI, true, { x: 0, y: 0 });

     // CAMERA SETUP
    // 1600x1600 for current tilemap size
    //unzoomed camera, used to see the whole map
    // this.cameras.main.setBounds(0, 0, 1600, 1600);
    // this.cameras.main.setZoom(1);

    //zoomed camera, used for gameplay
    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.setZoom(1.8);

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
    this.socket.emit('mapBlueprintReady');
    this.socket.on('mapBlueprint', generateMap, this);

    function generateMap(mapData) {
    console.log("Map Blueprint:", mapData)
    var first_chunk = chunk_array[mapData[0]]
    const first_chunk_top = first_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*0, 80 + 30*0).setDepth(1);
    const first_chunk_middle = first_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*0, 80 + 30*0).setDepth(-1);
    const first_chunk_bottom = first_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*0, 80 + 30*0).setDepth(-2);

    var second_chunk = chunk_array[mapData[1]]
    const second_chunk_top = second_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*16, 80 + 30*0).setDepth(1);
    const second_chunk_middle = second_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*16, 80 + 30*0).setDepth(-1);
    const second_chunk_bottom = second_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*16, 80 + 30*0).setDepth(-2);

    var third_chunk = chunk_array[mapData[2]]
    const third_chunk_top = third_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*32, 80 + 30*0).setDepth(1);
    const third_chunk_middle = third_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*32, 80 + 30*0).setDepth(-1);
    const third_chunk_bottom = third_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*32, 80 + 30*0).setDepth(-2);

    var fourth_chunk = chunk_array[mapData[3]]
    const fourth_chunk_top = fourth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*0, 80 + 30*16).setDepth(1);
    const fourth_chunk_middle = fourth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*0, 80 + 30*16).setDepth(-1);
    const fourth_chunk_bottom = fourth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*0, 80 + 30*16).setDepth(-2);

    var fifth_chunk = chunk_array[mapData[4]]
    const fifth_chunk_top = fifth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*16, 80 + 30*16).setDepth(1);
    const fifth_chunk_middle = fifth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*16, 80 + 30*16).setDepth(-1);
    const fifth_chunk_bottom = fifth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*16, 80 + 30*16).setDepth(-2);

    var sixth_chunk = chunk_array[mapData[5]]
    const sixth_chunk_top = sixth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*32, 80 + 30*16).setDepth(1);
    const sixth_chunk_middle = sixth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*32, 80 + 30*16).setDepth(-1);
    const sixth_chunk_bottom = sixth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*32, 80 + 30*16).setDepth(-2);

    var seventh_chunk = chunk_array[mapData[6]]
    const seventh_chunk_top = seventh_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*0, 80 + 30*32).setDepth(1);
    const seventh_chunk_middle = seventh_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*0, 80 + 30*32).setDepth(-1);
    const seventh_chunk_bottom = seventh_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*0, 80 + 30*32).setDepth(-2);

    var eighth_chunk = chunk_array[mapData[7]]
    const eighth_chunk_top = eighth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*16, 80 + 30*32).setDepth(1);
    const eighth_chunk_middle = eighth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*16, 80 + 30*32).setDepth(-1);
    const eighth_chunk_bottom = eighth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*16, 80 + 30*32).setDepth(-2);

    var ninth_chunk = chunk_array[mapData[8]]
    const ninth_chunk_top = ninth_chunk.createStaticLayer("top", [objects, overworld], 80 + 30*32, 80 + 30*32).setDepth(1);
    const ninth_chunk_middle = ninth_chunk.createStaticLayer("middle", [objects, overworld], 80 + 30*32, 80 + 30*32).setDepth(-1);
    const ninth_chunk_bottom = ninth_chunk.createStaticLayer("base", [objects, overworld], 80 + 30*32, 80 + 30*32).setDepth(-2);
    

    // map collisions
    // skirt collision
    top_left_skirt_baseLayer.setCollisionByProperty({collides: true});
    top_right_skirt_baseLayer.setCollisionByProperty({collides: true});
    top_skirt_baseLayer.setCollisionByProperty({collides: true});
    right_skirt_baseLayer.setCollisionByProperty({collides: true});
    left_skirt_baseLayer.setCollisionByProperty({collides: true});
    bottom_right_skirt_baseLayer.setCollisionByProperty({collides: true});
    bottom_left_skirt_baseLayer.setCollisionByProperty({collides: true});
    bottom_skirt_baseLayer.setCollisionByProperty({collides: true});

    //individual chunk collision per layer
    first_chunk_bottom.setCollisionByProperty({collides: true});
    first_chunk_middle.setCollisionByProperty({collides: true});
    first_chunk_top.setCollisionByProperty({collides: true});
    second_chunk_bottom.setCollisionByProperty({collides: true});
    second_chunk_middle.setCollisionByProperty({collides: true});
    second_chunk_top.setCollisionByProperty({collides: true});
    third_chunk_bottom.setCollisionByProperty({collides: true});
    third_chunk_middle.setCollisionByProperty({collides: true});
    third_chunk_top.setCollisionByProperty({collides: true});
    fourth_chunk_bottom.setCollisionByProperty({collides: true});
    fourth_chunk_middle.setCollisionByProperty({collides: true});
    fourth_chunk_top.setCollisionByProperty({collides: true});
    fifth_chunk_bottom.setCollisionByProperty({collides: true});
    fifth_chunk_middle.setCollisionByProperty({collides: true});
    fifth_chunk_top.setCollisionByProperty({collides: true});
    sixth_chunk_bottom.setCollisionByProperty({collides: true});
    sixth_chunk_middle.setCollisionByProperty({collides: true});
    sixth_chunk_top.setCollisionByProperty({collides: true});
    seventh_chunk_bottom.setCollisionByProperty({collides: true});
    seventh_chunk_middle.setCollisionByProperty({collides: true});
    seventh_chunk_top.setCollisionByProperty({collides: true});
    eighth_chunk_bottom.setCollisionByProperty({collides: true});
    eighth_chunk_middle.setCollisionByProperty({collides: true});
    eighth_chunk_top.setCollisionByProperty({collides: true});
    ninth_chunk_bottom.setCollisionByProperty({collides: true});
    ninth_chunk_middle.setCollisionByProperty({collides: true});
    ninth_chunk_top.setCollisionByProperty({collides: true});
    }
    // PLAYER SETUP

    let self = this;
    this.otherPlayers = this.physics.add.group();
    this.otherPlayersNames = this.physics.add.group();

    this.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayersNames.getChildren().forEach(function (otherPlayerName) {
        if (playerInfo.playerId === otherPlayerName.playerId) {
          otherPlayerName.setPosition(playerInfo.x, playerInfo.y-18);
        }
      });
      
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
          if (playerInfo.playerDir === "stand") {
            otherPlayer.anims.stop();
          } else {
            console.log(playerInfo.playerId, "is moving", playerInfo.playerDir)
            otherPlayer.anims.play(playerInfo.playerDir, true);
          }
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
      self.otherPlayersNames.getChildren().forEach(function (otherPlayerName) {
        if (playerId === otherPlayerName.playerId) {
          otherPlayerName.destroy();
        }
      });
      });
    });

    function addPlayer(self, playerInfo) {
      // generate 
      self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'character', 0).setOrigin(0.5, 0.5);
      self.player.setCollideWorldBounds(true);
      //sets the collision bosy size and placement
      self.player.body.setSize(4,4,true).setOffset(5, 15);
      //makes the player collide with all collision masks per each chunks layer
      self.physics.add.collider(self.player, top_left_skirt_baseLayer);
      self.physics.add.collider(self.player, top_right_skirt_baseLayer);
      self.physics.add.collider(self.player, top_skirt_baseLayer);
      self.physics.add.collider(self.player, left_skirt_baseLayer);
      self.physics.add.collider(self.player, right_skirt_baseLayer);
      self.physics.add.collider(self.player, bottom_left_skirt_baseLayer);
      self.physics.add.collider(self.player, bottom_right_skirt_baseLayer);
      self.physics.add.collider(self.player, bottom_skirt_baseLayer);
      self.physics.add.collider(self.player, first_chunk_bottom);
      self.physics.add.collider(self.player, first_chunk_middle);
      self.physics.add.collider(self.player, first_chunk_top);
      self.physics.add.collider(self.player, second_chunk_bottom);
      self.physics.add.collider(self.player, second_chunk_middle);
      self.physics.add.collider(self.player, second_chunk_top);
      self.physics.add.collider(self.player, third_chunk_bottom);
      self.physics.add.collider(self.player, third_chunk_middle);
      self.physics.add.collider(self.player, third_chunk_top);
      self.physics.add.collider(self.player, fourth_chunk_bottom);
      self.physics.add.collider(self.player, fourth_chunk_middle);
      self.physics.add.collider(self.player, fourth_chunk_top);
      self.physics.add.collider(self.player, fifth_chunk_bottom);
      self.physics.add.collider(self.player, fifth_chunk_middle);
      self.physics.add.collider(self.player, fifth_chunk_top);
      self.physics.add.collider(self.player, sixth_chunk_bottom);
      self.physics.add.collider(self.player, sixth_chunk_middle);
      self.physics.add.collider(self.player, sixth_chunk_top);
      self.physics.add.collider(self.player, seventh_chunk_bottom);
      self.physics.add.collider(self.player, seventh_chunk_middle);
      self.physics.add.collider(self.player, seventh_chunk_top);
      self.physics.add.collider(self.player, eighth_chunk_bottom);
      self.physics.add.collider(self.player, eighth_chunk_middle);
      self.physics.add.collider(self.player, eighth_chunk_top);
      self.physics.add.collider(self.player, ninth_chunk_bottom);
      self.physics.add.collider(self.player, ninth_chunk_middle);
      self.physics.add.collider(self.player, ninth_chunk_top);

      self.player.playerDir = "stand"

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

      const otherPlayerName = self.add.text(playerInfo.x, playerInfo.y-18, playerInfo.playerName, {
        fontSize: '12px',
        padding: { x: 0, y: 0 },
        backgroundColor: 'white',
        fill: 'black',
        align: 'center'
      }).setOrigin(0.5, 0.5)
      otherPlayerName.playerId = playerInfo.playerId;
      self.otherPlayersNames.add(otherPlayerName);
    }
    
    // CONTROLS SETUP
    // keyboard inputs
    self.cursors = this.input.keyboard.createCursorKeys();

    // EVENTS
    // Virtual controller state event change
    this.scene.get('GameVirtualController').events.on('buttonUpdate', buttonUpdate, this);

    // Updates virutal button events
    function buttonUpdate(states) {
      this.virtualControllerStates = states
    }

  }

  update(){
     // CAMERA STICK
      if ((this.input.activePointer.isDown && this.cameraStickUnlocked) || this.input.activePointer.isDown &&
        (250 < this.input.activePointer.x && this.input.activePointer.x < 384) &&
        (96 < this.input.activePointer.y && this.input.activePointer.y < 224)) {
        if (this.cameraResetCounter === 0) {
          this.cameras.main.stopFollow()
          this.cameras.main.zoomTo(1, 500)
        }
        if (this.origDragPoint) {     
          this.cameras.main.scrollX += (this.input.activePointer.position.x - this.cameras.main.centerX) / 15;
          this.cameras.main.scrollY += (this.input.activePointer.position.y - this.cameras.main.centerY) / 15;
          this.cameraResetCounter = 0
          this.cameraStickUnlocked = true
        }
        this.origDragPoint = this.input.activePointer.position.clone();
      } else {
        this.cameraStickUnlocked = false
        this.cameraResetCounter++
        this.origDragPoint = null
        if (this.cameraResetCounter > 1000) this.cameraResetCounter = 100;
        if (this.cameraResetCounter === 20) {
          this.cameras.main.pan(this.player.x, this.player.y, 700, 'Linear')
        }
        if (this.cameraResetCounter === 65) {
          this.cameras.main.startFollow(this.player, false);
          this.cameras.main.zoomTo(1.8, 500)
        }
      } 

      // PLAYER MOVEMENT
    let playerMovementSpeed = 100;
    if (this.player) {
        // left button down walk left
        if (this.cursors.left.isDown || this.virtualControllerStates.left) {
          this.player.setVelocityX(-playerMovementSpeed);
          this.player.setVelocityY(0);
          this.player.anims.play('walkLeft', true);
          this.player.playerDir = "walkLeft"
        } 
        // right button down walk right
        else if (this.cursors.right.isDown || this.virtualControllerStates.right) {
          this.player.setVelocityX(playerMovementSpeed);
          this.player.setVelocityY(0);
          this.player.anims.play('walkRight', true);
          this.player.playerDir = "walkRight"
        }
        // down button down walk down
        else if (this.cursors.down.isDown || this.virtualControllerStates.down){
          this.player.setVelocityY(playerMovementSpeed);
          this.player.setVelocityX(0);
          this.player.anims.play('walkDown', true);
          this.player.playerDir = "walkDown"
        }
        // up button down walk up
        else if (this.cursors.up.isDown || this.virtualControllerStates.up) {
          this.player.setVelocityY(-playerMovementSpeed);
          this.player.setVelocityX(0);
          this.player.anims.play('walkUp', true);
          this.player.playerDir = "walkUp"
        }
        // no button down stop animation and stop player velocity
        else {
          this.player.setVelocityX(0);
          this.player.setVelocityY(0);
          // this.player.anims.stop();
          this.player.anims.stop();
          this.player.playerDir = "stand"
        }

        // emit player movement
        let x = this.player.x;
        let y = this.player.y;
        if (this.player.oldLocation && (x !== this.player.oldLocation.x || y !== this.player.oldLocation.y)) {
          this.socket.emit('playerMovement', {x: this.player.x, y: this.player.y, playerDir: this.player.playerDir});
        }
        
        // save old position data
        this.player.oldLocation = {
          x: this.player.x,
          y: this.player.y,
        };
    }
  }
}
