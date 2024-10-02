import { program } from "commander";  // Import Commander for command line interface
import chalk from "chalk";              // Import Chalk for colored output
import inquirer from "inquirer";        // Import Inquirer for user prompts
import getSuggestions from "./getSuggestions.js"; // Import function to get anime suggestions
import getAnimeInfo from "./getAnimeInfo.js";   // Import function to get anime info
import getEpisodes from "./getEpisodes.js";       // Import function to get episodes of an anime
import getGenre from "./getGenre.js";             // Import function to search by genre
import getSearchResults from "./getSearchResults.js"; // Import function to search for anime
import getEpisodeServers from "./getEpisodeServers.js"; // Import function to get episode servers
import openVideo from "./openVideo.js";             // Import function to open video player

// Set up the CLI program with a name and version
program.name('anime-cli').version('0.0.1');

// Command to get anime suggestions based on a query
program
    .command('suggest')
    .argument('<query>', 'Get suggestions')  // Argument for the query string
    .action(async (query) => {
        try {
            const suggestions = await getSuggestions(query); // Fetch suggestions

            // If suggestions are found, display them
            if (suggestions && suggestions["suggestions"]) {
                suggestions["suggestions"].forEach((suggestion, index) => {
                    console.log(`${chalk.blue.bold(index + 1)}. Name: ${suggestion["name"]}\n   Id: ${chalk.magenta.bold(suggestion["id"])}`);
                });
            }
        } catch (error) {
            // Handle errors during suggestion fetching
            console.error(chalk.red(`Failed to fetch suggestions: ${error.message}`));
        }
    });

// Command to get detailed info about an anime using its ID
program
    .command('info')
    .argument('<id>', 'Get anime info') // Argument for the anime ID
    .action(async (id) => {
        try {
            const animeInfo = await getAnimeInfo(id); // Fetch anime info

            // Check if info is retrieved successfully
            if (animeInfo && animeInfo["anime"] && animeInfo["anime"]["info"]) {
                console.log(`Name: ${chalk.yellowBright(animeInfo["anime"]["info"]["name"])}`);
                console.log(`Id: ${chalk.yellowBright(animeInfo["anime"]["info"]["id"])}`);
                console.log(`MyAnimeList id: ${chalk.yellowBright(animeInfo["anime"]["info"]["malId"])}`);
                console.log(`AniList Id: ${chalk.yellowBright(animeInfo["anime"]["info"]["anilistId"])}`);
                console.log(`Rating: ${chalk.yellowBright(animeInfo["anime"]["info"]["stats"]["rating"])}`);
                console.log(`Quality: ${chalk.yellowBright(animeInfo["anime"]["info"]["stats"]["quality"])}`);
                console.log(`Description: ${chalk.yellowBright(animeInfo["anime"]["info"]["description"])}`);
            } else {
                // Handle case where no info is found
                console.error(chalk.red("No information found for the provided ID."));
            }
        } catch (error) {
            // Handle errors during info fetching
            console.log(chalk.red(`Failed to fetch information: ${error.message}`));
        }
    });

// Command to search anime by genre
program
    .command('search-by-genre')
    .argument('<genre>', 'Search by genre') // Argument for the genre
    .argument('[page]', 'Page number')      // Optional argument for pagination
    .action(async (genre, page) => {
        try {
            const genreResults = await getGenre(genre, page); // Fetch genre results
            const animes = genreResults["animes"];

            // Check if any animes are found
            if (!animes || animes.length === 0) {
                console.log(chalk.bgYellow('No results found for this genre.'));
                return;
            }

            console.log(`Page: ${page}\n`);

            // Display each anime found in the specified genre
            animes.forEach((anime, index) => {
                console.log(`${chalk.blue.bold(index + 1)}. Name: ${anime.name}\nId: ${chalk.magenta.bold(anime.id)}`);
            });
        } catch (error) {
            // Handle errors during genre searching
            console.log(chalk.red(`Failed to search by genre: ${error.message}`));
        }
    });

// Command to search for anime using a query string
program
    .command('search')
    .argument('<query>', 'Search anime') // Argument for the search query
    .argument('[page]', 'Page number')   // Optional argument for pagination
    .action(async (query, page = 1) => {
        try {
            const searchResults = await getSearchResults(query, page); // Fetch search results

            // Check if any animes are found
            if (searchResults && searchResults["animes"] && searchResults["animes"].length > 0) {
                const choices = searchResults["animes"].map((anime, index) => ({
                    name: `${chalk.blue.bold(index + 1)}. Name: ${anime.name}`, // Displaying the name
                    value: anime.id // Setting the value to the anime ID
                }));

                // Prompt user to select an anime from the search results
                const { animeId } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'animeId',
                        message: 'Select an anime:',
                        choices: choices // List of choices
                    }
                ]);

                // Fetch episodes for the selected anime
                const episodes = await getEpisodes(animeId);
                if (episodes && episodes["episodes"]) {
                    // Create choices for episodes
                    const episodeChoices = episodes["episodes"].map((episode, index) => ({
                        name: `${chalk.blue.bold(index + 1)}. Episode: ${episode["number"]}`, // Displaying episode number
                        value: episode["episodeId"] // Setting the value to the episode ID
                    }));

                    // Prompt user to select an episode
                    const { episodeId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'episodeId',
                            message: 'Select episode:',
                            choices: episodeChoices // List of choices
                        }
                    ]);

                    // Get servers for the selected episode
                    const episodeServers = await getEpisodeServers(episodeId);

                    // Open video based on availability of dubbed or subbed versions
                    if (episodeServers["dub"]) {
                        await openVideo(episodeId, episodeServers, true); // Open dubbed version
                    } else if (episodeServers["sub"]) {
                        await openVideo(episodeId, episodeServers, false); // Open subbed version
                    }

                    console.log(chalk.green(`You are watching: ${episodeId}`));
                } else {
                    // Handle case where no episodes are found
                    console.error(chalk.red(`No episodes found.`));
                }
            } else {
                // Handle case where no results are found
                console.error(chalk.red(`No results found.`));
            }
        } catch (error) {
            // Handle errors during search
            console.log(chalk.red(`Failed to search anime: ${error.message}`));
        }
    });

// Parse command line arguments
program.parse(process.argv);
