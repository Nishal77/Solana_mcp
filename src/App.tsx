import { useState } from 'react'
import WalletConnect from './components/WalletConnect'
import Dashboard from './components/Dashboard'
import TransactionHistory from './components/TransactionHistory'

function App() {
  const [walletAddress, setWalletAddress] = useState<string>('')

  const handleWalletConnected = (publicKey: string) => {
    setWalletAddress(publicKey)
  }

  const handleWalletDisconnected = () => {
    setWalletAddress('')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Solana Wallet Dashboard</h1>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Devnet</span>
            </div>
            <WalletConnect 
              onWalletConnected={handleWalletConnected}
              onWalletDisconnected={handleWalletDisconnected}
            />
          </div>
        </div>
      </nav>

      <main className="py-8">
        <Dashboard walletAddress={walletAddress} />
        {walletAddress && (
          <div className="max-w-4xl mx-auto p-6">
            <TransactionHistory walletAddress={walletAddress} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
