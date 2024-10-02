// Function to fetch the streaming link for a specific episode from a given server
export default async function getEpisodeStreamingLink(episodeId, server = "hd-1", category = "sub") {
    try {
        // Make a GET request to the specified endpoint to retrieve the streaming link
        // Includes parameters for episode ID, server, and category (sub or dub)
        const response = await fetch(`http://localhost:4000/anime/episode-srcs?id=${episodeId}&server=${server}&category=${category}`);
        
        // Check if the response is not OK (status outside the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`); // Throw an error with status information
        }

        // Parse the response data as JSON
        const data = await response.json();

        return data; // Return the parsed data containing the streaming link
    } catch (error) {
        // Log any errors encountered during the fetch process
        console.log("Failed to fetch anime streaming link:", error);
    }
}
