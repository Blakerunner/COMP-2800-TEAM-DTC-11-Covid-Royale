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
        this.socket.emit("roundOutcomeRequest")
    }
    
    preload(){

    }
    
    create(){
        let endRoundData = {}

        // UI SETUP
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        
        // Round End Title
        let roundEndText = this.add.bitmapText(272, 16, 'retroText', 'ROUND END', 22)

        // PLAYER STATS FROM ROUND

        // Player stats title
        let playerStatsTitle = this.add.bitmapText(96, 32, 'retroText', 'STATS', 22)
        
        // Player Score
        let playerScoreText = this.add.bitmapText(32, 48, 'retroText', 'Score   ', 22)
        // Player Covid status
        let playerCovidText = this.add.bitmapText(32, 64, 'retroText', "COVID-19   ", 22)
        

        // ROUND OUTCOME
        // Round outcome title
        let roundOutcomeTitle = this.add.bitmapText(96, 160, 'retroText', 'ROUND OUTCOME', 22)
        // victory or defeat
        let roundOutcomeText = this.add.bitmapText(32, 176, 'retroText', ``, 22)
        // best round score
        let bestRoundPlayerText =  this.add.bitmapText(32, 192, 'retroText', ``, 22)
        // average score
        let scoreAverageText = this.add.bitmapText(32, 208, 'retroText', ``, 22)
        
        
        this.socket.on("roundOutcomeReply", function(data) {
            console.log("reply |", data)
            if (data.victorious) {
                roundOutcomeText.setText(`Victory!   ${data.infected} of ${data.playerCount} infected`)
            } else {
                roundOutcomeText.setText(`Defeat!   ${data.infected} of ${data.playerCount} infected`)
            }
            bestRoundPlayerText.setText(`Best Player   ${data.bestPlayer.name}   ${data.bestPlayer.score}`)
            scoreAverageText.setText(`Score Average   ${data.scoreAvg}`)
        })

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
            let highscorePlayerY = 48
            console.log(data)

            Object.keys(data).forEach(function (player) {
                // generate player name and score
                this.add.bitmapText(highscorePlayerX, highscorePlayerY, 'retroText', `${data[player].username}   ${data[player].highScore}`, 22)
                highscorePlayerY += 16
              }, this);
        })
        
        // SETTERS for UI
        playerScoreText.setText(`Your Score   ${this.player.score}`)
        playerCovidText.setText(`COVID-19   ${this.player.covid}`)

        // wait for game reset
        setTimeout(function(){ 
            window.location.reload(true);
        }, 10000);
        
        console.log("PostRoundScene complete")
    }

    update(){

    }
}

