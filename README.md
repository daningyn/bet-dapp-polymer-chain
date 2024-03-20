# NBA Multichain Betting Platform

The project is based on Polymer Infrastructure

## Team Members

- @daningyn - Lead developer
- @lyhv - Developer
- @conghc - Developer

## Introduction

This project is a comprehensive solution combining modern web technologies and blockchain for a seamless user experience and robust back-end functionality.
- It utilizes ReactJS for the UI, ensuring a responsive and interactive web application.
- The server-side logic is handled by Node.js, providing a scalable and efficient server that can handle requests swiftly.
- The core logic, especially smart contracts and blockchain interactions, is managed through a custom IBC (Inter-Blockchain Communication) channel of Polymer, enabling secure and verifiable transactions across different blockchains.

Traditional online betting platforms are often centralized, posing risks of security breaches and limiting users to specific geographical locations due to regulatory restrictions. 

Furthermore, they typically operate on a single blockchain, which can lead to congestion, high transaction fees, and slower processing times during peak periods.

We offer a decentralized platform that reduces the risk of security breaches and ensures fairness in betting outcomes.

## Resource Used

The repo uses the [ibc-app-solidity-template](https://github.com/open-ibc/ibc-app-solidity-template) as starting point and adds custom contracts NBABet and XProofOfBetNFT that implement the custom logic.

The repo also uses ReactJS and NodeJS for building the dApp UI/UX

Additional resources used:

Hardhat
Blockscout
Tenderly

## Steps to reproduce

Before installing Docker Compose, Docker must be installed and running on your system. Follow the official Docker installation guide for your operating system:

- **Linux**: Visit [Docker Engine for Linux](https://docs.docker.com/engine/install/#server) and select your Linux distribution for detailed installation instructions.
- **Windows**: Follow the [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/) guide.
- **macOS**: Follow the [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/) guide.

### Docker-compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Building the WebApp

```bash
docker-compose up -d --build --force-recreate
```
You will see the docker completed, check out `http://localhost:9999`

## Proof of testnet interaction

After following the steps above you should have interacted with the testnet. You can check this at the [IBC Explorer](https://explorer.ethdenver.testnet.polymer.zone/).

Here's the data of our application:

- NBABet (OP Sepolia) : 0x8fE3D8e932947dd0E01994F8E5F991760Ebf5487
- ProofOfBetNFT (Base Sepolia): 0x83F29E9243010E4A501092A195eCe702aa494D10
- Channel (OP Sepolia): channel-38114
- Channel (Base Sepolia): channel-38115

- Proof of Testnet interaction:
    - [SendTx](https://optimism-sepolia.blockscout.com/tx/0x64e5c096538a4aae91821b5d0c9d62c0143e84e1eebef3f489c6b39d11391e85)
    - [RecvTx](https://base-sepolia.blockscout.com/tx/0xc1b39ca14ac6428686736319af07a4db63887a3845dc57a5ac0cd5ba21d5cb47)
    - [Ack](https://optimism-sepolia.blockscout.com/tx/0x8a2657a31fe2737d71fc8101e7488461cf256ae9b86304784e59962b26c133c9)

## Challenges Faced

- Debugging used to be tricky when the sendPacket on the contract was successfully submitted but there was an error further down the packet lifecycle.
- What helped was to verify the contracts and use Tenderly for step-by-step debugging to see what the relayers submitted to the dispatcher etc.
- Interact with ethers and wagmi libs to interact with wallet and smart contract

## What we learned

How to make the first dApp using Polymer.

## Future Improvements

The NBA Multichain Betting Platform is committed to ongoing development and improvement to ensure it remains at the forefront of decentralized sports betting. Here are some of the planned enhancements and iterations for the future:

- **Smart Contract Upgrades**: We plan to continually review and upgrade the smart contracts to enhance security, efficiency, and add new features based on community feedback and emerging industry standards.

- **User Interface Enhancements**: Based on user feedback, we will implement UI/UX improvements to make the platform even more user-friendly and accessible to both new and experienced users.

- **Increased Market Variety**: To cater to a broader audience, we will introduce betting options for a wider range of sports and esports events, beyond just NBA matches.

- **Mobile Application**: Developing a mobile app version of the platform to provide users with the convenience of placing bets and managing their accounts from anywhere, at any time.

These improvements are aimed at enhancing the overall user experience, expanding the platform's reach, and ensuring its long-term sustainability and success in the competitive world of decentralized betting.

## Licence

[Apache 2.0](LICENSE)
