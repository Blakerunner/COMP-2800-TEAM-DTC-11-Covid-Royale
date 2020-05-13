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
        // UI SETUP
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // playerRisk UI
        let playerRisk = this.add.text(8, 8, 'Infection risk', {
            fontSize: '16px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'red',
            fill: 'black',
            align: 'center'
        });
        // makes playerRisk so it will stay in same place on screen
        playerRisk.setScrollFactor(0);

        console.log("GameUI complete")
    }

    update(){
        
    }
}