import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ethers, utils } from "ethers";
import checkCredit from "../store/reducers";
import AccountInformation from "../components/account";
import Charge from "../components/charge";

export default function FundPage() {
  const navigate = useNavigate();
  const gotoHome = () => {
    navigate("/");
  };

  return (
    <>
      <button onClick={gotoHome}>Go To Home</button>
      <AccountInformation></AccountInformation>
      <Charge></Charge>
    </>
  );
}
