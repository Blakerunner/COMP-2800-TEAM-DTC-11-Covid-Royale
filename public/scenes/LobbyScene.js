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
    }
    
    preload(){

    }
    
    create(){
        console.log("LobbyScene complete")
        this.scene.start("GameScene")
    }

    update(){
        
    }
}