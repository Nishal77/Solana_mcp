import { useState, useEffect } from 'react';
import { getBalance } from '../utils/solana';

interface DashboardProps {
  walletAddress: string;
}

export default function Dashboard({ walletAddress }: DashboardProps) {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletAddress) {
        setIsLoading(true);
        const walletBalance = await getBalance(walletAddress);
        setBalance(walletBalance);
        setIsLoading(false);
      }
    };

    fetchBalance();
    
    const interval = setInterval(fetchBalance, 30000);
    
    return () => clearInterval(interval);
  }, [walletAddress]);

  if (!walletAddress) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Solana Wallet Dashboard</h2>
          <p className="text-gray-600">Connect your Phantom wallet to view your balance and transaction history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Wallet Dashboard</h1>
        <p className="text-gray-600">
          Address: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Balance</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {balance.toFixed(4)} SOL
            </div>
            <div className="text-gray-500 text-sm">
              ≈ ${(balance * 200).toFixed(2)} USD
            </div>
            <div className="text-gray-500 text-sm mt-2">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}