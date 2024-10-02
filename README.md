![Description of GIF](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXh3MzNoZXg5MDkyMXB1bzUxMDRrcDF5Zm41bGdtbnhrcnNuYmlhYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/etW2P2cvB0PYY/giphy.webp)

# Ani-CLI
This is a command-line interface (CLI) application for anime enthusiasts that allows users to explore anime suggestions, information, episodes, and streaming options. The application interacts with the AniWatch API to fetch the necessary data.

## Prerequisites
Before using this application, ensure that you have the [AniWatch API](https://github.com/ghoshRitesh12/aniwatch-api) running locally. This API is required for the application to function correctly.

## Installation
1. Clone the repository:
```bash
git clone https://github.com/KonyD/ani-cli.git
cd anime-cli
```
2. Install the required dependencies:
```bash
npm install
```

## Commands
1. Get anime suggestions:
```bash
node index.js suggest <query>
```
This command retrieves a list of suggested anime based on the provided search query. The application will display a numbered list of suggestions, including the name and ID of each anime.

2. Get anime information:
```bash
node index.js info <id>
```
This command fetches detailed information about a specific anime using its ID. It provides details such as the name, MyAnimeList ID, AniList ID, rating, quality, and description of the anime.

3. Search by genre:
```bash
node index.js search-by-genre <genre> [page]
```
This command allows you to search for anime based on a specified genre. You can also specify a page number for pagination. If no page number is provided, the default is page 1. The application will return a list of anime titles belonging to the specified genre.

4. Search and watch anime:
```bash
node index.js search <query> [page]
```
This command performs a search for anime using the provided query. Similar to the genre search, you can specify a page number for pagination. The application will display a list of anime that match the search criteria. Once you have selected an anime and its corresponding episode, the application will prompt you to choose between dubbed or subbed versions. You will also select a streaming server from the available options. The application will then generate an HTML video player to watch the selected episode.

## How to use
1. Start the AniWatch API.
2. Run the desired command in your terminal.
3. Follow the prompts to interact with the application.

## Contributing
Contributions are welcome! If you have suggestions or improvements, please feel free to submit a pull request.
