// Function to fetch anime based on a specific genre and pagination
export default async function getGenre(genreName, page = 1) {
    try {
        // Make a GET request to the specified endpoint to retrieve anime of the given genre
        // The request includes the genre name and an optional page number for pagination
        const response = await fetch(`http://localhost:4000/anime/genre/${genreName}?page=${page}`);
        
        // Check if the response is not OK (status outside the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`); // Throw an error with status information
        }

        // Parse the response data as JSON
        const data = await response.json();
        
        return data; // Return the parsed data containing anime of the specified genre
    } catch (error) {
        // Log any errors encountered during the fetch process
        console.error("Failed to fetch anime suggestions:", error);
    }
}
