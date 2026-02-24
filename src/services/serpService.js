const SERP_KEY = import.meta.env.VITE_SERP_API_KEY

export const searchWeb = async (query) => {
    try {
        // Use backend proxy to avoid CORS
        const response = await fetch(`http://localhost:8000/search/?q=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('mm_token')}` // Ensure correct mm_token is sent
            }
        })
        const data = await response.json()

        if (!response.ok) throw new Error(data.detail || 'Search proxy request failed')

        return data // Backend already formats it as { success: true, data: [...] }
    } catch (err) {
        console.error('Search error:', err.message)
        return { success: false, error: err.message }
    }
}

export const getCompetitorData = async (brandName) => {
    const [general, news, social] = await Promise.all([
        searchWeb(`${brandName} brand market position India 2024`),
        searchWeb(`${brandName} latest news product launch 2024`),
        searchWeb(`${brandName} customer reviews reputation India`),
    ])

    const combined = [
        ...(general.data || []),
        ...(news.data || []),
        ...(social.data || []),
    ].map(r => `${r.title}: ${r.snippet}`).join('\n')

    return combined || `No web data found for ${brandName}`
}
