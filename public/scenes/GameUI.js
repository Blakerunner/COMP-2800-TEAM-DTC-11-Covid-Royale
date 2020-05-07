export class GameUI extends Phaser.Scene {
    constructor(){
        super({
            key: "GameUI",
            active: false
        })
    }

    init(){
        console.log("GameUI start")
    }
    
    preload(){

    }
    
    create(){
        console.log("GameUI complete")
    }

    update(){
        
    }
}