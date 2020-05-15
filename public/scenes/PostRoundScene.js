export class PostRoundScene extends Phaser.Scene {
    constructor(){
        super({
            key: "PostRoundScene",
            active: false
        })

    }

    init(data){
        this.player = data.player
        // this.socket = data.socket
    }
    
    preload(){

    }
    
    create(){
        console.log('Player log: ', this.player)
        console.log('Socket log: ', this.socket)

        // UI SETUP
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // EVENTS

        // LISTENERS
        // listen for server passing post round data
        // this.socket.on("serverPostRound", () => {
        //     console.log("serverPostRound")
          
        //   }, this);

        // SPEAKERS

        // Round End Title
        let roundEndText = this.add.text(272, 16, 'ROUND END', {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'white',
            fill: 'black',
            align: 'centre'
        }).setScrollFactor(0);

        // PLAYER STATS FROM ROUND
        // Player stats title
        let playerStatsTitle = this.add.text(96, 32, "STATS", {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'white',
            fill: 'black',
            align: 'left'
        }).setScrollFactor(0);
        
        // Player Score
        let playerScoreText = this.add.text(32, 80, "Score: ", {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'white',
            fill: 'black',
            align: 'left'
        }).setScrollFactor(0);

        // Player covid status
        let playerCovidText = this.add.text(32, 128, "COVID-19: ", {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'white',
            fill: 'black',
            align: 'left'
        }).setScrollFactor(0);

        // Highscores
        // Highscore title
        let highscoresText = this.add.text(448, 32, "LEADERBOARD", {
            fontSize: '12px',
            padding: { x: 4, y: 4 },
            backgroundColor: 'white',
            fill: 'black',
            align: 'left'
        }).setScrollFactor(0);

        
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
                this.add.text(highscorePlayerX, highscorePlayerY, 
                    data[player].username + ': ' + data[player].highScore, {
                    fontSize: '12px',
                    padding: { x: 4, y: 4 },
                    backgroundColor: 'white',
                    fill: 'black',
                    align: 'left'
                }).setScrollFactor(0);
                highscorePlayerY += 48
              }, this);
        })
        

        // SETTERS for UI
        playerScoreText.setText("Your Score: " + this.player.score)
        playerCovidText.setText("COVID-19 : " + this.player.covid)

        // wait for game reset
        setTimeout(function(){ 
            location.reload(); }, 5000);
        
        console.log("PostRoundScene complete")
    }

    update(){

    }
}