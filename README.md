# Decentralized Escrow DApp

A secure, trustless escrow application built on Ethereum, enabling safe transactions between buyers and sellers without third-party intermediaries.

## 📌 Overview

This project implements a decentralized escrow service where funds are held in a smart contract until the buyer confirms the receipt of goods. This ensures:
- **Buyers** are protected if goods are not delivered.
- **Sellers** can verify that funds are deposited before shipping.
- **Trustless Execution**: The contract logic creates a fair environment for both parties.

## 🚀 Features

*   **Smart Contract Security**: Funds are locked on-chain and only released when specific conditions are met.
*   **State Machine Logic**: Enforces a strict flow: `Payment Pending` → `Payment Done` → `Product Sent` → `Transaction Complete`.
*   **Role-Based Actions**:
    *   **Buyer**: Deposit funds, Confirm receipt, Refund (if applicable).
    *   **Seller**: Confirm shipment, Withdraw funds.
*   **Modern Frontend**: Built with Next.js and Tailwind CSS (or custom CSS) for a smooth user experience.
*   **Wallet Connection**: Integrated with RainbowKit and Wagmi for seamless MetaMask support.

## 🛠 Tech Stack

### Blockchain
*   **Solidity** (^0.8.20): Smart contract logic.
*   **Ethereum**: Deployed on Ethereum testnets (e.g., Sepolia) or local networks.

### Frontend
*   **Next.js 14**: React framework for the interface.
*   **TypeScript**: Type-safe development.
*   **Wagmi & Viem**: Ethereum hooks and interactions.
*   **RainbowKit**: Wallet connection UI.
*   **Framer Motion**: Animations for a premium feel.

## 📂 Project Structure

```bash
├── Escrow.sol          # The core Smart Contract
├── frontend/           # The Next.js web application
│   ├── pages/          # Application routes
│   ├── components/     # Reusable UI components
│   ├── styles/         # Global and module styles
│   └── ...
└── README.md           # Project documentation
```

## 🏁 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [MetaMask](https://metamask.io/) or any Web3 wallet

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/escrow-dapp.git
    cd escrow-dapp
    ```

2.  **Install Frontend Dependencies:**
    Navigate to the frontend directory and install packages.
    ```bash
    cd frontend
    npm install
    # or
    yarn install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

4.  **Smart Contract Deployment:**
    *   You can deploy `Escrow.sol` using [Remix IDE](https://remix.ethereum.org/) or Hardhat or directly deploy using the website.
    *   After deployment, update the contract address in the frontend configuration (usually in `constants/` or a config file).

## 📜 How It Works

1.  **Initialize**: The contract is deployed with the Buyer and Seller addresses defined.
2.  **Deposit**: The Buyer calls `payndconfirm` to deposit the agreed amount.
3.  **Ship**: The Seller sees the deposit and ships the item, calling `productsent`.
4.  **Confirm**: The Buyer receives the item and calls `productreceived`.
5.  **Withdraw**: The Seller can now release the funds to their wallet using `getpayment`.

## 📄 License

This project is licensed under the MIT License.
