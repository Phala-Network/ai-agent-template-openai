// Call Thirdweb upload command to deploy compiled frame
import { spawn } from 'child_process'
import 'dotenv/config'

try {
  const gatewayUrl = 'https://wapo-testnet.phala.network'
  const command = `npx thirdweb upload dist/index.js -k ${process.env.THIRDWEB_API_KEY}`
  const childProcess = spawn(command, { shell: true })
  console.log(`Running command: npx thirdweb upload dist/index.js`)
  console.log(`This may require you to log into thirdweb and will take some time to publish to IPFS...`)
  childProcess.stdout.on('data', (data) => {
    process.stdout.write(data)
  })

  let stderr = ''
  childProcess.stderr.on('data', (data) => {
    process.stderr.write(data)
    stderr += data
  })

  childProcess.on('close', (code) => {
    if (code === 0) {
      const regex = /ipfs:\/\/([a-zA-Z0-9]+)/;
      const match = stderr.match(regex);

      if (match) {
        const ipfsCid = match[1];
        console.log(`\nAgent Contract deployed at: ${gatewayUrl}/ipfs/${ipfsCid}`);
        console.log(`\nIf your agent requires secrets, ensure to do the following:\n1) Edit the setSecrets.ts file to add your secrets\n2) Set the variable AGENT_CID=${ipfsCid} in the .env file\n3) Run command: npm run set-secrets`);
      } else {
        console.log('IPFS CID not found');
      }
    } else {
      console.log(`Command exited with code ${code}`)
    }
  });
} catch (error) {
  console.error('Error:', error)
}
