import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers, utils } from "ethers";
import {
  contractAddress,
  contractABI,
  customerCreditHanlder,
} from "../store/reducers";
import { checkCredit } from "../store/actions";
import LoadingIndicator from "../utils/loading";

export default function Charge() {
  const [isOwner, setIsOwner] = useState(false);
  const [paid, setPaid] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isWithdrawed, setIsWithdrawed] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const credit = useSelector((state) => state.credit);
  const dispatch = useDispatch();

  const checkIfOwner = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let owner = await contract.Owner();
        console.log(owner);

        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (owner.toLowerCase() === account.toLowerCase()) {
          setIsOwner(true);
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFundBalance = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let balance = await contract.getFundBalance({});
        balance = utils.formatEther(balance);
        console.log("Total balance is ", balance);
        setTotalBalance(balance);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputPaidChange = (e) => {
    setPaid(e.target.value);
  };

  const deposityMoneyHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setLoading(true);
        const txn = await contract.depositMoney({
          value: ethers.utils.parseEther(paid),
        });
        console.log("Deposting money...");
        await txn.wait();
        setIsPaid(true);
        setLoading(false);
        console.log("Deposited money...done", txn.hash);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const withdrawHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setLoading(true);
        let myAddress = await signer.getAddress();
        console.log("provider signer...", myAddress);

        const txn = await contract.withDrawMoney(myAddress);
        console.log("Withdrawing money...");
        await txn.wait();
        setLoading(false);
        console.log("Money with drew...done", txn.hash);

        setIsWithdrawed(true);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetch_data() {
      await checkIfOwner();
      let credit = await customerCreditHanlder();
      if (isOwner) getFundBalance();
      dispatch(checkCredit(credit.toNumber()));
    }
    fetch_data();
    setIsPaid(false);
  }, [isPaid, isOwner]);

  return (
    <div>
      {loading && <LoadingIndicator />}
      <div>
        <input
          type="text"
          className="input-style"
          onChange={handleInputPaidChange}
          name="deposit"
          placeholder="0.0000 ETH"
          value={paid}
        />
        <button className="btn-deposit" onClick={deposityMoneyHandler}>
          Deposit
        </button>
      </div>
      {isOwner && (
        <div>
          <div>{totalBalance}</div>
          <button className="btn-withdraw" onClick={withdrawHandler}>
            Withdraw
          </button>
        </div>
      )}
    </div>
  );
}
