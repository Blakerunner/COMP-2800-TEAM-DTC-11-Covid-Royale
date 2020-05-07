import {LobbyScene} from "./LobbyScene.js"
export class MenuScene extends Phaser.Scene {
    constructor(){
        super({
            key: "MenuScene",
            active: false
        })
    }

    init(){
        console.log("MenuScene start")
    }
    
    preload(){

    }
    
    create(){
        console.log("MenuScene complete")
        this.scene.start("LobbyScene")
    }

    update(){
        
    }
}