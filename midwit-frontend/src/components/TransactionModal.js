import React from 'react';

function TransactionModal({ isOpen, onClose, txHash }) {
  if (!isOpen) return null;

  const txUrl = `https://sepolia.uniscan.xyz/tx/${txHash}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#282c35',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h3 style={{ marginTop: 0 }}>Transaction Submitted!</h3>
        <p>View your transaction on Uniscan:</p>
        <a 
          href={txUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#2196F3',
            wordBreak: 'break-all'
          }}
        >
          {txUrl}
        </a>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;