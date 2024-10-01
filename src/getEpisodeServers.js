export default async function getEpisodeServers(episodeId) {
    try {
        const response = await fetch(`http://localhost:4000/anime/servers?episodeId=${episodeId}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("Failed to fetch episode servers:", error);
        
    }
}