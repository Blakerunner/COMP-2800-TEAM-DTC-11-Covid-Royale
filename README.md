![Poster](https://i.imgur.com/xcIztM7.jpg "Poster")

# COVID ROYALE

Online Multiplayer Game to spread awareness about COVID-19
To play our game, please [click here to visit our homepage.](https://covid-royale.westus.cloudapp.azure.com/)

## Requirements

#### MongoDB Atlas Account

account requirements

#### OAuth Account

account requirements

## Setup Instructions

#### Integrated Development Environment

The only requirements that you will need for this is capable IDE.
We recommend [Microsoft Visual Studio Code](https://code.visualstudio.com/), as setup instructions will be provided for VS Code.

#### Node.js Installation

We use Node.js as are core framework.

If you do not have Node, please download it [here](https://nodejs.org/en/download/).

Head to the downloads section and install the LTS version on Node on your computer.
Below is an example of the download selection.

![](https://i.imgur.com/dZbTENj.png)

#### Repository Cloning

Use your preferred git tool or follow [these](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) instructions to clone a copy of this repository to your machine.

#### Package Installation

Once you have cloned our repo, the first step to set up a development environment is to first install package dependencies. The easiest way to do this is to use npm.

1. Open Visual Studio Code (VSC)
 - Once you have VSC opened, press <i>Ctrl + O</i> to open a file.
 - Locate and select the <i>COMP-2800-TEAM-DTC-11-Covid-Royale</i> folder.

 You should now have our code displayed on your IDE.

2. Open Command Line (CMD/Terminal)
 - Press <i>Ctrl + Shift + `</i> to open up the VSC terminal window.
 - If your terminal is not yet redirected to the repo folder, you can do so by using the ``cd`` command. More information on this can be found [here.](https://www.minitool.com/news/how-to-change-directory-in-cmd.html)

 VSC built-in terminal window should display at the bottom of it's IDE.

3. Install packages
 - In your terminal window, type ``npm install``

 - A message similar to the image below should display in the chat after waiting a few seconds to display that you have successfully installed all required packages.

 ![npm results](https://i.imgur.com/OueQM4T.png)

#### API Setup

##### MongoDB Atlas Setup

instructions

##### OAuth Setup

instructions

#### Running the Server

From here the core file to run is ``server.js``

  - In your terminal window, in root <i>COMP-2800-TEAM-DTC-11-Covid-Royale</i>>     type ``npm start``

  - Alternatively for development we have used [Nodemon](https://www.npmjs.com/package/nodemon)                                  type ``npm run dev``

  - If the server loading is successful, you will see a message like the image below.

    ![Server running](https://i.imgur.com/HKLvPGf.png "Server Running")

-  Open your browser of choice, navigate to ``localhost:8080`` , you should now see a fully functional webpage. You now have a development environment for you to play around with!

## Resources

#### Frameworks

- [Node.js](https://nodejs.org/en/) - Core framework, application is written in Node.js
- [Express.io](https://expressjs.com/) - Common Node.js Server framework extension
- [Phaser 3](https://photonstorm.github.io/phaser3-docs/) - Open Source HTML5 game framework, used to generate the game.

#### APIs

- [Socket.io](https://socket.io/) - Used for Server to Client Websocketing. Things like players locations are emitted to the Server, and then broadcast to all other Clients connected to update X and Y co-ordinates. Socket.io handles this.
- [MongoDB](https://www.mongodb.com/) - Used to store persistent information, sessions, users and user data.
- [Passport](http://www.passportjs.org/) - For OAuth user Authentication, the application specifically uses the Google strategy. 

#### Applications

- [Shoebox](https://renderhjs.net/shoebox/) - Used for sprite packing and sprite animation stripping.
- [Tiled](https://www.mapeditor.org/) - Used for Tile mapping and generating our map layouts.
- [tile-extruder](https://github.com/sporadic-labs/tile-extruder) - To extrude tile maps to remove the dreaded "Tile-bleed"

#### Graphics

**Sprites / Tilesheets**

This game uses sprites from https://opengameart.org/

- [Zelda-like tilesets and sprites](https://opengameart.org/content/zelda-like-tilesets-and-sprites) - Used for game map, character, and game objects.

**BitmapFont**

- - Used for player Nameplate text, UI text and Post-Round text.

#### Audio

**Sound effects**

This game uses these sounds from [Freesound](https://freesound.org/):

- Pickup sound #1 by [TheDweebMan](https://freesound.org/people/TheDweebMan/sounds/277215/)

- Pickup sound #2 by [ProjectsU012](https://freesound.org/people/ProjectsU012/sounds/341695/)
- Sneeze sound by [joedeshon](https://freesound.org/people/joedeshon/sounds/266019/)
- Cough sound by [InsepectorJ](https://freesound.org/people/InspectorJ/sounds/368802/)

**Background music**

Royalty free music from https://www.fesliyanstudios.com

- ["A Bit Of Hope" by David Fesliyan](https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565)



