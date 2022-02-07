import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Game from "../components/game";
import AccountInformation from "../components/account";

export default function HomePage() {
  const navigate = useNavigate();
  const gotoCharge = () => {
    navigate("/charge");
  };
  return (
    <>
      <button onClick={gotoCharge}>Go To Charge</button>
      <AccountInformation></AccountInformation>
      <Game></Game>
    </>
  );
}
