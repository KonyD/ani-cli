// Function to fetch search results for anime based on a query and pagination
export default async function getSearchResults(query, page = 1) {
    try {
        // Make a GET request to the specified endpoint to search for anime
        // The request includes the search query and an optional page number for pagination
        const response = await fetch(`http://localhost:4000/anime/search?q=${query}&page=${page}`);

        // Check if the response is not OK (status outside the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`); // Throw an error with status information
        }

        // Parse the response data as JSON
        const data = await response.json();
        
        return data; // Return the parsed data containing search results
    } catch (error) {
        // Log any errors encountered during the fetch process
        console.error("Failed to fetch anime search results:", error);
    }
}
