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
        let playerRiskUIBackbar = this.add.rectangle(8, 8, 128 , 28 , cBlack , 0.5)
        .setOrigin(0)
        .setScrollFactor(0)

        let playerRiskUIFillbar = this.add.rectangle(10, 10, 0 , 24 , cRed , 0.8)
        .setOrigin(0)
        .setScrollFactor(0)

        let playerRiskUIText = this.add.bitmapText(10, 10, 'retroText', 'Risk', 22)

        // // Protection UI
        let playerProtectionUIBackbar = this.add.rectangle(8, 40, 128, 28 , cBlack , 0.5)
        .setOrigin(0)
        .setScrollFactor(0)

        let playerProtectionUIFillbar = this.add.rectangle(10, 42, 0, 24 , cBlue , 0.8)
        .setOrigin(0)
        .setScrollFactor(0)

        let playerProtectionUIText = this.add.bitmapText(10, 42, 'retroText', 'Protection', 22)

        // Score UI
        let playerScoreUIBackbar = this.add.rectangle(142, 8, 44, 28, cBlack , 0.5)
        .setOrigin(0)
        .setScrollFactor(0)

        let playerScoreUIFillbar = this.add.rectangle(144, 10, 40, 24 , cPurple , 0.8)
        .setOrigin(0)
        .setScrollFactor(0)

        let playerScoreUIText = this.add.bitmapText(144, 10, 'retroText', '0', 22)

        // EVENTS
        // Player per second update
        this.scene
        .get("GameScene")
        .events.on("playerUIUpdate", playerUIUpdate, this);

        // Updates virutal button events
        function playerUIUpdate(data) {
            this.score = data.score
            this.risk = data.risk
            this.protection = data.protection
            let riskUIMaxWidthMutiplier = 1.24
            let protectionUIMaxWidthMutiplier = 1.24
            // constant UI updating make sure to not draw larger than standard 2nd guard
            if (0 <= this.risk && this.risk <= 100) {
                // playerRiskUIFillbar.fillRect(10, 10, this.risk * 1.24, 24)
                playerRiskUIFillbar.width = data.risk * riskUIMaxWidthMutiplier
            }
            if (0 <= this.protection && this.protection <= 100) {
                playerProtectionUIFillbar.width = data.protection * protectionUIMaxWidthMutiplier
            }
            playerScoreUIText.setText(String(this.score))
        }

        console.log("GameUI complete")

    }

    update(){
    }
}