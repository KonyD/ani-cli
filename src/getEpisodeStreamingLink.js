export default async function getEpisodeStreamingLink(episodeId, server = "hd-1", category = "sub") {
    try {
        const response = await fetch(`http://localhost:4000/anime/episode-srcs?id=${episodeId}&server=${server}&category=${category}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.log("Failed to fetch anime streaming link:", error);
    }
}