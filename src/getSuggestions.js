// Function to fetch anime suggestions based on a search query
export default async function getSuggestions(query) {
    try {
        // Make a GET request to the specified endpoint to retrieve suggestions for the given query
        const response = await fetch(`http://localhost:4000/anime/search/suggest?q=${query}`);

        // Check if the response is not OK (status outside the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`); // Throw an error with status information
        }

        // Parse the response data as JSON
        const data = await response.json();
        
        return data; // Return the parsed data containing suggestions
    } catch (error) {
        // Log any errors encountered during the fetch process
        console.error("Failed to fetch anime suggestions:", error);
    }
}
