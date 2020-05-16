import {GameScene} from "./GameScene.js"
export class LobbyScene extends Phaser.Scene {
    constructor(){
        super({
            key: "LobbyScene",
            active: false
        })
    }

    init(){
        console.log("LobbyScene start")

        // check if GameScene exists, destroy if exists
      
        // console.log("Removed GameScene")
        // let gameSceneExists = this.scene.getScene('GameScene');
        // gameSceneExists.scene.remove('GameScene');
    }
    
    preload(){

    }
    
    create(){
        
        // REMOVED LOBBY INSTRUCTIONS FOR NOW
        // // add game instruction image
        // this.add.image(0, 0, 'game_instruct_bg').setOrigin(0, 0);

        // // tap to continue to next page
        // this.input.on('pointerup', function (pointer) {
        //     this.scene.start('GameScene');
        // }, this);

        this.scene.start('GameScene');
        console.log("LobbyScene complete")
    }

    update(){
        
    }
}