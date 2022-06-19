import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import greeter from "./utils/Greeter.json";

import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constants
const TWITTER_HANDLE = "rashalabelle";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "https://testnets.opensea.io/assets/mumbai/";
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0xaD9C2686be8429f739D4dd8D20dB74c2DFf38c3F";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [messageLast, setMessageLast] = useState("");
  const [message, setMessage] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const sendMessage = async () => {
    if (!message) {
      return;
    }

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          greeter.abi,
          signer
        );

        let tx = await contract.setGreeting(message);
        await tx.wait();
        console.log("Record set https://mumbai.polygonscan.com/tx/" + tx.hash);

        setMessage("");
        getMessage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMessage = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          greeter.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.greet();

        setMessageLast(nftTxn);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Form to enter domain name and data
  const renderInputForm = () => {
    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={message}
            placeholder="message"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button className="cta-button mint-button" onClick={sendMessage}>
          set message
        </button>
      </div>
    );
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <>
      <button onClick={getMessage} className="cta-button connect-wallet-button">
        Get Message
      </button>
      <br />
      <br />
    </>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">read and write message</p>
          <p className="sub-text">Try to read and write to a contract.</p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
          <p style={{ color: "white" }}> the current messege: {messageLast}</p>
          {currentAccount && renderInputForm()}
        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
