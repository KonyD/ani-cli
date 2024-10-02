import getEpisodeStreamingLink from "./getEpisodeStreamingLink.js"; // Import function to fetch streaming link for episode
import chalk from "chalk"; // Import chalk for styling terminal output
import open from "open"; // Import open to launch the video player in a browser
import path from "path"; // Import path module to handle file paths
import fs from "fs"; // Import fs to handle file system operations
import inquirer from "inquirer"; // Import inquirer for interactive command line prompts

// Function to open a video player with specific episode data, server choices, and language (sub or dub)
export default async function openVideo(episodeId, episodeServers, languageChoice) {
    // Generate a list of servers based on the user's language choice (sub or dub) with server names styled using chalk
    const servers = episodeServers[languageChoice].map((server, index) => ({
        name: `${chalk.blue.bold(index + 1)}. ${server.serverName}`, // Display index and server name with chalk formatting
        value: server.serverName // Value to be used when server is selected
    }));

    // Prompt the user to select a server from the generated list
    const { serverChoice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'serverChoice',
            message: 'Select a server:', // Message displayed to the user
            choices: servers // Choices displayed to the user
        }
    ]);

    // Fetch the video streaming link based on the selected episode ID, server, and language
    const videoData = await getEpisodeStreamingLink(episodeId, serverChoice, languageChoice);
    // Uncomment the line below to log video data for debugging purposes
    //console.log('Video Data:', JSON.stringify(videoData, null, 2)); 

    // Determine if the video contains subtitle tracks by checking the video data
    let hasSubtitleTrack = videoData.tracks && videoData.tracks[0] && videoData.tracks[0].kind === 'captions';

    // Log track data to check its structure (useful for debugging)
    console.log('Tracks:', videoData);

    // Create the HTML structure for the video player, including a responsive video element
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Video Player</title>
      <link href="https://vjs.zencdn.net/7.20.3/video-js.css" rel="stylesheet" /> <!-- Video.js stylesheet -->
      <script src="https://vjs.zencdn.net/7.20.3/video.min.js"></script> <!-- Video.js script -->
      <style>
            body {
              margin: 0;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: #333; /* Dark background */
            }

            video {
              max-width: 100%; /* Responsive video */
              height: auto;
            }

            h1 {
                color: white; /* White text for the heading */
                margin-bottom: 20px;
            }
       </style>
    </head>
    <body>
      <h1>ANI-CLI Video Player</h1> <!-- Page title -->
      <video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto" width="640" height="360" data-setup="{}">
        <source src="${videoData.sources[0].url}" type="application/x-mpegURL"> <!-- Video source using m3u8 link -->
  `;

  // If subtitles are available and the user selected the 'sub' option, add the subtitle track to the video
  if (hasSubtitleTrack && languageChoice === 'sub') {
    htmlContent += `<track kind="${videoData.tracks[0].kind}" src="${videoData.tracks[0].file}" srclang="en" label="${videoData.tracks[0].label}" default>`;
  }

  // If the video contains a thumbnail track, add it to the video player
  if (videoData.tracks[1] && videoData.tracks[1].kind === 'thumbnails') {
    htmlContent += `<track kind="${videoData.tracks[1].kind}" src="${videoData.tracks[1].file}">`;
  }
  
  // Close the HTML content for the video player and initialize Video.js for video controls and responsiveness
  htmlContent += `
      </video>
      <script>
        var player = videojs('my-video', {
            controls: true,
            autoplay: false,
            preload: 'auto',
            responsive: true,
            fluid: true // Makes the player responsive and fluid
        });
      </script>
    </body>
    </html>`;

    // Save the HTML content as 'videoPlayer.html' in the current directory
    const filePath = path.join('./', 'videoPlayer.html');
    fs.writeFileSync(filePath, htmlContent); // Write the file to disk

    // Open the newly created HTML file in the user's default web browser
    open(filePath).then(() => {
      console.log(chalk.green('Video player opened in the default browser.')); // Log success message to console
    }).catch(error => {
      console.error(chalk.red(`Error opening the file: ${error.message}`)); // Log any errors encountered
    });
}
