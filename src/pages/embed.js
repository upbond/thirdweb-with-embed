import React, { useState, useEffect } from "react";
import { useUpbondEmbedContext } from "../lib/upbondEmbed";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import Web3 from "web3";
import { erc20ABI } from "wagmi";

const { REACT_APP_TOKEN_ADDRESS, REACT_APP_MARKETPLACE_ADDRESS } = process.env;

const Embed = () => {
  const { login, account, upbondProviders } = useUpbondEmbedContext();
  const [contract, setContract] = useState();
  const [mContract, setMContract] = useState();
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminWallet, setAdminWallet] = useState("");
  const [listing, setListing] = useState();
  const [arrQty, setArrQty] = useState({});
  const web3 = new Web3();
  const _privateKey =
    "13471aaca797e9c1c85dd777a0d5bf63c42b8e37aa419069beeff34bdc64bdad";

  useEffect(() => {
    if (upbondProviders) {
      init();
    }
  }, [upbondProviders]);

  const init = async () => {
    try {
      setLoading(true);
      if (upbondProviders) {
        const provider = new ethers.providers.Web3Provider(
          upbondProviders.provider
        );
        let wallet = new ethers.Wallet(_privateKey, provider);
        setAdminWallet(wallet);
        const getSigner = provider.getSigner();
        const sdk = new ThirdwebSDK(getSigner);
        const thirdWebContractRes = await sdk.getContract(
          // '0xb7a72Ff4Ffe80CEBc0Aa97d392A9a51ADd33c0eC',
          REACT_APP_TOKEN_ADDRESS,
          "token"
        );
        setContract(thirdWebContractRes);
        setLoading(false);

        const marketplaceContractRes = await sdk.getContract(
          REACT_APP_MARKETPLACE_ADDRESS,
          "marketplace"
        );

        setMContract(marketplaceContractRes);
        await getNftListings(marketplaceContractRes);
      }
    } catch (error) {
      console.log(error, "@29");
    }
  };

  const getNftListings = async (contract = mContract) => {
    const list = await contract.getAll();
    setListing(list);
  };

  const transfer = async () => {
    try {
      const res = await contract.erc20.transfer(address, quantity);
      alert("txHash:" + res.receipt.transactionHash);
      await getBalance();
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

  const getFaucet = async () => {
    try {
      const contractAddress = REACT_APP_TOKEN_ADDRESS;
      const contract = new ethers.Contract(
        contractAddress,
        erc20ABI,
        adminWallet
      );
      const numberOfDecimals = 18;
      const numberOfTokens = ethers.utils.parseUnits("1.0", numberOfDecimals);
      const contractWithSigner = contract.connect(adminWallet);

      // Send tokens
      const res = await contractWithSigner.transfer(account, numberOfTokens);

      alert("Success!!!");
      await getBalance();
    } catch (error) {
      console.log(error, "@137");
    }
  };

  const buyNft = async (id) => {
    try {
      const res = await mContract.buyoutListing(id, arrQty[id]);
      await getNftListings();
      alert("success buy this nft", res.receipt.transactionHash);
    } catch (error) {
      console.log(error, "@117");
      alert("Error");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {account && !loading ? (
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="balance">Faucet</label>
            <button
              onClick={() => {
                getFaucet();
              }}
            >
              Get Token
            </button>
          </div>
          <div
            style={{
              padding: "3rem",
              // width: "100%",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              backgroundColor: "white",
              borderRadius: "30px",
            }}
          >
            {listing &&
              listing.map((item) => {
                return (
                  <div
                    style={{
                      width: "25%",
                      margin: "1rem",
                      display: "flex",
                      padding: "1rem",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={item.asset.image}
                      style={{ width: "100%", height: "300px" }}
                      alt=""
                      srcset=""
                    />
                    <span style={{ color: "black", textAlign: "center" }}>
                      {item.asset.name}
                    </span>
                    <br />
                    <span style={{ color: "black", textAlign: "center" }}>
                      {item.buyoutCurrencyValuePerToken.displayValue}{" "}
                      {item.buyoutCurrencyValuePerToken.name}
                    </span>
                    <br />
                    <span style={{ color: "black", textAlign: "center" }}>
                      Quantity: {item.quantity.toString()}
                    </span>
                    <input
                      type="number"
                      name={item.asset.name}
                      id={item.id}
                      min="0"
                      max={item.quantity.toString()}
                      defaultValue="0"
                      onChange={(e) => {
                        if (arrQty[item.id] !== undefined) {
                          const newArr = arrQty;
                          newArr[item.id] = e.target.value;
                          setArrQty(newArr);
                          return;
                        }
                        setArrQty({ ...arrQty, [item.id]: e.target.value });
                      }}
                    />
                    <br />
                    <button
                      onClick={() => {
                        if (arrQty[item.id] > 0) buyNft(item.id);
                      }}
                      style={{
                        backgroundColor: Number(item.quantity.toString())
                          ? "blue"
                          : "gray",
                        textAlign: "center",
                        color: "white",
                        borderRadius: "10px",
                        border: "none",
                        padding: "1rem",
                        cursor: "pointer",
                      }}
                      disabled={!Number(item.quantity.toString())}
                    >
                      {Number(item.quantity.toString()) ? "Buy" : "Sold Out"}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            login();
          }}
          style={{ display: loading ? "none" : "block" }}
        >
          Login
        </button>
      )}
      <br />
      {loading ? <span>Loading...</span> : <></>}
    </div>
  );
};

export default Embed;
