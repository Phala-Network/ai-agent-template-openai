import { Request, Response, route } from './httpSupport'
import { renderHtml } from './uiSupport'

import OpenAI from 'openai'

async function GET(req: Request): Promise<Response> {
    const secret = req.queries?.key ?? '';
    const openaiApiKey = req.secret?.openaiApiKey as string;
    const openai = new OpenAI({ apiKey: openaiApiKey })
    const query = req.queries.chatQuery[0] as string;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: `${query}` }],
        model: 'gpt-3.5-turbo',
    });

    return new Response(renderHtml(completion.choices[0].message.content as string))
}

async function POST(req: Request): Promise<Response> {
    const secret = req.queries?.key ?? '';
    const openaiApiKey = req.secret?.openaiApiKey as string;
    const openai = new OpenAI({ apiKey: openaiApiKey })
    const query = req.queries.chatQuery[0] as string;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: `${query}` }],
        model: 'gpt-3.5-turbo',
    });

    return new Response(renderHtml(completion.choices[0].message.content as string))
}

export default async function main(request: string) {
    return await route({ GET, POST }, request)
}
