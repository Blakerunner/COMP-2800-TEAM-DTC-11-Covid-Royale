import { MenuScene } from "./MenuScene.js"
export class LoadScene extends Phaser.Scene {
    constructor(){
        super({
            key: "LoadScene",
            active: false
        })
    }

    init(){
        console.log("LoadScene start")
    }
    
    preload(){
        this.load.bitmapFont('retroText', './assets/bitmapFont/retroText.png', './assets/bitmapFont/retroText.xml');
        this.load.image("game_instruct_bg", "./assets/img/game_instruct_scene_bg.png")
        this.load.image("overworld", "./assets/img/overworld.png");
        this.load.image("objects", "./assets/img/objects.png");
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
    
    create(){
        console.log("LoadScene complete")
		var progressBox = this.add.graphics();
        var progressBar = this.add.graphics();

        

    let value = 0.0;
	let centerx = 20;
	let centery = 150;
	let width = 600;
	let height = 50;

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(centerx, centery, width, height);
    progressBar.fillStyle(0xffffff, 1);
    progressBar.fillRect(centerx + 5, centery + 5, width * value, height);

    var loadingText = this.add.text(centerx + width / 2, centery + height / 2, "Loading...", {
        padding: { x: 0, y: 0 },
        fill: '0xffffff',
        font: 'bold 28px Arial',
      }).setOrigin(0.5, 0.5);

    function fillbar(nameOfBar, increment, scene) {
      let timer = setInterval(function() {
        value += increment;
        if (value > 1 || value < 0) {
            clearInterval(timer);
			scene.start("MenuScene")
			console.log("Hit this");
        }
        nameOfBar.fillRect(centerx, centery, width * value, height);
    },10);
}
fillbar(progressBar, 0.01, this.scene);

    }

    update(){

    }
}

