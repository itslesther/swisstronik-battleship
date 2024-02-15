# Swisstronik Battleship

Swisstronik Battleship is a Game modified to use latest tools: Hardhat, Vite, Typescript, Tailwind and Swisstronik blockchain.

## Development process

In order to perform the the project migration from Truffle to Hardhat, Webpack to Vite and Javascript to Typescript, the repositories dependencies needed to be upgraded which caused many compilation issues which where fixed by studying the code, reading the dependencies documentation and searching for solutions. Solving compilation errors and making the project work with the new tools was the main challenge of the project. But after the project was working with the new tools, the development was very smooth.

## Quick Start

To install the dependencies run: `npm install`

### Running Project on Hardhat Local Network

1. Set `HARDHAT_ENABLE_FORKING="FALSE"` in the .env file (Forking, currently doesn't work with Swisstronik Network)
2. Set `VITE_IS_SWISSTRONIK_NETWORK="FALSE"` in the .env file 
3. Set `VITE_NODE_HTTP_URL= "http://127.0.0.1:8545"` in the .env file
4. Set `VITE_ACCOUNT_PRIVATE_KEYS` If using local private keys instead of Metamask (more details explained later)
5. Run `npx hardhat node`
6. Run in another console `npx hardhat run scripts/deploy.cjs --network localhost`
7. Copy the contract address and paste it in the `VITE_CONTRACT_ADDRESS` in the .env file
8. Run `npm run dev`

#### If using local private keys instead of Metamask

The game needs two tabs open:

- Go to:

Tab 1: `http://localhost:5173?account=0&provider=raw-keys`
Tab 2: `http://localhost:5173?account=1&provider=raw-keys`

This will use the private keys set in the .env file in the `VITE_ACCOUNT_PRIVATE_KEYS` variable.

#### If using Metamask instead of local private keys

The game needs two browsers open since metamask can only select one account at a time.

- Go to:

Browser 1: `http://localhost:5173?account=0&provider=metamask`
Browser 2: `http://localhost:5173?account=0&provider=metamask`

- Select localhost:8545 network on Metamask
- Clear the Metamask activity data (disable it and enable it again if needed)
- Play the game on both browsers

### Running Project on Swisstronik Testnet

1. Set `HARDHAT_ENABLE_FORKING="FALSE"` in the .env file (Forking, currently doesn't work with Swisstronik Network)
2. Set `VITE_IS_SWISSTRONIK_NETWORK="TRUE"` in the .env file 
3. Set `VITE_NODE_HTTP_URL= "https://json-rpc.testnet.swisstronik.com"` in the .env file
4. Set `VITE_ACCOUNT_PRIVATE_KEYS` If using local private keys instead of Metamask
5. Run `npx hardhat run scripts/deploy.cjs --network swisstronikTestnet`
6. Copy the contract address and paste it in the `VITE_CONTRACT_ADDRESS` in the .env file
7. Run `npm run dev`

#### If using local private keys instead of Metamask

- Go to:

Tab 1: `http://localhost:5173?account=0&provider=raw-keys`
Tab 2: `http://localhost:5173?account=1&provider=raw-keys`

#### If using Metamask instead of local private keys

- Go to:

Browser 1: `http://localhost:5173?account=0&provider=metamask`
Browser 2: `http://localhost:5173?account=0&provider=metamask`

- Select swisstronik Tesnet on Metamask
- Play the game on both browsers/tabs

## Issues found

- There are times where Metamask doesn't trigger the contract events, or they take time to be triggered
- When trying to call "attack" contract method using Swisstronik Tesnet, the transaction fails with the error: "rpc error: code = Internal desc = execution reverted: Reverted"
- This method works when using the local network, and the createGame and joinGame methods also works on the Swisstronik Tesnet
- Doing some research I found the following link: [StackOverflow](https://stackoverflow.com/questions/70257820/metamask-rpc-error-execution-reverted-code-32000-message-execution-reve)
- It seems the EVM is not finding the Contract method for some reason. This seems to be an EVM internal error. It doesn't seems to have nothing to do with the game code.
- When refreshing the browser, the game checks for the past contract events, from 10000 blocks before the current one, this can be slow and might not work if there are older events. Also, sometimes, the event is not triggerred or it takes too much time to be triggerred. Solution to both issues: Use an indexer such as Moralis or The Graph.


## Link to Demos with all cases

[Demos](https://drive.google.com/drive/folders/1iEuvcMlGGEMdbl9WA8J5sAqpxVHu5r9E)

## Original Game Repository
[Link](https://github.com/eightyfive/eth-battleship)