# Decentralized Escrow DApp

A secure, trustless escrow application built with Vanilla JavaScript and Ethereum, allowing users to safely transact without third-party intermediaries.

## 📌 Overview

This application serves as a frontend interface for deploying and interacting with Escrow smart contracts. It features a modern **Glassmorphism** UI and real-time state updates.

**Key Functionalities:**
- **Deploy** unique Escrow contracts for each transaction.
- **Secure** funds in a smart contract until the buyer confirms receipt.
- **Trustless** workflow ensuring fairness for both Buyers and Sellers.

## 🚀 Features

### Interactive UI
- **Dynamic Role Detection**: Automatically detects if the connected wallet is the **Buyer**, **Seller**, or an **Observer**.
- **Real-Time Updates**: live feedback on contract state ("Awaiting Payment", "Awaiting Delivery", "Complete").
- **Visual Feedback**: Loading spinners and status messages for all transactions.

### Core Functions
- **Deploy Contract**: Create a new escrow agreement by specifying a Buyer and a Payee (Seller).
- **Load Contract**: Interact with any existing escrow contract by address.
- **Buyer Actions**:
    - `Pay & Confirm`: Deposit ETH into the contract.
    - `Confirm Receipt`: Release funds to the seller after receiving the item.
- **Seller Actions**:
    - `Product Sent`: Notify the buyer that the item has been shipped.
    - `Withdraw`: Claim the funds once the buyer confirms receipt.
- **General/Admin**:
    - `Refund`: Cancel the transaction and refund the buyer (if applicable).

## 🛠 Tech Stack

*   **Frontend**: HTML5, CSS3 (Vanilla + Glassmorphism), JavaScript (ES6+)
*   **Blockchain Integration**: [Ethers.js v6](https://docs.ethers.org/v6/)
*   **Smart Contract**: Solidity (Ethereum)

## 📂 Project Structure

```bash
├── index.html          # Main application interface
├── app.js              # Application logic & Ethers.js integration
├── style.css           # Styling (Glassmorphism theme)
└── Escrow.sol          # Smart Contract Source (if available in project root)
```

## 🏁 Getting Started

### Prerequisites
*   **MetaMask** (or any Web3 browser extension) installed.
*   A modern web browser (Chrome, Firefox, Brave).

### Installation & Running

Since this is a static site, you don't need a complex build process.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Run the App:**
    *   **Option A (Recommended):** Use a local server like "Live Server" in VS Code to avoid CORS issues with modules or assets.
    *   **Option B:** Simply double-click `index.html` to open it in your browser (might have limitations depending on browser security settings).

3.  **Connect Wallet:**
    *   Click the **⚡ Connect Wallet** button in the top right.
    *   Ensure you are on the correct network (e.g., Sepolia Testnet or Localhost) where your contracts are deployed.

## 📜 How to Use

1.  **Deploy a Contract**:
    *   Enter the **Buyer's Address** and **Seller's (Payee) Address**.
    *   Click **🚀 Deploy Contract**.
    *   Once deployed, the app will automatically load the new contract.

2.  **Interact**:
    *   **As Buyer**: Enter the ETH amount and click **Pay & Confirm**. Once you receive the item, click **Confirm Receipt**.
    *   **As Seller**: Click **Product Sent** when you ship the item. Once the buyer confirms, click **Withdraw** to get paid.
