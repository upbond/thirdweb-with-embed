import React, { useState, useEffect } from "react";
import { useUpbondEmbedContext } from "../lib/upbondEmbed";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import Web3 from "web3";

const { REACT_APP_TOKEN_ADDRESS } = process.env;

const Embed = () => {
  const { login, account, upbondProviders } = useUpbondEmbedContext();
  const [contract, setContract] = useState();
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [symbol, setSymbol] = useState("");
  const web3 = new Web3();

  useEffect(() => {
    if (upbondProviders) {
      init();
    }
  }, [upbondProviders]);

  const init = async () => {
    try {
      if (upbondProviders) {
        const provider = new ethers.providers.Web3Provider(
          upbondProviders.provider
        );
        const signer = provider.getSigner();
        const sdk = new ThirdwebSDK(signer);
        const thirdWebContractRes = await sdk.getContract(
          // '0xb7a72Ff4Ffe80CEBc0Aa97d392A9a51ADd33c0eC',
          REACT_APP_TOKEN_ADDRESS,
          "token"
        );
        setContract(thirdWebContractRes);
      }
    } catch (error) {
      console.log(error, "@29");
    }
  };

  const transfer = async () => {
    try {
      const res = await contract.erc20.transfer(address, quantity);
      alert('txHash:' + res.receipt.transactionHash);
    } catch (error) {
      console.log(error, "@39");
    }
  };

  const getBalance = async () => {
    try {
      const res = await contract.erc20.balance();
      setSymbol(res.symbol);
      setBalance(
        web3.utils.fromWei(web3.utils.hexToNumberString(res.value._hex))
      );
    } catch (error) {
      console.log(error, "@48");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {account ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "90px" }}>
          <div>
            <label htmlFor="address">User Address</label>
            <br />
            <span>{account}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="address">Address</label>
            <input
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              id="address"
              placeholder="addressTo"
            />
            <br />
            <label htmlFor="quantity">Quantity</label>
            <input
              onChange={(e) => setQuantity(e.target.value)}
              type="text"
              id="quantity"
              placeholder="quantity"
            />
            <br />
            <button
              onClick={() => {
                transfer();
              }}
            >
              Transfer
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="balance">Balance</label>
            <button
              onClick={() => {
                getBalance();
              }}
            >
              balance
            </button>
            {balance && (
              <span style={{ fontSize: "24px" }}>
                {balance} {symbol}
              </span>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            login();
          }}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Embed;
