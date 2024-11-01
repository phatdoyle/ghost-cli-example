import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './Counter';
import TransactionModal from './TransactionModal';

function WalletConnect() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState(null);
  const [contract, setContract] = useState(null);
  const [counter, setCounter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const UNICHAIN_CHAIN_ID = 1301;

// Update the getInitialNumber function:
useEffect(() => {
    const getInitialNumber = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://sepolia.unichain.org');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        // Call the automatically generated getter function for the public number variable
        const value = await contract.number();
        console.log('Initial value:', value.toString());
        setCounter(value.toString());
      } catch (error) {
        console.error('Detailed error:', error);
        // Log the available functions
        const provider = new ethers.providers.JsonRpcProvider('https://sepolia.unichain.org');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        console.log('Available functions:', Object.keys(contract.functions));
      }
    };
  
    getInitialNumber();
  }, []);

  const getNetworkName = (chainId) => {
    const networks = {
      1301: 'Unichain Sepolia',
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  const initializeContract = (provider) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    setContract(contract);
    return contract;
  };

  const increment = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.increment();
      setTxHash(tx.hash);
      setIsModalOpen(true);
      await tx.wait();
      const newValue = await contract.number();
      console.log('New value after increment:', newValue.toString());
      setCounter(newValue.toString());
    } catch (error) {
      console.error('Error incrementing:', error);
    }
    setLoading(false);
  };

  const decrement = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.decrement();
      setTxHash(tx.hash);
      setIsModalOpen(true);
      await tx.wait();
      const newValue = await contract.number();
      console.log('New value after decrement:', newValue.toString());
      setCounter(newValue.toString());
    } catch (error) {
      console.error('Error decrementing:', error);
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTxHash(null);
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const network = await provider.getNetwork();
        setNetwork(network);

        const contract = initializeContract(provider);

      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const switchToUnichain = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${UNICHAIN_CHAIN_ID.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${UNICHAIN_CHAIN_ID.toString(16)}`,
              chainName: 'Unichain Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.unichain.org'],
              blockExplorerUrls: ['https://sepolia.uniscan.xyz/']
            }],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
      console.error('Error switching network:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setNetwork(null);
    setContract(null);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        {counter !== null && (
          <div style={{ marginBottom: '20px', fontSize: '24px' }}>
            <strong>Counter: </strong> 
            {counter}
          </div>
        )}

        {!account ? (
          <button 
            onClick={connectWallet}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Account: </strong> 
              {`${account.substring(0, 6)}...${account.substring(38)}`}
            </div>
            
            {network && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Network: </strong> 
                {getNetworkName(Number(network.chainId))}
              </div>
            )}

            {network && Number(network.chainId) === UNICHAIN_CHAIN_ID && (
              <div style={{ marginTop: '20px' }}>
                <button 
                  onClick={increment}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    marginRight: '10px'
                  }}
                >
                  Increment
                </button>
                <button 
                  onClick={decrement}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Decrement
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              {network && Number(network.chainId) !== UNICHAIN_CHAIN_ID && (
                <button 
                  onClick={switchToUnichain}
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    backgroundColor: '#FF6B6B',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Switch to Unichain Sepolia
                </button>
              )}

              <button 
                onClick={disconnectWallet}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        txHash={txHash}
      />
    </>
  );
}

export default WalletConnect;