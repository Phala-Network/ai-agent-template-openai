import main from './index'
import 'dotenv/config'

async function execute(inputObj: any) {
    const inputJson = JSON.stringify(inputObj)
    console.log('INPUT:', inputJson)
    return await main(inputJson)
}

const sampleInput = {
    "untrustedData": {
        "fid": 2,
        "url": "https://fcpolls.com/polls/1",
        "messageHash": "0xd2b1ddc6c88e865a33cb1a565e0058d757042974",
        "timestamp": 1706243218,
        "network": 1,
        "buttonIndex": 2,
        "castId": {
            "fid": 226,
            "hash": "0xa48dd46161d8e57725f5e26e34ec19c13ff7f3b9"
        }
    },
    "trustedData": {
        "messageBytes": "d2b1ddc6c88e865a33cb1a565e0058d757042974..."
    }
}

async function test() {
    const getResult = await execute({
        method: 'GET',
        path: '/ipfs/QmVHbLYhhYA5z6yKpQr4JWr3D54EhbSsh7e7BFAAyrkkMf',
        queries: { chatQuery: ["Who are you?"] },
        secret: { openaiApiKey: process.env.OPENAI_API_KEY },
        headers: {},
    })
    console.log('GET RESULT:', JSON.parse(getResult))

    const postResult = await execute({
        method: 'POST',
        path: '/ipfs/QmVHbLYhhYA5z6yKpQr4JWr3D54EhbSsh7e7BFAAyrkkMf',
        queries: {
            chatQuery: ["When did humans land on the moon?"]
        },
        secret: { openaiApiKey: process.env.OPENAI_API_KEY },
        headers: {},
        body: JSON.stringify(sampleInput)
    })
    console.log('POST RESULT:', JSON.parse(postResult))
}

test().then(() => { }).catch(err => console.error(err)).finally(() => process.exit())
