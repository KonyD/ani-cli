export default async function getGenre(genreName, page = 1) {
    try {
        const response = await fetch(`http://localhost:4000/anime/genre/${genreName}?page=${page}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("Failed to fetch anime suggestions:", error);
        
    }
}