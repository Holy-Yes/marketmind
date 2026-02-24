import Groq from 'groq-sdk'

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
})

export const askAI = async (prompt, systemPrompt = 'You are a helpful sales and marketing AI assistant for Indian brands. Always respond clearly and specifically.') => {
    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1024,
        })
        const text = completion.choices?.[0]?.message?.content
        if (!text) throw new Error('Empty response from Groq')
        return { success: true, data: text.trim() }
    } catch (err) {
        console.error('Groq error:', err.message)
        return { success: false, error: err.message }
    }
}

export const askAIStream = async (prompt, onToken, systemPrompt = 'You are a helpful sales and marketing AI assistant for Indian brands. Always respond clearly and specifically.') => {
    try {
        const stream = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            stream: true,
        })

        let fullText = ''
        for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content || ''
            fullText += token
            if (onToken) onToken(token)
        }
        return { success: true, data: fullText }
    } catch (err) {
        console.error('Groq stream error:', err.message)
        return { success: false, error: err.message }
    }
}
