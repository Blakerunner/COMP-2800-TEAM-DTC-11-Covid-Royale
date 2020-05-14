export class GameUI extends Phaser.Scene {
    constructor(){
        super({
            key: "GameUI",
            active: false
        })
        this.playerScore = 1
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
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'red',
            fill: 'black',
            align: 'center'
        });
        // makes playerRisk so it will stay in same place on screen
        playerRisk.setScrollFactor(0);

        

      // Score UI
        let playerScoreUI = this.add.text(120, 8, this.playerScore, {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'yellow',
            fill: 'black',
            align: 'center'
        });
        // makes playerRisk so it will stay in same place on screen
        playerScoreUI.setScrollFactor(0);




        // EVENTS
        // Virtual controller state event change
        this.scene
        .get("GameScene")
        .events.on("playerScoreUpdate", playerScoreUpdate, this);

        // Updates virutal button events
        function playerScoreUpdate(score) {
            // add score to playerScore
            this.playerScore += score;
            // update playerScoreUI
            playerScoreUI.setText(this.playerScore)
        }


        
        console.log("GameUI complete")

    }

    update(){

    }
}