import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '../ThemeContext';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './Counter';

function DataDisplay() {
  const { isDark } = useTheme();
  const [transfers, setTransfers] = useState([]);
  const [numberChanges, setNumberChanges] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  const fetchWalletBalance = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const balance = await contract.balanceOf(accounts[0]);
          setWalletBalance(formatValue(balance.toString()));
        } else {
          setWalletBalance(null);
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        setWalletBalance(null);
      }
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch("API_URL_HERE", {
        headers: {
          "X-GHOST-KEY": "API KEY HERE",
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          query: `
            query data {
              transfers(orderBy: "timestamp", orderDirection: "desc") {
                items {
                  from
                  to
                  timestamp
                  blockNumber
                  txHash
                  value
                }
              }
              numberChangeds(orderBy: "timestamp", orderDirection: "desc") {
                items {
                  id
                  newNumber
                  timestamp
                }
              }
              globalMetrics {
                items {
                  totalCalls
                  totalSupply
                }
              }
            }
          `
        })
      });

      const data = await response.json();
      
      // Sort transfers by timestamp (newest first)
      const sortedTransfers = [...data.data.transfers.items].sort((a, b) => 
        parseInt(b.timestamp) - parseInt(a.timestamp)
      );
      
      // Sort number changes by timestamp (oldest first for the chart)
      const sortedNumberChanges = [...data.data.numberChangeds.items].sort((a, b) => 
        parseInt(a.timestamp) - parseInt(b.timestamp)
      );

      setTransfers(sortedTransfers);
      setNumberChanges(sortedNumberChanges);
      setMetrics(data.data.globalMetrics.items[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchWalletBalance();
    const interval = setInterval(fetchData, 30000);

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', fetchWalletBalance);
    }

    return () => {
      clearInterval(interval);
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', fetchWalletBalance);
      }
    };
  }, []);

  return (
    <div>
      {/* Metrics Display */}
      {metrics && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '20px',
          background: isDark ? '#1a1a1a' : '#f5f5f5',
          color: isDark ? '#fff' : '#333',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: isDark ? '0 2px 4px rgba(255,255,255,0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          textAlign: 'left', 
          fontSize: '14px' 
        }}>
            <div><strong>Your Balance:</strong> {walletBalance ? `${walletBalance} MID` : 'Connect Wallet'}</div>
          <div style={{ marginBottom: '4px' }}><strong>Total Supply:</strong> {formatValue(metrics.totalSupply)}</div>
          <div style={{ marginBottom: '4px' }}><strong>Total Calls:</strong> {metrics.totalCalls}</div>

        </div>
      )}

      {/* Chart and Table Container */}
      <div style={{ padding: '20px', marginTop: '100px' }}>
        {/* Line Chart */}
        <div style={{ height: '400px', marginBottom: '40px' }}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: isDark ? '#fff' : '#333',
            transition: 'color 0.3s ease'
          }}>
            Counter Value Over Time
          </h2>
          <ResponsiveContainer width="100%" height="100%">

<LineChart
  data={numberChanges.map(item => ({
    ...item,
    timestamp: new Date(parseInt(item.timestamp) * 1000)
  }))}
  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}  // Increased bottom margin
  style={{
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
    borderRadius: '8px'
  }}
>
  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ccc'} />
  <XAxis 
    dataKey="timestamp" 
    tickFormatter={(timestamp) => format(timestamp, 'MM/dd HH:mm')}
    stroke={isDark ? '#fff' : '#333'}
    angle={-45}  // Angle the labels
    textAnchor="end"  // Align the rotated text
    height={60}  // Increase height to accommodate angled labels
    interval="preserveStartEnd"  // Show first and last labels
    tickCount={5}  // Limit the number of ticks shown
    style={{
      fontSize: '12px',  // Smaller font size
    }}
  />
  <YAxis 
    stroke={isDark ? '#fff' : '#333'}
    style={{
      fontSize: '12px',
    }}
    domain={['auto', 'auto']} 
    allowDataOverflow={false} 
  />
  <Tooltip 
    labelFormatter={(timestamp) => format(timestamp, 'MM/dd/yyyy HH:mm:ss')}
    contentStyle={{
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      color: isDark ? '#fff' : '#333',
      border: `1px solid ${isDark ? '#444' : '#ddd'}`
    }}
  />
  <Line 
    type="monotone" 
    dataKey="newNumber" 
    stroke="#8884d8"
    dot={false}  // Remove dots for cleaner look
    strokeWidth={2}  // Slightly thicker line
  />
</LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transfers Table */}
        <div style={{ marginTop: '100px' }}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: isDark ? '#fff' : '#333',
            transition: 'color 0.3s ease'
          }}>
            Token Transfers
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: isDark ? '#1a1a1a' : '#fff',
              color: isDark ? '#fff' : '#333',
              transition: 'all 0.3s ease'
            }}>
              <thead>
                <tr style={{ backgroundColor: isDark ? '#333' : '#f5f5f5' }}>
                  <th style={{...tableHeaderStyle, color: isDark ? '#fff' : '#333'}}>From</th>
                  <th style={{...tableHeaderStyle, color: isDark ? '#fff' : '#333'}}>To</th>
                  <th style={{...tableHeaderStyle, color: isDark ? '#fff' : '#333'}}>Value</th>
                  <th style={{...tableHeaderStyle, color: isDark ? '#fff' : '#333'}}>Time</th>
                  <th style={{...tableHeaderStyle, color: isDark ? '#fff' : '#333'}}>Block</th>
                  <th style={{...tableHeaderStyle, color: isDark ? '#fff' : '#333'}}>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer, index) => (
                  <tr key={index} style={{ 
                    borderBottom: `1px solid ${isDark ? '#444' : '#eee'}`
                  }}>
                    <td style={{...tableCellStyle, color: isDark ? '#fff' : '#333'}}>{shortenAddress(transfer.from)}</td>
                    <td style={{...tableCellStyle, color: isDark ? '#fff' : '#333'}}>{shortenAddress(transfer.to)}</td>
                    <td style={{...tableCellStyle, color: isDark ? '#fff' : '#333'}}>{formatValue(transfer.value)}</td>
                    <td style={{...tableCellStyle, color: isDark ? '#fff' : '#333'}}>
                      {format(new Date(parseInt(transfer.timestamp) * 1000), 'MM/dd HH:mm')}
                    </td>
                    <td style={{...tableCellStyle, color: isDark ? '#fff' : '#333'}}>{transfer.blockNumber}</td>
                    <td style={{...tableCellStyle}}>
                      <a 
                        href={`https://sepolia.uniscan.xyz/tx/${transfer.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          color: isDark ? '#8884d8' : '#2196F3',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {shortenAddress(transfer.txHash)}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
const shortenAddress = (address) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const formatValue = (value) => {
  return (parseInt(value) / 1e18).toFixed(2);
};

const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  transition: 'all 0.3s ease'
};

const tableCellStyle = {
  padding: '12px',
  textAlign: 'left',
  transition: 'all 0.3s ease'
};

export default DataDisplay;