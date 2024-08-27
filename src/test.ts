import main from './index'
import 'dotenv/config'

async function execute(inputObj: any) {
    const inputJson = JSON.stringify(inputObj)
    console.log('INPUT:', inputJson)
    return await main(inputJson)
}

async function test() {
    const getResult = await execute({
        method: 'GET',
        path: '/ipfs/CID',
        queries: {
            chatQuery: ["When did humans land on the moon?"],
            openAiModel: [process.env.OPENAI_MODEL]
        },
        secret: { openaiApiKey: process.env.OPENAI_API_KEY },
        headers: {},
    })
    console.log('GET RESULT:', JSON.parse(getResult))

    const postResult = await execute({
        method: 'POST',
        path: '/ipfs/CID',
        queries: {
            chatQuery: ["When did humans land on the moon?"],
            openAiModel: ["gpt-4o"]
        },
        secret: { openaiApiKey: process.env.OPENAI_API_KEY },
        headers: {},
        body: JSON.stringify({})
    })
    console.log('POST RESULT:', JSON.parse(postResult))

    console.log(`**NOTE**:\nThis is a local test and your published code could have a different result when executing in the TEE on Phala Network.`)
    console.log(`\nPlease reach out to the team here if your run into issues: https://discord.gg/phala-network`)
}

test().then(() => { }).catch(err => console.error(err)).finally(() => process.exit())
