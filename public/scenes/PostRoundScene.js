export class PostRoundScene extends Phaser.Scene {
    constructor(){
        super({
            key: "PostRoundScene",
            active: false
        })

    }

    init(data){
        console.log("PostRoundScene start")
        console.log("playerData from GameScene: ", data)
        this.playerData = data
    }
    
    preload(){

    }
    
    create(){
        // UI SETUP
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // EVENTS

        // LISTENERS

        // SPEAKERS

        // round end text
        let roundEndText = this.add.text(320, 8, 'Round End', {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'white',
            fill: 'black',
            align: 'center'
        }).setScrollFactor(0);

        // round end text
        let playerScoreText = this.add.text(320, 40, "Your Score: ", {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'white',
            fill: 'black',
            align: 'center'
        }).setScrollFactor(0);

        // round end text
        let playerCovidText = this.add.text(320, 72, "COVID-19: ", {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'white',
            fill: 'black',
            align: 'center'
        }).setScrollFactor(0);

        // SETTERS for UI
        playerScoreText.setText("Your Score: " + this.playerData.score)
        playerCovidText.setText("COVID-19 : " + this.playerData.covid)

        // wait for game reset
        // setTimeout(function(){ location.reload(); }, 5000);
        
        console.log("PostRoundScene complete")
    }

    update(){

    }
}