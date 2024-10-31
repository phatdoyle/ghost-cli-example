import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [wallet, setWallet] = useState(null)
  
  const connectWallet = async () => {
      if (!window.ethereum) {
        alert('Please install MetaMask!')
        return
      }
  
      try {
        // Check network first
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        if (chainId !== '0x515') { // 1301 in hex
          alert('Please connect to network ID 1301!')
          return
        }
  
        // Connect wallet
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        setWallet(accounts[0])
      } catch (error) {
        console.error(error)
        alert('Failed to connect wallet!')
      }
    }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
