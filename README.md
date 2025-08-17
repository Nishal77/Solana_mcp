# Solana Wallet Dashboard

A React + Vite application with Tailwind CSS for connecting to Phantom Wallet and displaying Solana wallet balance and transaction history.

## Features

- 🔗 **Phantom Wallet Integration**: Connect your Solana wallet with a single click
- 💰 **Real-time Balance Display**: View your current SOL balance with automatic updates
- 📊 **Transaction History**: Browse your recent transactions with detailed information
- 🎨 **Clean UI**: Minimal and responsive design using Tailwind CSS
- ⚡ **Real-time Updates**: Balance and transactions update automatically

## Prerequisites

- Node.js (v16 or higher)
- Phantom Wallet browser extension
- npm or yarn

## Installation

1. Clone the repository or navigate to the project directory:
```bash
cd solana-wallet-dashboard
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. Make sure you have the Phantom Wallet extension installed and set up

4. Click "Connect Wallet" to connect your Phantom wallet

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── WalletConnect.tsx    # Wallet connection component
│   ├── Dashboard.tsx        # Main dashboard with balance
│   └── TransactionHistory.tsx # Transaction history table
├── utils/
│   └── solana.ts           # Solana Web3.js utilities
├── App.tsx                 # Main application component
└── main.tsx               # Application entry point
```

## Features Explained

### Wallet Connection
- Detects if Phantom Wallet is installed
- Handles wallet connection/disconnection
- Displays connected wallet address

### Balance Display
- Shows current SOL balance
- Updates every 30 seconds automatically
- Loading states and error handling

### Transaction History
- Displays recent transactions (up to 50)
- Shows transaction type (sent/received)
- Includes sender, receiver, amount, and timestamp
- Links to Solscan for transaction details
- Updates every 60 seconds

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Solana Web3.js** for blockchain interaction
- **Phantom Wallet Adapter** for wallet integration

## Notes

- The application uses Solana Mainnet-Beta for real transaction data
- Make sure you have some SOL in your wallet to see transaction history
- The application is read-only and does not perform any transactions
