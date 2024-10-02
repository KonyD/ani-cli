import getEpisodeStreamingLink from "./getEpisodeStreamingLink.js";
import inquirer from "inquirer";
import chalk from "chalk";
import open from "open";
import path from "path";
import fs from "fs";

// Function to get episodes for a specific episode ID, server choices, and language preference (sub or dub)
export default async function getEpisodes(episodeId, episodeServers, hasDub) {
    // Prompt the user to choose between sub or dub
    const { languageChoice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'languageChoice',
            message: 'Do you prefer sub or dub?',
            choices: ['sub', 'dub']
        }
    ]);

    // Map the server choices for the selected language to a format suitable for inquirer
    const servers = episodeServers[`${languageChoice}`].map((server, index) => ({
        name: `${chalk.blue.bold(index + 1)}. ${server["serverName"]}`, // Display server index and name in blue bold text
        value: server["serverName"] // Use server name as the value for selection
    }));
    
    // Prompt the user to select a server from the available options
    const { serverChoice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'serverChoice',
            message: 'Select a server:',
            choices: servers // Show the server options to the user
        }
    ]);

    // Fetch video streaming link based on the selected episode, server, and language choice
    const videoData = await getEpisodeStreamingLink(episodeId, serverChoice, languageChoice);
    //console.log(videoData); // Log the video data for debugging

    // Construct HTML content for the video player
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Video Player</title>
      <link href="https://vjs.zencdn.net/7.20.3/video-js.css" rel="stylesheet" />
      <script src="https://vjs.zencdn.net/7.20.3/video.min.js"></script>
      <style>
            body {
              margin: 0;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: #333; // Dark background for the player
            }

            video {
              max-width: 100%; // Responsive video
              height: auto;
            }

            h1 {
                color: white; // White text color for the heading
                margin-bottom: 20px;
            }
       </style>
    </head>
    <body>
      <h1>ANI-CLI Video Player</h1>
      <video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto" width="640" height="360" data-setup="{}">
        <source src="${videoData.sources[0].url}" type="application/x-mpegURL">`;

    // Add tracks conditionally based on hasDub
    if (!hasDub) {
        htmlContent += `
        <track kind="${videoData.tracks[0].kind}" src="${videoData.tracks[0].file}" srclang="en" label="${videoData.tracks[0].label}" default>
        <track kind="${videoData.tracks[1].kind}" src="${videoData.tracks[1].file}">`;
    }

    // Close the video tag and add the video player script
    htmlContent += `
      </video>
      <script>
        var player = videojs('my-video'); // Initialize video.js player
        player.play(); // Automatically play the video
      </script>
    </body>
    </html>`;

    // Write the HTML content to a file
    const filePath = path.join('./', 'videoPlayer.html');
    fs.writeFileSync(filePath, htmlContent); // Save the HTML file

    // Open the generated HTML file in the default browser
    open(filePath).then(() => {
      console.log(chalk.green('Video player opened in the default browser.')); // Log success message
    }).catch(error => {
      // Handle any errors that occur while opening the file
      console.error(chalk.red(`Error opening the file: ${error.message}`));
    });
}
