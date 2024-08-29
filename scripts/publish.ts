// Call Thirdweb upload command to deploy compiled frame
import { spawn } from 'child_process'
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import 'dotenv/config'

function ensureLogsFolderExists() {
  const logsFolder = './logs';
  if (!existsSync(logsFolder)) {
    mkdirSync(logsFolder);
    console.log('Logs folder created.');
  }
}

function updateDeploymentLog(cid: string) {
  ensureLogsFolderExists();

  const gatewayUrl = 'https://wapo-testnet.phala.network';
  const deploymentInfo = {
    date: new Date().toISOString(),
    cid: cid,
    url: `${gatewayUrl}/ipfs/${cid}`
  };

  writeFileSync('./logs/latestDeployment.json', JSON.stringify(deploymentInfo, null, 2), 'utf-8');
  console.log('Deployment information updated in ./logs/latestDeployment.json');
}

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
        console.log(`\nIf your agent requires secrets, ensure to do the following:\n1) Edit the ./secrets/default.json file or create a new JSON file in the ./secrets folder and add your secrets to it.\n2) Run command: 'npm run set-secrets' or 'npm run set-secrets [path-to-json-file]'`);

        // Update the deployment log
        updateDeploymentLog(ipfsCid);
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
