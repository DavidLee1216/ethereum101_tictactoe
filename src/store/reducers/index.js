import { ethers } from "ethers";
import abi from "../../contracts/TicTacToeFund.json";

const CHECK_CREDIT = "CHECK_CREDIT";
const INITIAL_STATE = {
  credit: 0,
};
export const contractAddress = "0x1Fa563b48424a51349240029d31916316220bc9e";
export const contractABI = abi.abi;
export const customerCreditHanlder = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const centerContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      return await centerContract.getCustomerCredit();
    } else {
      console.log("Ethereum object not found, install Metamask.");
    }
  } catch (error) {
    console.log(error);
  }
};

export default function checkCredit(states = INITIAL_STATE, action) {
  switch (action.type) {
    case CHECK_CREDIT:
      return {
        credit: action.credit,
      };
    default:
      return states;
  }
}
