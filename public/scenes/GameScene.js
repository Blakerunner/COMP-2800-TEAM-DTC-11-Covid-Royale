import { GameUI } from "../scenes/GameUI.js";
import { GameVirtualController } from "../scenes/GameVirtualController.js";
import {PostRoundScene} from "../scenes/PostRoundScene.js"
var map_items = new Array;
var pickUpSounds = new Array;
var soundConfig = {
  mute: false,
  volume: 0.15,
  rate: 1,
  detune: 0,
  seek: 0,
  loop: false,
  delay: 0
}
export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene",
      active: false,
    });

    this.virtualControllerStates = {};
    this.playerScore = 0
    this.playerSpeedCheatCounter = 0
  }
  

  init() {

    console.log("GameScene start");
    // initilise socket
    this.socket = io();
  }

  preload() {
    this.load.bitmapFont('retroText', '.assets/bitmapFont/retro-gaming.png', '.assets/bitmapFont/retro-gaming.xml');
  }

  create() {

    // ADD SCENES
    this.scene.launch("GameVirtualController", GameVirtualController, true, {
      x: 0,
      y: 0,
    });
    this.scene.launch("GameUI", GameUI, true, { x: 0, y: 0 });

    // CAMERA SETUP
    // 1600x1600 for current tilemap size
    //unzoomed camera, used to see the whole map
    // this.cameras.main.setBounds(0, 0, 1600, 1600);
    // this.cameras.main.setZoom(1);

    //zoomed camera, used for gameplay
    this.cameras.main.fadeIn(1000, 0, 0, 0);
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
    //adding Tileset Images
    const overworld = chunk1.addTilesetImage("overworld", "overworld", 16, 16, 1, 2)
    const objects = chunk1.addTilesetImage("objects", "objects", 16, 16, 0, 0);

    // LAYERS
    //top left corner skirt layer
    const top_left_skirt_baseLayer = top_left_skirt
      .createStaticLayer("base", [overworld], 0, 0)
      .setDepth(-2);
    //top middle corner skirt layer
    const top_skirt_baseLayer = top_skirt
      .createStaticLayer("base", [overworld], 560, 0)
      .setDepth(-2);
    //top right corner skirt layer
    const top_right_skirt_baseLayer = top_right_skirt
      .createStaticLayer("base", [overworld], 1040, 0)
      .setDepth(-2);
    //left skirt layer
    const left_skirt_baseLayer = left_skirt
      .createStaticLayer("base", [overworld], 0, 560)
      .setDepth(-2);
    //right skirt layer
    const right_skirt_baseLayer = right_skirt
      .createStaticLayer("base", [overworld], 1120, 560)
      .setDepth(-2);
    //bottom left corner skirt layer
    const bottom_left_skirt_baseLayer = bottom_left_skirt
      .createStaticLayer("base", [overworld], 0, 1040)
      .setDepth(-2);
    //bottom middle corner skirt layer
    const bottom_skirt_baseLayer = bottom_skirt
      .createStaticLayer("base", [overworld], 560, 1120)
      .setDepth(-2);
    //bottom right corner skirt layer
    const bottom_right_skirt_baseLayer = bottom_right_skirt
      .createStaticLayer("base", [overworld], 1040, 1040)
      .setDepth(-2);

    // array filled with chunks
    const chunk_array = new Array(
      chunk1,
      chunk2,
      chunk3,
      chunk4,
      chunk5,
      chunk6,
      chunk7,
      chunk8,
      chunk9
    );

    // PLAYER SETUP

    let self = this;
    this.otherPlayers = this.physics.add.group();
    this.otherPlayersNames = this.physics.add.group();

    this.socket.on("playerMoved", function (playerInfo) {
      self.otherPlayersNames.getChildren().forEach(function (otherPlayerName) {
        if (playerInfo.playerId === otherPlayerName.playerId) {
          otherPlayerName.setPosition(playerInfo.x, playerInfo.y - 18);
        }
      });

      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          // updates otherPlayer postion
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
          // update otherPlayer covid status
          otherPlayer.covid = playerInfo.playerCovidPos
          if (playerInfo.playerDir === "stand") {
            otherPlayer.anims.stop();
          } else {
            otherPlayer.anims.play(playerInfo.playerDir, true);
          }
        }
      });
    });

    this.socket.on("currentPlayers", function (players) {
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id]);
        } else {
          addOtherPlayers(self, players[id]);
        }
      });
    });

    this.socket.on("newPlayer", function (playerInfo) {
      addOtherPlayers(self, playerInfo);
    });

    this.socket.on("disconnect", function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
        self.otherPlayersNames
          .getChildren()
          .forEach(function (otherPlayerName) {
            if (playerId === otherPlayerName.playerId) {
              otherPlayerName.destroy();
            }
          });
      });
    });
    // generate player character
    function addPlayer(self, playerInfo) {

      console.log("Players Made")
      // create sprite
      self.player = self.physics.add
        .sprite(playerInfo.x, playerInfo.y, "character", 0)
        .setOrigin(0.5, 0.5);

      // PLAYER DATA SETUP 
      // set up player score value
      self.player.score = 0
      self.player.risk = 0
      self.player.protection = 0
      self.player.covid = false
      self.player.speed = 100
      self.player.items = {hand: 0, mask: 0, haz: 0}
      self.player.scoreReduced = false

      // set camera to follow player
      self.cameras.main.startFollow(self.player)
      .setLerp(0.2, 0.2);

      // collision with world bounds
      self.player.setCollideWorldBounds(true);

      //sets the collision size and placement
      self.player.body.setSize(4, 4, true).setOffset(5, 15);

      //FIRST CHUNK
      //
      var first_chunk = chunk_array[playerInfo.mapBlueprint[0]];
      const first_chunk_top = first_chunk.createStaticLayer(
          "top",
          [objects, overworld],
          80 + 30 * 0,
          80 + 30 * 0
        )
        .setDepth(1);
        //loads all hand sanitizer items
      const first_chunk_hand = first_chunk.createFromObjects(
        "item",
        "hand",
        {key: "handSan"}
      );
      first_chunk_hand.forEach(item => {item.itemID = 1});
      //loads all face mask items
      const first_chunk_face = first_chunk.createFromObjects(
        "item",
        "face",
        {key: "faceMask"}
        );
        first_chunk_face.forEach(item => {item.itemID = 2});
      //loads all hazmat suit items
      const first_chunk_haz = first_chunk.createFromObjects(
        "item",
        "haz",
        {key: "hazSuit"}
        );
        first_chunk_haz.forEach(item => {item.itemID = 3});
      //combines all 3 item arrays into one array
      var first_chunk_items = first_chunk_face.concat(first_chunk_hand).concat(first_chunk_haz);
      //offsets the items by the chunks position to put them in the proper place
      first_chunk_items.forEach(item => {
        item.x = item.x + (80 + 30 * 0)
        item.y = item.y + (80 + 30 * 0)});
      const first_chunk_middle = first_chunk
        .createStaticLayer(
          "middle",
          [objects, overworld],
          80 + 30 * 0,
          80 + 30 * 0
        )
        .setDepth(-1);
      const first_chunk_bottom = first_chunk
        .createStaticLayer(
          "base",
          [objects, overworld],
          80 + 30 * 0,
          80 + 30 * 0
        )
        .setDepth(-2);

      //SECOND CHUNK
      //
      var second_chunk = chunk_array[playerInfo.mapBlueprint[1]];
      const second_chunk_top = second_chunk
        .createStaticLayer(
          "top",
          [objects, overworld],
          80 + 30 * 16,
          80 + 30 * 0
        )
        .setDepth(1);
        const second_chunk_hand = second_chunk.createFromObjects(
          "item",
          "hand",
          {key: "handSan"}
        );
        second_chunk_hand.forEach(item => {item.itemID = 1});
        const second_chunk_face = second_chunk.createFromObjects(
          "item",
          "face",
          {key: "faceMask"}
        );
        second_chunk_face.forEach(item => {item.itemID = 2});
        const second_chunk_haz = second_chunk.createFromObjects(
          "item",
          "haz",
          {key: "hazSuit"}
        );
        second_chunk_haz.forEach(item => {item.itemID = 3});
        var second_chunk_items = second_chunk_face.concat(second_chunk_hand).concat(second_chunk_haz);
        second_chunk_items.forEach(item => {
          item.x = item.x + (80 + 30 * 16)
          item.y = item.y + (80 + 30 * 0)});
      const second_chunk_middle = second_chunk
        .createStaticLayer(
          "middle",
          [objects, overworld],
          80 + 30 * 16,
          80 + 30 * 0
        )
        .setDepth(-1);
      const second_chunk_bottom = second_chunk
        .createStaticLayer(
          "base",
          [objects, overworld],
          80 + 30 * 16,
          80 + 30 * 0
        )
        .setDepth(-2);

      //THIRD CHUNK
      //
      var third_chunk = chunk_array[playerInfo.mapBlueprint[2]];
      const third_chunk_top = third_chunk
        .createStaticLayer(
          "top",
          [objects, overworld],
          80 + 30 * 32,
          80 + 30 * 0
        )
        .setDepth(1);
        const third_chunk_hand = third_chunk.createFromObjects(
          "item",
          "hand",
          {key: "handSan"}
        );
        third_chunk_hand.forEach(item => {item.itemID = 1});
        const third_chunk_face = third_chunk.createFromObjects(
          "item",
          "face",
          {key: "faceMask"}
        );
        third_chunk_face.forEach(item => {item.itemID = 2});
        const third_chunk_haz = third_chunk.createFromObjects(
          "item",
          "haz",
          {key: "hazSuit"}
        );
        third_chunk_haz.forEach(item => {item.itemID = 3});
        var third_chunk_items = third_chunk_face.concat(third_chunk_hand).concat(third_chunk_haz);
        third_chunk_items.forEach(item => {
          item.x = item.x + (80 + 30 * 32)
          item.y = item.y + (80 + 30 * 0)});
      const third_chunk_middle = third_chunk
        .createStaticLayer(
          "middle",
          [objects, overworld],
          80 + 30 * 32,
          80 + 30 * 0
        )
        .setDepth(-1);
      const third_chunk_bottom = third_chunk
        .createStaticLayer(
          "base",
          [objects, overworld],
          80 + 30 * 32,
          80 + 30 * 0
        )
        .setDepth(-2);

      //FOURTH CHUNK
      //
      var fourth_chunk = chunk_array[playerInfo.mapBlueprint[3]];
      const fourth_chunk_top = fourth_chunk
        .createStaticLayer(
          "top",
          [objects, overworld],
          80 + 30 * 0,
          80 + 30 * 16
        )
        .setDepth(1);
        const fourth_chunk_hand = fourth_chunk.createFromObjects(
          "item",
          "hand",
          {key: "handSan"}
        );
        fourth_chunk_hand.forEach(item => {item.itemID = 1});
        const fourth_chunk_face = fourth_chunk.createFromObjects(
          "item",
          "face",
          {key: "faceMask"}
        );
        fourth_chunk_face.forEach(item => {item.itemID = 2});
        const fourth_chunk_haz = fourth_chunk.createFromObjects(
          "item",
          "haz",
          {key: "hazSuit"}
        );
        fourth_chunk_haz.forEach(item => {item.itemID = 3});
        var fourth_chunk_items = fourth_chunk_face.concat(fourth_chunk_hand).concat(fourth_chunk_haz);
        fourth_chunk_items.forEach(item => {
          item.x = item.x + (80 + 30 * 0)
          item.y = item.y + (80 + 30 * 16)});
      const fourth_chunk_middle = fourth_chunk
        .createStaticLayer(
          "middle",
          [objects, overworld],
          80 + 30 * 0,
          80 + 30 * 16
        )
        .setDepth(-1);
      const fourth_chunk_bottom = fourth_chunk
        .createStaticLayer(
          "base",
          [objects, overworld],
          80 + 30 * 0,
          80 + 30 * 16
        )
        .setDepth(-2);

      //FIFTH CHUNK
      //
      var fifth_chunk = chunk_array[playerInfo.mapBlueprint[4]];
      const fifth_chunk_top = fifth_chunk
        .createStaticLayer(
          "top",
          [objects, overworld],
          80 + 30 * 16,
          80 + 30 * 16
        )
        .setDepth(1);
        const fifth_chunk_hand = fifth_chunk.createFromObjects(
          "item",
          "hand",
          {key: "handSan"}
        );
        fifth_chunk_hand.forEach(item => {item.itemID = 1});
        const fifth_chunk_face = fifth_chunk.createFromObjects(
          "item",
          "face",
          {key: "faceMask"}
        );
        fifth_chunk_face.forEach(item => {item.itemID = 2});
        const fifth_chunk_haz = fifth_chunk.createFromObjects(
          "item",
          "haz",
          {key: "hazSuit"}
        );
        fifth_chunk_haz.forEach(item => {item.itemID = 3});
        var fifth_chunk_items = fifth_chunk_face.concat(fifth_chunk_hand).concat(fifth_chunk_haz);
        fifth_chunk_items.forEach(item => {
          item.x = item.x + (80 + 30 * 16)
          item.y = item.y + (80 + 30 * 16)});
      const fifth_chunk_middle = fifth_chunk
        .createStaticLayer(
          "middle",
          [objects, overworld],
          80 + 30 * 16,
          80 + 30 * 16
        )
        .setDepth(-1);
      const fifth_chunk_bottom = fifth_chunk
        .createStaticLayer(
          "base",
          [objects, overworld],
          80 + 30 * 16,
          80 + 30 * 16
        )
        .setDepth(-2);

      //SIXTH CHUNK
      //
      var sixth_chunk = chunk_array[playerInfo.mapBlueprint[5]];
      const sixth_chunk_top = sixth_chunk
        .createStaticLayer(
          "top",
          [objects, overworld],
          80 + 30 * 32,
          80 + 30 * 16
        )
        .setDepth(1);
        const sixth_chunk_hand = sixth_chunk.createFromObjects(
          "item",
          "hand",
          {key: "handSan"}
        );
        sixth_chunk_hand.forEach(item => {item.itemID = 1});
        const sixth_chunk_face = sixth_chunk.createFromObjects(
          "item",
          "face",
          {key: "faceMask"}
        );
        sixth_chunk_face.forEach(item => {item.itemID = 2});
        const sixth_chunk_haz = sixth_chunk.createFromObjects(
          "item",
          "haz",
          {key: "hazSuit"}
        );sixth_chunk_haz.forEach(item => {item.itemID = 3});
        var sixth_chunk_items = sixth_chunk_face.concat(sixth_chunk_hand).concat(sixth_chunk_haz);
        sixth_chunk_items.forEach(item => {
          item.x = item.x + (80 + 30 * 32)
          item.y = item.y + (80 + 30 * 16)});
      const sixth_chunk_middle = sixth_chunk
        .createStaticLayer(
          "middle",
          [objects, overworld],
          80 + 30 * 32,
          80 + 30 * 16
        )
        .setDepth(-1);
      const sixth_chunk_bottom = sixth_chunk
        .createStaticLayer(
          "base",
          [objects, overworld],
          80 + 30 * 32,
          80 + 30 * 16
        )
        .setDepth(-2);

      //SEVENTH CHUNK
      //
      var seventh_chunk = chunk_array[playerInfo.mapBlueprint[6]];
      const seventh_chunk_top = seventh_chunk
        .createStaticLayer(
          "top",
          [objects, overworld],
          80 + 30 * 0,
          80 + 30 * 32
        )
        .setDepth(1);
        const seventh_chunk_hand = seventh_chunk.createFromObjects(
          "item",
          "hand",
          {key: "handSan"}
        );
        seventh_chunk_hand.forEach(item => {item.itemID = 1});
        const seventh_chunk_face = seventh_chunk.createFromObjects(
          "item",
          "face",
          {key: "faceMask"}
        );
        seventh_chunk_face.forEach(item => {item.itemID = 2});
        const seventh_chunk_haz = seventh_chunk.createFromObjects(
          "item",
          "haz",
          {key: "hazSuit"}
        );
        seventh_chunk_haz.forEach(item => {item.itemID = 3});
        var seventh_chunk_items = seventh_chunk_face.concat(seventh_chunk_hand).concat(seventh_chunk_haz);
        seventh_chunk_items.forEach(item => {
          item.x = item.x + (80 + 30 * 0)
          item.y = item.y + (80 + 30 * 32)});
      const seventh_chunk_middle = seventh_chunk
        .createStaticLayer(
          "middle",
          [objects, overworld],
          80 + 30 * 0,
          80 + 30 * 32
        )
        .setDepth(-1);
      const seventh_chunk_bottom = seventh_chunk
        .createStaticLayer(
          "base",
          [objects, overworld],
          80 + 30 * 0,
          80 + 30 * 32
        )
        .setDepth(-2);

      //EIGHTH CHUNK
      //
      var eighth_chunk = chunk_array[playerInfo.mapBlueprint[7]];
      const eighth_chunk_top = eighth_chunk
        .createStaticLayer(
          "top",
          [objects, overworld],
          80 + 30 * 16,
          80 + 30 * 32
        )
        .setDepth(1);
        const eighth_chunk_hand = eighth_chunk.createFromObjects(
          "item",
          "hand",
          {key: "handSan"}
        );
        eighth_chunk_hand.forEach(item => {item.itemID = 1});
        const eighth_chunk_face = eighth_chunk.createFromObjects(
          "item",
          "face",
          {key: "faceMask"}
        );
        eighth_chunk_face.forEach(item => {item.itemID = 2});
        const eighth_chunk_haz = eighth_chunk.createFromObjects(
          "item",
          "haz",
          {key: "hazSuit"}
        );
        eighth_chunk_haz.forEach(item => {item.itemID = 3});
        var eighth_chunk_items = eighth_chunk_face.concat(eighth_chunk_hand).concat(eighth_chunk_haz);
        eighth_chunk_items.forEach(item => {
          item.x = item.x + (80 + 30 * 16)
          item.y = item.y + (80 + 30 * 32)});
      const eighth_chunk_middle = eighth_chunk
        .createStaticLayer(
          "middle",
          [objects, overworld],
          80 + 30 * 16,
          80 + 30 * 32
        )
        .setDepth(-1);
      const eighth_chunk_bottom = eighth_chunk
        .createStaticLayer(
          "base",
          [objects, overworld],
          80 + 30 * 16,
          80 + 30 * 32
        )
        .setDepth(-2);

      //NINTH CHUNK
      //
      var ninth_chunk = chunk_array[playerInfo.mapBlueprint[8]];
      const ninth_chunk_top = ninth_chunk
        .createStaticLayer(
          "top",
          [objects, overworld],
          80 + 30 * 32,
          80 + 30 * 32
        )
        .setDepth(1);
        const ninth_chunk_hand = ninth_chunk.createFromObjects(
          "item",
          "hand",
          {key: "handSan"}
        );
        ninth_chunk_hand.forEach(item => {item.itemID = 1});
        const ninth_chunk_face = ninth_chunk.createFromObjects(
          "item",
          "face",
          {key: "faceMask"}
        );
        ninth_chunk_face.forEach(item => {item.itemID = 2});
        const ninth_chunk_haz = ninth_chunk.createFromObjects(
          "item",
          "haz",
          {key: "hazSuit"}
        );
        ninth_chunk_haz.forEach(item => {item.itemID = 3});
        var ninth_chunk_items = ninth_chunk_face.concat(ninth_chunk_hand).concat(ninth_chunk_haz);
        ninth_chunk_items.forEach(item => {
          item.x = item.x + (80 + 30 * 32)
          item.y = item.y + (80 + 30 * 32)});
      const ninth_chunk_middle = ninth_chunk
        .createStaticLayer(
          "middle",
          [objects, overworld],
          80 + 30 * 32,
          80 + 30 * 32
        )
        .setDepth(-1);
      const ninth_chunk_bottom = ninth_chunk
        .createStaticLayer(
          "base",
          [objects, overworld],
          80 + 30 * 32,
          80 + 30 * 32
        )
        .setDepth(-2);

      map_items = first_chunk_items.concat(second_chunk_items).concat(third_chunk_items)
      .concat(fourth_chunk_items).concat(fifth_chunk_items).concat(sixth_chunk_items)
      .concat(seventh_chunk_items).concat(eighth_chunk_items).concat(ninth_chunk_items);

      // map collisions
      // skirt collision
      top_left_skirt_baseLayer.setCollisionByProperty({ collides: true });
      top_right_skirt_baseLayer.setCollisionByProperty({ collides: true });
      top_skirt_baseLayer.setCollisionByProperty({ collides: true });
      right_skirt_baseLayer.setCollisionByProperty({ collides: true });
      left_skirt_baseLayer.setCollisionByProperty({ collides: true });
      bottom_right_skirt_baseLayer.setCollisionByProperty({ collides: true });
      bottom_left_skirt_baseLayer.setCollisionByProperty({ collides: true });
      bottom_skirt_baseLayer.setCollisionByProperty({ collides: true });

      //individual chunk collision per layer
      first_chunk_bottom.setCollisionByProperty({ collides: true });
      first_chunk_middle.setCollisionByProperty({ collides: true });
      first_chunk_top.setCollisionByProperty({ collides: true });
      second_chunk_bottom.setCollisionByProperty({ collides: true });
      second_chunk_middle.setCollisionByProperty({ collides: true });
      second_chunk_top.setCollisionByProperty({ collides: true });
      third_chunk_bottom.setCollisionByProperty({ collides: true });
      third_chunk_middle.setCollisionByProperty({ collides: true });
      third_chunk_top.setCollisionByProperty({ collides: true });
      fourth_chunk_bottom.setCollisionByProperty({ collides: true });
      fourth_chunk_middle.setCollisionByProperty({ collides: true });
      fourth_chunk_top.setCollisionByProperty({ collides: true });
      fifth_chunk_bottom.setCollisionByProperty({ collides: true });
      fifth_chunk_middle.setCollisionByProperty({ collides: true });
      fifth_chunk_top.setCollisionByProperty({ collides: true });
      sixth_chunk_bottom.setCollisionByProperty({ collides: true });
      sixth_chunk_middle.setCollisionByProperty({ collides: true });
      sixth_chunk_top.setCollisionByProperty({ collides: true });
      seventh_chunk_bottom.setCollisionByProperty({ collides: true });
      seventh_chunk_middle.setCollisionByProperty({ collides: true });
      seventh_chunk_top.setCollisionByProperty({ collides: true });
      eighth_chunk_bottom.setCollisionByProperty({ collides: true });
      eighth_chunk_middle.setCollisionByProperty({ collides: true });
      eighth_chunk_top.setCollisionByProperty({ collides: true });
      ninth_chunk_bottom.setCollisionByProperty({ collides: true });
      ninth_chunk_middle.setCollisionByProperty({ collides: true });
      ninth_chunk_top.setCollisionByProperty({ collides: true });

      //adds colliders bewteen the player and the different layers
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

      self.player.playerDir = "stand";

      // Player Animations

      self.anims.create({
        key: "walkDown",
        repeat: -1,
        frameRate: 10,
        frames: self.anims.generateFrameNames("character", {
          prefix: "character_",
          suffix: ".png",
          start: 1,
          end: 4,
          zeroPad: 2,
        }),
      });

      self.anims.create({
        key: "walkUp",
        repeat: -1,
        frameRate: 10,
        frames: self.anims.generateFrameNames("character", {
          prefix: "character_",
          suffix: ".png",
          start: 20,
          end: 23,
          zeroPad: 2,
        }),
      });

      self.anims.create({
        key: "walkLeft",
        repeat: -1,
        frameRate: 10,
        frames: self.anims.generateFrameNames("character", {
          prefix: "character_",
          suffix: ".png",
          start: 28,
          end: 31,
          zeroPad: 2,
        }),
      });

      self.anims.create({
        key: "walkRight",
        repeat: -1,
        frameRate: 10,
        frames: self.anims.generateFrameNames("character", {
          prefix: "character_",
          suffix: ".png",
          start: 9,
          end: 12,
          zeroPad: 2,
        }),
      });

      self.anims.create({
        key: "stand",
        repeat: -1,
        frameRate: 10,
        frames: self.anims.generateFrameNames("character", {
          prefix: "character_",
          suffix: ".png",
          start: 28,
          end: 31,
          zeroPad: 2,
        }),
      });
    }

    function addOtherPlayers(self, playerInfo) {
      const otherPlayer = self.physics.add
        .sprite(playerInfo.x, playerInfo.y, "character", 0)
        .setOrigin(0.5, 0.5);
      otherPlayer.playerId = playerInfo.playerId;
      otherPlayer.covid = playerInfo.playerCovidPos
      self.otherPlayers.add(otherPlayer);

      // const otherPlayerName = self.add.bitmapText(playerInfo.x, playerInfo.y - 18, 'retroText', playerInfo.playerName)
      const otherPlayerName = self.add.bitmapText(playerInfo.x, playerInfo.y - 18, 'retroText', String(playerInfo.playerName), 12)
      .setOrigin(0.5)
      otherPlayerName.playerId = playerInfo.playerId;
      self.otherPlayersNames.add(otherPlayerName);
    }

    // CONTROLS SETUP
    // keyboard inputs
    self.cursors = this.input.keyboard.createCursorKeys()
    self.runKey = this.input.keyboard.addKey('S')
    self.pickUpKey = this.input.keyboard.addKey('A')

    // EVENTS
    // Virtual controller state event change
    this.scene
      .get("GameVirtualController")
      .events.on("buttonUpdate", buttonUpdate, this);

    // Updates virutal button events
    function buttonUpdate(states) {
      this.virtualControllerStates = states;
    }
    
    // event to add a score to play every second, emits to GameUI to update UI 
    this.time.addEvent({ delay: 1000, callback: () => {
      // check if player risk is 100 or greater
      // change staus to covid true | stop score incrementing
      if (this.player) {
        if (this.player.covid) {
          let shakerChance = Math.floor(Math.random() * 8);
          if (shakerChance === 1) {
            sickSounds[Math.floor(Math.random()*2)].play(soundConfig);
            this.cameras.main.shake(200);
          }
        } else {
          // score increment
          this.player.score += 1
  
          // check if player has protection
          // 3 or more protection
          if (this.player.protection >= 3) {
            this.player.risk += 1
            this.player.score += 3
            this.player.protection -= 3
          }
          // between 1 and 2 protection
          else if (0 < this.player.protection && this.player.protection < 3) {
            this.player.risk += 4 - this.player.protection
            this.player.score += this.player.protection
            this.player.protection = 0
          }
          // player without protection
          else {
            this.player.risk += 4
          }
        }
  
        // emit for player UI update every second
        this.events.emit('playerUIUpdate', {
          score: this.player.score, 
          risk: this.player.risk, 
          protection: this.player.protection
        }, this);
      }
      
    }, callbackScope: this, loop: true });

    // event to check distance from otherPlayers
    this.time.addEvent({ delay: 200, callback: () => {
      if (this.player) {
        let player = this.player
        if (!this.player.covid) {
          this.otherPlayers.getChildren().forEach(function (otherPlayer) {
            let deltaX = Math.abs(otherPlayer.x - player.x)
            let deltaY = Math.abs(otherPlayer.y - player.y)
            let radius = (otherPlayer.covid) ? 100 : 75
            let riskFactor = (otherPlayer.covid) ? 3 : 2
            if (deltaX < radius && deltaY < radius) {
              console.log(`YOU ARE AT RISK | Player is Covid: ${otherPlayer.covid} | Distance < ${radius}`)
              // if player has over the riskFactor to remove from protection
              if (player.protection >= riskFactor) {
                player.protection -= riskFactor
              }
              // if the player has less than the riskFactor, remove from protection and then add risk remaining
              else if (player.protection < riskFactor) {
                player.risk += (riskFactor - player.protection)
                player.protection = 0
              }
              // otherwise just add risk
              else {
                player.risk += riskFactor
              }
            }
          });
        }
        this.events.emit('playerUIUpdate', {
          score: player.score, 
          risk: player.risk, 
          protection: player.protection,
          items: player.items
        }, this);
      }
      
    }, callbackScope: this, loop: true });

    // LISTEN FOR END OF ROUND
     // Server ends game
     this.socket.on("serverGameEnd", () => {
      console.log("Server has instructed to end of round");

      // update server with player final data
      this.socket.emit("playerStatsUpdate", {
        score: this.player.score,
        covid: this.player.covid,
      });

      // fade out for end of round
      this.scene.get('GameUI').cameras.main.fadeOut(2000, 0, 0, 0);;
      this.cameras.main.fadeOut(2000, 0, 0, 0);
      // move to post game

      setTimeout( () => {
        this.scene.start('PostRoundScene', {player: this.player, socket: this.socket})
      }, 3000);
      });

    this.coughSound = this.sound.add("cough");
    this.sneezeSound = this.sound.add("sneeze");
    this.pickUpSound1 = this.sound.add("pickUp1");
    this.pickUpSound2 = this.sound.add("pickUp2");
    this.backgroundMusic = this.sound.add("backgroundMusic");
    pickUpSounds = [this.pickUpSound1, this.pickUpSound2];
    var sickSounds = [this.coughSound, this.sneezeSound];
    var backgroundMusicConfig = {
      mute: false,
      volume: 0.03,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    this.backgroundMusic.play(backgroundMusicConfig);
  }

  update() {

    // CAMERA STICK
    if (
      (this.input.activePointer.isDown && this.cameraStickUnlocked) ||
      (this.input.activePointer.isDown &&
        250 < this.input.activePointer.x &&
        this.input.activePointer.x < 384 &&
        96 < this.input.activePointer.y &&
        this.input.activePointer.y < 224)
    ) {
      if (this.cameraResetCounter === 0) {
        this.cameras.main.stopFollow();
        this.cameras.main.zoomTo(1, 500);
      }
      if (this.origDragPoint) {
        this.cameras.main.scrollX +=
          (this.input.activePointer.position.x - this.cameras.main.centerX) /
          15;
        this.cameras.main.scrollY +=
          (this.input.activePointer.position.y - this.cameras.main.centerY) /
          15;
        this.cameraResetCounter = 0;
        this.cameraStickUnlocked = true;
      }
      this.origDragPoint = this.input.activePointer.position.clone();
    } else {
      this.cameraStickUnlocked = false;
      this.cameraResetCounter++;
      this.origDragPoint = null;
      if (this.cameraResetCounter > 1000) this.cameraResetCounter = 100;
      if (this.cameraResetCounter === 20) {
        this.cameras.main.pan(this.player.x, this.player.y, 700, "Linear");
      }
      if (this.cameraResetCounter === 65) {
        this.cameras.main.startFollow(this.player, false)
        .zoomTo(1.8, 500)
        .setLerp(0.2, 0.2);
      }
    }

    // PLAYER MOVEMENT
    if (this.player) {
      // pickup item, check
      if(this.pickUpKey.isDown || this.virtualControllerStates.pickUp) {
        // KEEGAN - PICK UP ITEM FUNCTIONS HERE
        console.log("Im trying to pick up an item.")
      }
      // run check, wont overwrite speed cheat, wont work if you've covid true
      else if ((!this.player.covid && this.player.speed === 60) && (this.runKey.isDown || this.virtualControllerStates.run)) {
        this.player.speed = 110
      } else if (this.player.speed = 110) {
        this.player.speed = 60
      }
      // left button down walk left
      if (this.cursors.left.isDown || this.virtualControllerStates.left) {
        this.player.setVelocityX(-this.player.speed);
        this.player.setVelocityY(0);
        this.player.anims.play("walkLeft", true);
        this.player.playerDir = "walkLeft";
      }
      // right button down walk right
      else if (
        this.cursors.right.isDown ||
        this.virtualControllerStates.right
      ) {
        this.player.setVelocityX(this.player.speed);
        this.player.setVelocityY(0);
        this.player.anims.play("walkRight", true);
        this.player.playerDir = "walkRight";
      }
      // down button down walk down
      else if (this.cursors.down.isDown || this.virtualControllerStates.down) {
        this.player.setVelocityY(this.player.speed);
        this.player.setVelocityX(0);
        this.player.anims.play("walkDown", true);
        this.player.playerDir = "walkDown";
      }
      // up button down walk up
      else if (this.cursors.up.isDown || this.virtualControllerStates.up) {
        this.player.setVelocityY(-this.player.speed);
        this.player.setVelocityX(0);
        this.player.anims.play("walkUp", true);
        this.player.playerDir = "walkUp";
      }
      // no button down stop animation and stop player velocity
      else {
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.anims.stop();
        this.player.playerDir = "stand";
      }

      // emit player movement
      let x = this.player.x;
      let y = this.player.y;
      if (
        this.player.oldLocation &&
        (x !== this.player.oldLocation.x || y !== this.player.oldLocation.y)
      ) {
        this.socket.emit("playerMovement", {
          x: this.player.x,
          y: this.player.y,
          playerDir: this.player.playerDir,
          covid: this.player.covid
        });
      }

      // save old position data
      this.player.oldLocation = {
        x: this.player.x,
        y: this.player.y,
      };

      // easter egg / speed cheat
      if ((80 < this.player.x && this.player.x < 84) && (75 < this.player.y && this.player.y < 79)) {
        this.playerSpeedCheatCounter += 1
        if (this.playerSpeedCheatCounter > 100) {
          console.log("Speed Cheat active")
          this.player.speed = 150
        }
      } else {
        this.playerSpeedCheatCounter = 0
      }

      // player covid checker
      if (this.player.risk >= 100) {
        this.player.risk = 100
        this.player.covid = true
        if (!this.player.scoreReduced) {
          let scoreReducer = 2
          this.player.score = Math.floor(this.player.score / scoreReducer)
          this.player.scoreReduced = true
        }
      }
    }

    // Item pickup collision checker

    let player = this.player
    let events = this.events

    map_items.forEach(item => {
      if (checkCollision(player, item, events)) {
        if (!player.covid) {
          pickUp(item.itemID, player, events);
          pickUpSounds[Math.floor(Math.random() * 2)].play(soundConfig);
        }

        item.destroy();
        map_items.splice(map_items.indexOf(item),1);
      }
    });

    function checkCollision(player, item) {
      var itemBounds = item.getBounds();
      var rect = player.getBounds(rect);

      return Phaser.Geom.Intersects.RectangleToRectangle(itemBounds, rect);
    }

    function pickUp(id, player, events) {
      let maxProtection = 100

      if (id === 1) {
        let sanitizerRiskValue = 25
        console.log("You picked up hand sanitizer");
        console.log(`Risk: ${player.risk} => ${player.risk - sanitizerRiskValue}`)
        // base score add
        player.score += 5
        // add item count
        console.log("Hand sanitizer count pre: ", player.items.hand)
        player.items.hand += 1
        console.log("Hand sanitizer count post: ", player.items.hand)
        // make sure risk will only be reduced down to a minimum of 0
        if (player.risk < sanitizerRiskValue) {
          player.score += player.risk
          player.risk -= player.risk
        } else {
          player.score += sanitizerRiskValue
          player.risk -= sanitizerRiskValue
        }
         // emit for player UI update every second
      } else if (id === 2) {
        let facemaskRiskValue = 10
        let facemaskProtValue = 25
        console.log("You picked up a face mask");
        console.log(`Risk: ${player.risk} => ${player.risk - facemaskRiskValue}`)
        console.log(`Prot: ${player.protection} => ${player.protection + facemaskProtValue}`)
        // base score add
        player.score += 10
        // add item count
        console.log("face count pre: ", player.items.mask)
        player.items.mask += 1
        console.log("face count post: ", player.items.mask)
        // make sure risk will only be reduced down to a minimum of 0
        if (player.risk < facemaskRiskValue) {
          player.score += player.risk
          player.risk -= player.risk
        } else {
          player.score += facemaskRiskValue
          player.risk -= facemaskRiskValue
        }
        // make sure protection will only reach a maximum of 100
        if ((maxProtection - player.protection) < facemaskProtValue) {
          player.protection += (maxProtection - player.protection)
        } else {
          player.protection += facemaskProtValue
        }

      } else if (id === 3) {
        let hazsuitRiskValue = 15
        let hazsuitProtValue = 40
        console.log("You picked up a hazmat suit");
        console.log(`Risk: ${player.risk} => ${player.risk - 12}`)
        console.log(`Prot: ${player.protection} => ${player.protection + 16}`)
        // base score add
        player.score += 15
        // add item count
        console.log("hazmat count pre: ", player.items.haz)
        player.items.haz += 1
        console.log("hazmat count post: ", player.items.haz)
        // make sure risk will only be reduced down to a minimum of 0
        if (player.risk < hazsuitRiskValue) {
          player.score += player.risk
          player.risk -= player.risk
        } else {
          player.score += hazsuitRiskValue
          player.risk -= hazsuitRiskValue
        }
        // make sure protection will only reach a maximum of 100
        if ((maxProtection - player.protection) < hazsuitProtValue) {
          player.protection += (maxProtection - player.protection)
        } else {
          player.protection += hazsuitProtValue
        }

      }
       // emit for player UI update every second
       events.emit('playerUIUpdate', {
        score: player.score, 
        risk: player.risk, 
        protection: player.protection,
        items: player.items
      });
    }
  }
}
