export default async function getEpisodes(animeId) {
    try {
        const response = await fetch(`http://localhost:4000/anime/episodes/${animeId}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("Failed to fetch anime episodes:", error);
        
    }
}