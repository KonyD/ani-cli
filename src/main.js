import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import getSuggestions from "./getSuggestions.js";
import getAnimeInfo from "./getAnimeInfo.js";
import getEpisodes from "./getEpisodes.js";
import getGenre from "./getGenre.js";
import getSearchResults from "./getSearchResults.js";
import getEpisodeServers from "./getEpisodeServers.js";
import getEpisodeStreamingLink from "./getEpisodeStreamingLink.js";


program.name('anime-cli').version('0.0.1');

program
    .command('suggest')
    .argument('<query>', 'Get suggestions')
    .action(async (query) => {
        try {
            const suggestions = await getSuggestions(query);

            if (suggestions && suggestions["suggestions"]) {
                suggestions["suggestions"].forEach((suggestion, index) => {
                    console.log(`${chalk.blue.bold(index + 1)}. Name: ${suggestion["name"]}\n   Id: ${chalk.magenta.bold(suggestion["id"])}`);
                });
            }
        } catch (error) {
            console.error(chalk.red(`Failed to fetch suggestions: ${error.message}`));
        }
    });

program
    .command('info')
    .argument('<id>', 'Get anime info')
    .action(async (id) => {
        try {
            const animeInfo = await getAnimeInfo(id);

            if (animeInfo && animeInfo["anime"] && animeInfo["anime"]["info"]) {
                console.log(`Name: ${chalk.yellowBright(animeInfo["anime"]["info"]["name"])}`);
                console.log(`Id: ${chalk.yellowBright(animeInfo["anime"]["info"]["id"])}`);
                console.log(`MyAnimeList id: ${chalk.yellowBright(animeInfo["anime"]["info"]["malId"])}`);
                console.log(`AniList Id: ${chalk.yellowBright(animeInfo["anime"]["info"]["anilistId"])}`);
                console.log(`Rating: ${chalk.yellowBright(animeInfo["anime"]["info"]["stats"]["rating"])}`);
                console.log(`Quality: ${chalk.yellowBright(animeInfo["anime"]["info"]["stats"]["quality"])}`);
                console.log(`Description: ${chalk.yellowBright(animeInfo["anime"]["info"]["description"])}`);
            }
            else {
                console.error(chalk.red("No information found for the provided ID."));
            }
        } catch (error) {
            console.log(chalk.red(`Failed to fetch information: ${error.message}`));
        }
        
    });

program
    .command('search-by-genre')
    .argument('<genre>', 'Search by genre')
    .argument('[page]', 'Page number')
    .action(async (genre, page) => {
        try {
            const genreResults = await getGenre(genre, page);
            const animes = genreResults["animes"];

            if (!animes || animes.length === 0) {
                console.log(chalk.bgYellow('No results found for this genre.'));
                return;
            }

            console.log(`Page: ${page}\n`);
      
            animes.forEach((anime, index) => {
                console.log(`${chalk.blue.bold(index + 1)}. Name: ${anime.name}\nId: ${chalk.magenta.bold(anime.id)}`);
            });
        } catch (error) {
            console.log(chalk.red(`Failed to search by genre: ${error.message}`));
        }
    });

program
    .command('search')
    .argument('<query>', 'Search anime')
    .argument('[page]', 'Page number')
    .action(async (query, page = 1) => {
        try {
            const searchResults = await getSearchResults(query, page);

            if (searchResults && searchResults["animes"] && searchResults["animes"].length > 0) {
                const choices = searchResults["animes"].map((anime, index) => ({
                    name: `${chalk.blue.bold(index + 1)}. Name: ${anime.name}`,
                    value: anime.id
                }));

                const { animeId } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'animeId',
                        message: 'Select an anime:',
                        choices: choices
                    }
                ]);

                console.log(chalk.green(`You selected anime ID: ${animeId}`));

                const episodes = await getEpisodes(animeId);
                if (episodes && episodes["episodes"]) {
                    const episodeChoices = episodes["episodes"].map((episode, index) => ({
                        name: `${chalk.blue.bold(index + 1)}. Episode: ${episode["number"]}`,
                        value: episode["episodeId"]
                    }));

                    const { episodeId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'episodeId',
                            message: 'Select an anime:',
                            choices: episodeChoices
                        }
                    ]);

                    const episodeServers = await getEpisodeServers(episodeId);

                    if(episodeServers["dub"]) {
                        const { languageChoice } = await inquirer.prompt([
                            {
                                type: 'list',
                                name: 'languageChoice',
                                message: 'Do you prefer sub or dub?',
                                choices: ['sub', 'dub']
                            }
                        ])

                        const servers = episodeServers[`${languageChoice}`].map((server, index) => ({
                            name: `${chalk.blue.bold(index + 1)}. ${server["serverName"]}`,
                            value: server["serverName"]
                        }));
                        
                        const { serverChoice } = await inquirer.prompt([
                            {
                                type: 'list',
                                name: 'serverChoice',
                                message: 'Select a server:',
                                choices: servers
                            }
                        ]);

                        const streaminglink = await getEpisodeStreamingLink(episodeId, serverChoice, languageChoice);
                        console.log(streaminglink);
                        
                    }

                    console.log(chalk.green(`You selected anime ID: ${episodeId}`));
                } else {
                    console.error(chalk.red(`No episodes found.`));
                }
            } else {
                console.error(chalk.red(`No results found.`));
            }
        } catch (error) {
            console.log(chalk.red(`Failed to search anime: ${error.message}`));
        }
    });

program.parse(process.argv);
