import { useState, useEffect } from 'react';
import { getTransactionHistory, type Transaction } from '../utils/solana';

interface TransactionHistoryProps {
  walletAddress: string;
}

export default function TransactionHistory({ walletAddress }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (walletAddress) {
        setIsLoading(true);
        console.log('Fetching transactions for wallet:', walletAddress);
        const txHistory = await getTransactionHistory(walletAddress);
        console.log('Retrieved transactions:', txHistory);
        setTransactions(txHistory);
        setIsLoading(false);
      }
    };

    fetchTransactions();
    
    const interval = setInterval(fetchTransactions, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [walletAddress]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!walletAddress) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        )}
      </div>
      
      {transactions.length === 0 && !isLoading ? (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions found</p>
          <p className="text-sm mt-2">Make sure you're connected to the correct network (devnet)</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Transaction ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">From/To</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Time & Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr 
                  key={tx.signature} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4">
                    <a
                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono text-sm underline"
                    >
                      {formatAddress(tx.signature)}
                    </a>
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    <span className={tx.type === 'received' ? 'text-green-600' : 'text-red-600'}>
                      {tx.type === 'received' ? '+' : '-'}{tx.amount.toFixed(4)} SOL
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">
                    {tx.type === 'received' ? formatAddress(tx.sender) : formatAddress(tx.receiver)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(tx.timestamp)}
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.type === 'received' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.type === 'received' ? 'Received' : 'Sent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}