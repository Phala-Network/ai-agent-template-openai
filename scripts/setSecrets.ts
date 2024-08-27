import { spawn } from 'child_process'
import 'dotenv/config'

// Update your key value JSON object here for your secrets
const secrets = JSON.stringify({
  // Add your secrets here
  // key: value
  openaiApiKey: process.env.OPENAI_API_KEY
})

try {
  const gatewayUrl = 'https://wapo-testnet.phala.network';
  // Don't forget to update your agent CID in .env file
  const cid = process.env.AGENT_CID;
  const command = `curl ${gatewayUrl}/vaults -H 'Content-Type: application/json' -d '{"cid": "${cid}", "data": ${secrets}}'`;
  const childProcess = spawn(command, { shell: true })
  console.log(`Storing secrets...`)
  let stdout = ''
  childProcess.stdout.on('data', (data) => {
    process.stdout.write(data)
    stdout += data
  })

  let stderr = ''
  childProcess.stderr.on('data', (data) => {
    process.stderr.write(data)
    stderr += data
  })

  childProcess.on('close', (code) => {
    if (code === 0) {
      const regex = /"key":\s*"([a-zA-Z0-9]+)"/;
      const match = stdout.match(regex);

      if (match) {
        const token = match[1];
        console.log(`\n\nSecrets set successfully. Go to the URL below to interact with your agent:`);
        console.log(`${gatewayUrl}/ipfs/${cid}?key=${token}`);
      } else {
        console.log('Secrets failed to set');
      }
    } else {
      console.log(`Command exited with code ${code}`)
    }
  });

} catch (error) {
  console.error('Error:', error)
}
