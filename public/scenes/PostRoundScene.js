export class PostRoundScene extends Phaser.Scene {
    constructor(){
        super({
            key: "PostRoundScene",
            active: false
        })

    }

    init(data){
        this.player = data.player
        this.socket = data.socket
    }
    
    preload(){

    }
    
    create(){
        console.log('Player log: ', this.player)

        // UI SETUP
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        
        // Round End Title
        let roundEndText = this.add.bitmapText(272, 16, 'retroText', 'ROUND END', 22)

        // PLAYER STATS FROM ROUND

        // Player stats title
        let playerStatsTitle = this.add.bitmapText(96, 32, 'retroText', 'STATS', 22)
        
        // Player Score
        let playerScoreText = this.add.bitmapText(32, 80, 'retroText', 'Score   ', 22)
        // Player Covid status
        let playerCovidText = this.add.bitmapText(32, 128, 'retroText', "COVID-19   ", 22)

        // Leaderboard Title
        let highscoresText = this.add.bitmapText(448, 32, 'retroText', "LEADERBOARD", 22)

        let URL = `https://covid-royale.westus.cloudapp.azure.com/highscore`
        // Generate leaderboard list
        async function getHighScores() {
            let response = await fetch(URL, {mode:"no-cors"})
            console.log(response);
            let data = await response.json();
            return data
        }

        getHighScores().then(data => {
            let highscorePlayerX = 368
            let highscorePlayerY = 80
            console.log(data)

            Object.keys(data).forEach(function (player) {
                // generate player name and score
                this.add.bitmapText(highscorePlayerX, highscorePlayerY, 'retroText', `${data[player].username} + "   " + ${data[player].highScore}`, 22)
                highscorePlayerY += 48
              }, this);
        })
        
        // SETTERS for UI
        playerScoreText.setText(`Your Score   ${this.player.score}`)
        playerCovidText.setText(`COVID-19   ${this.player.covid}`)

        // wait for game reset
        setTimeout(function(){ 
            window.location.reload(true);
        }, 5000);
        
        console.log("PostRoundScene complete")
    }

    update(){

    }
}

