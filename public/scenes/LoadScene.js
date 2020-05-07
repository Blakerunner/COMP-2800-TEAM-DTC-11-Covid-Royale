import { MenuScene } from "./MenuScene.js"
export class LoadScene extends Phaser.Scene {
    constructor(){
        super({
            key: "LoadScene",
            active: true
        })
    }

    init(){
        console.log("LoadScene start")
    }
    
    preload(){
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
        this.scene.start("MenuScene")
    }

    update(){

    }
}

