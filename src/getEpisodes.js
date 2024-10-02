// Function to fetch episodes of an anime based on its ID
export default async function getEpisodes(animeId) {
    try {
        // Make a GET request to the specified endpoint to retrieve episodes for the given anime ID
        const response = await fetch(`http://localhost:4000/anime/episodes/${animeId}`);

        // Check if the response is not OK (status outside the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`); // Throw an error with status information
        }

        // Parse the response data as JSON
        const data = await response.json();
        
        return data; // Return the parsed data containing the list of episodes
    } catch (error) {
        // Log any errors encountered during the fetch process
        console.error("Failed to fetch anime episodes:", error);
    }
}
