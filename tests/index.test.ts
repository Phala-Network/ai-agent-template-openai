import {afterAll, describe, test, vi, expect, beforeAll} from 'vitest'
import { app } from '../src/'
import * as path from "node:path";

const chatQuery = 'Who are you two?';
const model = 'claude-3-5-sonnet-20241022';

// Set Testing env secrets
const secretsFile = '../secrets/default.json'
vi.stubEnv('secret', JSON.stringify(require(path.join(__dirname, secretsFile))))

describe('Test OpenAI Agent Contract', () => {
    test('returns default response when no query parameters are provided', async () => {
        const resp = await app.request('/')
        expect(resp.status).toBe(200)
        const text = await resp.text();
        expect(text).toContain('<h1>Response</h1>')
    }, 10000) // Define o timeout para 10 segundos

    test('returns response with provided query parameters', async () => {
        const resp = await app.request('/?chatQuery=Hello&openAiModel=gpt-3.5-turbo')
        expect(resp.status).toBe(200)
        const text = await resp.text();
        expect(text).toContain('<h1>Response</h1>')

    }, 10000) // Define o timeout para 10 segundos
// Define o timeout para 10 segundos
})

afterAll(async () => {
    console.log(`\nNow you are ready to publish your agent, add secrets, and interact with your agent in the following steps:\n- Execute: 'npm run publish-agent'\n- Set secrets: 'npm run set-secrets'\n- Go to the url produced by setting the secrets (e.g. https://wapo-testnet.phala.network/ipfs/QmPQJD5zv3cYDRM25uGAVjLvXGNyQf9Vonz7rqkQB52Jae?key=b092532592cbd0cf)`)
}) ;