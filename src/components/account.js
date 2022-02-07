import React, { useState, useEffect, useRef, useReduce } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers, utils } from "ethers";
import {
  contractAddress,
  contractABI,
  customerCreditHanlder,
} from "../store/reducers";

import { checkCredit } from "../store/actions";
import abi from "../contracts/TicTacToeFund.json";
import LoadingIndicator from "../utils/loading";

export default function AccountInformation() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const customerTotalCredit = useSelector((state) => state.credit);
  const dispatch = useDispatch();

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetch_data() {
      checkIfWalletIsConnected();
      setLoading(true);
      let credit = await customerCreditHanlder();
      setLoading(false);
      console.log("credits are ", credit.toNumber());
      dispatch(checkCredit(credit.toNumber())); //🍎
    }
    fetch_data();
  }, [isWalletConnected]);

  return (
    <div className="account-panel container-xl mt-5 mb-3">
      {loading && <LoadingIndicator />}
      <div className="d-flex flex-row justify-content-center">
        <div className="me-3 font-bold">account address:</div>
        {isWalletConnected && <div>{customerAddress}</div>}
        <button className="btn-connect" onClick={checkIfWalletIsConnected}>
          {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
        </button>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <div className="me-3 font-bold">game credit:</div>
        <div>{customerTotalCredit}💰</div>
      </div>
    </div>
  );
}
