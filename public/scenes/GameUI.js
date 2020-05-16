export class GameUI extends Phaser.Scene {
    constructor(){
        super({
            key: "GameUI",
            active: false
        })
        this.score = 0
        this.risk = 0
        this.protection = 0
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
        let cPurple = '0x2F329F'

        // Risk UI
        let playerRiskUIFillbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(8, 8, 128, 28)
        .fillStyle(cRed, 1);

        let playerRiskUIBackbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(10, 10, 0, 24)
        .fillStyle(cBlack, 1);
        
        // let playerRiskText = this.add.text(10, 10, 'Risk', {
        //     fontSize: '12px',
        //     padding: { x: 4, y: 4 },
        //     fill: 'white',
        //     align: 'center'
        // }).setScrollFactor(0);

        let playerRiskUIText = this.add.bitmapText(10, 10, 'retroText', 'Risk', 22)

        // // Protection UI
        let playerProtectionUIFillbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(8, 40, 128, 28)
        .fillStyle(cBlue, 1);

        let playerProtectionUIBackbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(10, 42, 0, 24)
        .fillStyle(cBlack, 1);

        // let playerProtectionUIText = this.add.text(10, 42, 'Protection', {
        //     fontSize: '12px',
        //     padding: { x: 4, y: 4 },
        //     fill: 'white',
        //     align: 'center'
        // }).setScrollFactor(0);

        let playerProtectionUIText = this.add.bitmapText(10, 42, 'retroText', 'Protection', 22)

        // Score UI
        let playerScoreUIFillbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(142, 8, 44, 28)
        .fillStyle(cPurple, 1);

        let playerScoreUIBackbar = this.add.graphics()
        .setScrollFactor(0)
        .fillRect(144, 10, 40, 24)
        .fillStyle(cBlack, 1);

        // let playerScoreUIText = this.add.text(144, 10, '0', {
        //     fontSize: '12px',
        //     padding: { x: 4, y: 4 },
        //     fill: 'black',
        //     align: 'center'
        // }).setScrollFactor(0);

        let playerScoreUIText = this.add.bitmapText(144, 10, 'retroText', '7', 22)

        // EVENTS
        // Player per second update
        this.scene
        .get("GameScene")
        .events.on("playerUIUpdateTicker", playerUIUpdateTicker, this);

        // Updates virutal button events
        function playerUIUpdateTicker(data) {
            this.score = data.score
            this.risk = data.risk
            this.protection = data.protection
            // constant UI updating
            
            playerScoreUIText.setText(String(data.score))
            playerRiskUIFillbar.fillRect(10, 10, data.risk * 1.24, 24)
            playerProtectionUIBackbar.fillRect(10, 42, data.protection * 1.24, 24)
        }


        // Player Score Update
        this.scene
        .get("GameScene")
        .events.on("playerScoreUpdate", playerScoreUpdate, this);

        // Updates player score
        function playerScoreUpdate(score) {
            // add score to playerScore
            this.playerScore += score;
        }

        // Player Risk Update
        this.scene
        .get("GameScene")
        .events.on("playerRiskUpdate", playerRiskUpdate, this);

        // Updates player risk
        function playerRiskUpdate(risk) {
            // add score to playerScore
            this.playerRisk += risk;
        }

        // Player Protection Update
        this.scene
        .get("GameScene")
        .events.on("playerProtectionUpdate", playerProtectionUpdate, this);

        // Updates player protection
        function playerProtectionUpdate(protection) {
            // add protection to playerProtection
            this.playerProtection += protection;
        }

        console.log("GameUI complete")

    }

    update(){
    }
}