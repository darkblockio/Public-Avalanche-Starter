import { useEffect, useState } from "react"
import { Web3Context } from "./Web3Context"
import Web3 from 'web3'

export const Web3Provider = ({ children }) => {

  const [wallet, setWallet] = useState()
  const [address, setAddress] = useState()

  useEffect(() => {
    if (!window.ethereum) {
      return
    }

    const web3 = new Web3(window.web3.currentProvider)

    const accountWasChanged = (accounts) => {
      setWallet(null)
      setTimeout(() => {
        if (accounts[0]) {
          setWallet(web3)
          setAddress(accounts[0])
        } else {
          setAddress('')
        }
      }, 0)
    }

    const getAndSetAccount = async () => {
      const changedAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setWallet(null)
      setTimeout(() => {
        if (changedAccounts[0]) {
          setWallet(web3)
          setAddress(changedAccounts[0])
        } else {
          setAddress('')

        }
      }, 0)
    }

    const clearAccount = () => {
      setWallet(null)
      setAddress('')
    }

    window.ethereum.on('accountsChanged', accountWasChanged)
    window.ethereum.on('connect', getAndSetAccount)
    window.ethereum.on('disconnect', clearAccount)

    async function getAddress() {
      if (window.ethereum) {
        const accounts = await web3.eth.getAccounts()
        if (accounts && accounts[0]) {
          setAddress(accounts[0])
        }
      }
    }

    async function getAccount() {
      if (window.ethereum) {
        const accounts = await web3.eth.getAccounts()
        if (accounts && accounts[0]) {
          setWallet(web3)
        }
      }
    }

    getAddress()
    getAccount()
  }, [])


  const connect = async () => {
    const web3 = new Web3(window.web3.currentProvider)

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      try {
        // Request account access if needed
        await window.ethereum.enable()
      } catch (error) {
        // User denied account access...
        console.error('User denied account access')
      }
    }

    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider)
    }

    // Non-dapp browsers...
    else {
      console.log('Non-Avalanche browser detected. You should consider trying MetaMask!')
    }

    const accounts = await web3.eth.getAccounts()
    if (accounts && accounts[0]) {
      setAddress(accounts[0])
    }
  }

  return (
    <Web3Context.Provider value={{ wallet, address, setAddress, connect}}>
      { children }
    </Web3Context.Provider>
  )
}
