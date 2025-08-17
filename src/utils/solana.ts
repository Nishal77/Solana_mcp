import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Use devnet since you used the Solana faucet (which works on devnet)
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export const getBalance = async (publicKey: string): Promise<number> => {
  try {
    const pubKey = new PublicKey(publicKey);
    const balance = await connection.getBalance(pubKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
};

export interface Transaction {
  signature: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: number;
  type: 'received' | 'sent';
}

export const getTransactionHistory = async (publicKey: string): Promise<Transaction[]> => {
  try {
    const pubKey = new PublicKey(publicKey);
    console.log('Fetching transactions for:', publicKey);
    
    const signatures = await connection.getSignaturesForAddress(pubKey, { 
      limit: 50
    });
    
    console.log('Found signatures:', signatures.length);
    
    const transactions: Transaction[] = [];
    
    for (const sig of signatures) {
      try {
        const tx = await connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
          commitment: 'confirmed'
        });
        
        if (tx && tx.meta && tx.transaction) {
          const instructions = tx.transaction.message.instructions;
          
          // Check all instructions for transfers
          for (const instruction of instructions) {
            if ('parsed' in instruction && instruction.program === 'system') {
              const parsed = instruction.parsed;
              if (parsed.type === 'transfer') {
                const info = parsed.info;
                const amount = info.lamports / LAMPORTS_PER_SOL;
                const sender = info.source;
                const receiver = info.destination;
                const isReceived = receiver === publicKey;
                
                transactions.push({
                  signature: sig.signature,
                  sender,
                  receiver,
                  amount,
                  timestamp: (sig.blockTime || Date.now() / 1000) * 1000,
                  type: isReceived ? 'received' : 'sent'
                });
              }
            }
          }
          
          // Also check for SOL balance changes (for faucet transactions)
          if (tx.meta.preBalances && tx.meta.postBalances) {
            const accountIndex = tx.transaction.message.accountKeys.findIndex(
              (key) => key.pubkey.toString() === publicKey
            );
            
            if (accountIndex !== -1) {
              const preBalance = tx.meta.preBalances[accountIndex];
              const postBalance = tx.meta.postBalances[accountIndex];
              const balanceChange = (postBalance - preBalance) / LAMPORTS_PER_SOL;
              
              // If there's a significant balance change but no system transfer instruction
              if (Math.abs(balanceChange) > 0.001 && transactions.length === 0) {
                transactions.push({
                  signature: sig.signature,
                  sender: balanceChange > 0 ? 'Solana Faucet' : publicKey,
                  receiver: balanceChange > 0 ? publicKey : 'Unknown',
                  amount: Math.abs(balanceChange),
                  timestamp: (sig.blockTime || Date.now() / 1000) * 1000,
                  type: balanceChange > 0 ? 'received' : 'sent'
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error parsing transaction:', sig.signature, error);
      }
    }
    
    // Remove duplicates based on signature
    const uniqueTransactions = transactions.filter((tx, index, self) => 
      index === self.findIndex(t => t.signature === tx.signature)
    );
    
    console.log('Processed transactions:', uniqueTransactions.length);
    return uniqueTransactions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
};