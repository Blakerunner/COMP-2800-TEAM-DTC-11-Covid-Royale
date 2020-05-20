# COVID ROYALE
Online Multiplayer Game to spread awareness about COVID-19
To play our game, please [click here to visit our homepage.](https://covid-royale.westus.cloudapp.azure.com/)
<br/>
To view our Test Planning Sheet, please [click here.](https://docs.google.com/spreadsheets/d/1Uznlux2gQFMmMrv-HQ4WFVlykO0msHPVcktTSyNpGcA/edit#gid=0)
<hr>
# By Goose Logic
![Goose Logic](https://imgur.com/a/2pFnZIx)
<hr>
# Instructions on how to set up a development environment for our game
If you wish to run a development environment for our webpages and our game, the instructions below will guide you towards doing so.

The only requirements that you will need for this is [Microsoft Visual Studio Code](https://code.visualstudio.com/). This is due to it's  terminal feature.

## Installing npm
Once you have cloned our repo, the first step to set up a development environment is to first install npm.

1. Open Visual Studio Code (VSC)
 - Once you have VSC opened, press <i>Ctrl + O</i> to open a file.
 - Locate and select the <i>COMP-2800-TEAM-DTC-11-Covid-Royale</i> folder.
 
 You should now have our code displayed on your IDE.
 
2. Open Command Line (CMD/Terminal)
 - Press <i>Ctrl + Shift + `</i> to open up the VSC terminal window.
 - If your terminal is not yet redirected to the repo folder, you can do so by using the ``cd`` command. More information on this can be found [here.](https://www.minitool.com/news/how-to-change-directory-in-cmd.html)

 VSC built-in terminal window should display at the bottom of it's IDE.
 
3. Install npm
 - In your terminal window, type ``npm install``
 - A message similar to the image below should display in the chat after waiting a few seconds to display that you have successfully installed npm.<br/>
 ![npmInstallWindow](https://imgur.com/a/aZI1PTx "npm")<br/>
 
 4. Running npm dev
  - In your terminal window, type ``npm run dev``
  - If the server loading is successful, you will see a message exactly like the image below.

If you now type ``localhost:8080``, you should now see a fully functional webpage.
You now have a development environment for you to play around with!<br/>

