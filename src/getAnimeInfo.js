export default async function getAnimeInfo(animeId) {
    try {
        const response = await fetch(`http://localhost:4000/anime/info?id=${animeId}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("Failed to fetch anime infos:", error);
        
    }
}