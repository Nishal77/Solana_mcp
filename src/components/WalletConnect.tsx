import { useState, useEffect } from 'react';

interface PhantomProvider {
  isPhantom: boolean;
  connect: () => Promise<{ publicKey: any }>;
  disconnect: () => Promise<void>;
  publicKey: any;
  isConnected: boolean;
}

interface WalletConnectProps {
  onWalletConnected: (publicKey: string) => void;
  onWalletDisconnected: () => void;
}

export default function WalletConnect({ onWalletConnected, onWalletDisconnected }: WalletConnectProps) {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [walletKey, setWalletKey] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const getProvider = () => {
      if ('phantom' in window) {
        const provider = (window as any).phantom?.solana;
        if (provider?.isPhantom) {
          setProvider(provider);
          if (provider.isConnected && provider.publicKey) {
            const publicKey = provider.publicKey.toString();
            setWalletKey(publicKey);
            onWalletConnected(publicKey);
          }
        }
      }
    };

    getProvider();
  }, [onWalletConnected]);

  const connectWallet = async () => {
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      const response = await provider.connect();
      const publicKey = response.publicKey.toString();
      setWalletKey(publicKey);
      onWalletConnected(publicKey);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (provider) {
      try {
        await provider.disconnect();
        setWalletKey('');
        onWalletDisconnected();
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    }
  };

  if (!provider) {
    return (
      <button
        onClick={connectWallet}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Install Phantom Wallet
      </button>
    );
  }

  if (walletKey) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Connected: {walletKey.slice(0, 4)}...{walletKey.slice(-4)}
        </div>
        <button
          onClick={disconnectWallet}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}