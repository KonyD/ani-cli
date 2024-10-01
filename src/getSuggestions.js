export default async function getSuggestions(query) {
    try {
        const response = await fetch(`http://localhost:4000/anime/search/suggest?q=${query}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("Failed to fetch anime suggestions:", error);
        
    }
}