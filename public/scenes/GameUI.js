export class GameUI extends Phaser.Scene {
    constructor(){
        super({
            key: "GameUI",
            active: false
        })
        this.playerScore = 0
        this.playerRisk = 0
        this.playerProtection = 0
    }

    init(){
        console.log("GameUI start")
    }
    
    preload(){

    }
    
    create(){
        // Camera Setup
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        let cBlack = '0x000000'
        let cRed = '0xff0000'
        let cWhite = '0xffffff'
        let cBlue = '0x0000ff'
        let cYellow = '0xffff00'

        // Risk UI
        let playerRiskUIFillbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(8, 8, 128, 28)
        .fillStyle(cRed, 1);

        let playerRiskUIBackbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(10, 10, 124, 24)
        .fillStyle(cBlack, 1);
        
        let playerRiskText = this.add.text(10, 10, 'Risk', {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            fill: 'black',
            align: 'center'
        }).setScrollFactor(0);

        // // Protection UI
        let playerProtectionUIFillbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(8, 40, 128, 28)
        .fillStyle(cBlue, 1);

        let playerProtectionUIBackbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(10, 42, 124, 24)
        .fillStyle(cBlack, 1);

        let playerProtectionUIText = this.add.text(10, 42, 'Protection', {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            fill: 'white',
            align: 'center'
        }).setScrollFactor(0);

        // Score UI
        let playerScoreUIFillbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(142, 8, 36, 28)
        .fillStyle(cYellow, 1);

        let playerScoreUIBackbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(144, 10, 32, 24)
        .fillStyle(cBlack, 1);

        let playerScoreUIText = this.add.text(144, 10, this.playerScore, {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            fill: 'black',
            align: 'center'
        }).setScrollFactor(0);

        // EVENTS
        // Player Score Update
        this.scene
        .get("GameScene")
        .events.on("playerScoreUpdate", playerScoreUpdate, this);

        // Updates virutal button events
        function playerScoreUpdate(score) {
            // add score to playerScore
            this.playerScore += score;
            // update playerScoreUI
            playerScoreUIText.setText(this.playerScore)
        }

        // Player Risk Update
        this.scene
        .get("GameScene")
        .events.on("playerRiskUpdate", playerRiskUpdate, this);

        // Updates virutal button events
        function playerRiskUpdate(risk) {
            // add score to playerScore
            this.playerRisk += risk;
            // update playerScoreUI
            playerRiskUIText.setText(this.playerRisk)
        }

        // Player Protection Update
        this.scene
        .get("GameScene")
        .events.on("playerProtectionUpdate", playerProtectionUpdate, this);

        // Updates virutal button events
        function playerProtectionUpdate(protection) {
            // add protection to playerProtection
            this.playerProtection += protection;
            // update playerProtectionUIText
            playerProtectionUIText.setText(this.playerProtection)
        }

        console.log("GameUI complete")

    }

    update(){

        // Update playerRiskUIBa
        

    }
}