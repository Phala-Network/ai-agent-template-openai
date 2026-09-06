import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import OpenAI from "openai";

export const app = new Hono()

const getAPIKey =  () => {
    console.log('Getting API Key from vault...')
    let vault: Record<string, string> = {};
    try {
        vault = JSON.parse(process.env.secret || '')
    } catch (e) {
        console.error(e)
    }
    return vault.openaiApiKey || ''
}

function buildHtmlResponse(message: string) {
    const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OpenAI Response</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background-color: #f9f9f9; }
                .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                h1 { color: #28a745; }
                p { font-size: 1.2em; color: #333; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Response</h1>
                <p>${message}</p>
            </div>
        </body>
        </html>
    `;
    return htmlResponse;
    }

app.get('/', async (c) => {
    let result = {message: ''}
    const openaiApiKey = getAPIKey()
    const queries = c.req.queries() || {}
    const openai = new OpenAI({apiKey: openaiApiKey})
    const openAiModel = (queries.openAiModel) ? queries.openAiModel[0] : 'gpt-3.5-turbo';
    const query = (queries.chatQuery) ? queries.chatQuery[0] as string : 'Who are you?'

    const completion = await openai.chat.completions.create({
        messages: [{role: "system", content: `${query}`}],
        model: `${openAiModel}`,
    })
    result.message = (completion.choices) ? completion.choices[0].message.content as string : 'Failed to get result'

    return c.html(buildHtmlResponse(result.message))

})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port
})
