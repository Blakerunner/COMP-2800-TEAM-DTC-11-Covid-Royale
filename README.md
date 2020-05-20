# COVID ROYALE
Online Multiplayer Game to spread awareness about COVID-19
To play our game, please [click here to visit our homepage.](https://covid-royale.westus.cloudapp.azure.com/)

<hr>

![Poster](https://i.imgur.com/xcIztM7.jpg "Poster")

## Requirements

#### MongoDB Atlas Account

account requirements

#### OAuth Account

account requirements

## Setup Instructions

#### Integrated Development Environment

The only requirements that you will need for this is capable IDE.
We recommend [Microsoft Visual Studio Code](https://code.visualstudio.com/), as setup instructions will be provided for VS Code.

#### Cloning

Use your preferred git tool or follow [these](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) instructions.

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

#### Running

From here the core file to run is ``server.js``

  - In your terminal window, in root <i>COMP-2800-TEAM-DTC-11-Covid-Royale</i>>  type ``npm start``

  - Alternatively for development we have used [Nodemon](https://www.npmjs.com/package/nodemon) type ``npm run dev``

  - If the server loading is successful, you will see a message exactly like the image below.

    ![Server running](https://i.imgur.com/HKLvPGf.png "Server Running")

-  Open your browser of choice, navigate to ``localhost:8080`` , you should now see a fully functional webpage. You now have a development environment for you to play around with!

## Resources

#### Frameworks

#### APIs

#### Graphics

#### Audio