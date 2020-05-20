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
        let playerScoreUIBackbar = this.add.rectangle(142, 8, 128, 28, cBlack , 0.5)
        .setOrigin(0)
        .setScrollFactor(0)

        let playerScoreUIFillbar = this.add.rectangle(144, 10, 124, 24 , cPurple , 0.8)
        .setOrigin(0)
        .setScrollFactor(0)

        let playerScoreUIText = this.add.bitmapText(144, 10, 'retroText', 'Score', 20)

        let playerScoreUITextCount = this.add.bitmapText(216, 10, 'retroText', '0', 20)

        // Item UI

        let itemsUIBackbar = this.add.rectangle(487, 8, 145, 24, cBlack , 0.5)
        .setOrigin(0)
        .setScrollFactor(0)

        // Sanitizer UI
        // Sanitizer Icon
        let itemSanitizerUIIcon = this.add.image(489, 12, 'handSan')
        .setOrigin(0)
        .setAlpha(0.8)
        .setScale(1)

        // Sanitizer Counter
        let itemSanitizerUIText = this.add.bitmapText(505, 10, 'retroText', '0', 20)

        // Mask UI
        // Mask Icon
        let itemMaskUIIcon = this.add.image(536, 12, 'faceMask')
        .setOrigin(0)
        .setAlpha(0.8)
        .setScale(1)
        // Mask Counter
        let itemMaskUIText = this.add.bitmapText(552, 10, 'retroText', '0', 20)
        

        // Hazmat UI
        // Hazmat Icon
        let itemHazUIIcon = this.add.image(583, 12, 'hazSuit')
        .setOrigin(0)
        .setAlpha(0.8)
        .setScale(1)

        // Hazmat Counter
        let itemHazUIText = this.add.bitmapText(599, 10, 'retroText', '0', 20)


        // EVENTS
        // Player per second update
        this.scene
        .get("GameScene")
        .events.on("playerUIUpdate", playerUIUpdate, this);

        // Updates virutal button events
        function playerUIUpdate(data) {
            let riskUIMaxWidthMutiplier = 1.24
            let protectionUIMaxWidthMutiplier = 1.24
            // constant UI updating make sure to not draw larger than standard 2nd guard
            if (data.risk) {
                if (0 <= data.risk && data.risk <= 100) {
                    playerRiskUIFillbar.width = data.risk * riskUIMaxWidthMutiplier
                }
            }
            
            if (data.protection) {
                if (0 <= data.protection && data.protection <= 100) {
                    playerProtectionUIFillbar.width = data.protection * protectionUIMaxWidthMutiplier
                }
            }

            if (data.score) {
                playerScoreUITextCount.setText(String(data.score+1000))
            }

            // items update
            if (data.items) {
                itemSanitizerUIText.setText(String(data.items.hand))
                itemMaskUIText.setText(String(data.items.mask))
                itemHazUIText.setText(String(data.items.haz))
            }
            
        }

        console.log("GameUI complete")

    }

    update(){
    }
}