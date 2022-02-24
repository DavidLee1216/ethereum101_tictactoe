import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Square from "./square";
import Notifications, { notify } from "react-notify-toast";
import { ethers, utils } from "ethers";
import {
  contractAddress,
  contractABI,
  customerCreditHanlder,
} from "../store/reducers";
import { checkCredit } from "../store/actions";
import LoadingIndicator from "../utils/loading";

const matrix_elem_count = 7;
const game_match_setting = 5;
var matrix = [];
var items = [];
export default function Game() {
  const [gameState, setGameState] = useState({
    status: "X",
    new_game: true,
    status_text: "Next player: X",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const checkWinner = useCallback((row, col, val) => {
    let maxlen = 0;
    let i = row,
      j = col;
    while (i > 0 && matrix[i - 1][j] === val) {
      i--;
    }
    while (i < matrix_elem_count && matrix[i][j] === val) {
      i++;
      maxlen++;
    }
    if (maxlen >= game_match_setting) return true;
    i = row;
    j = col;
    while (j > 0 && matrix[i][j - 1] === val) j--;
    maxlen = 0;
    while (j < matrix_elem_count && matrix[i][j] === val) {
      j++;
      maxlen++;
    }
    if (maxlen >= game_match_setting) return true;
    i = row;
    j = col;
    while (i > 0 && j > 0 && matrix[i - 1][j - 1] === val) {
      i--;
      j--;
    }
    maxlen = 0;
    while (
      i < matrix_elem_count &&
      j < matrix_elem_count &&
      matrix[i][j] === val
    ) {
      i++;
      j++;
      maxlen++;
    }
    if (maxlen >= game_match_setting) return true;
    i = row;
    j = col;
    maxlen = 0;
    while (i > 0 && j < matrix_elem_count && matrix[i - 1][j + 1] === val) {
      i--;
      j++;
    }
    while (i < matrix_elem_count && j >= 0 && matrix[i][j] === val) {
      i++;
      j--;
      maxlen++;
    }
    if (maxlen >= game_match_setting) return true;
    let tie = 0;
    for (i = 0; i < matrix_elem_count; i++)
      for (j = 0; j < matrix_elem_count; j++) if (matrix[i][j] !== "") tie++;
    if (tie === matrix_elem_count * matrix_elem_count) return undefined;
    return false;
  }, []);
  const consumeCreditHandler = useCallback(async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const txn = await contract.consumeCredit();
        await txn.wait();
        contract.on("Consume", (user, credits, messgage) => {
          notify.show(messgage, "success", 2000);
          dispatch(checkCredit(credits));
        });
        return true;
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      notify.show("You need to consume credit to play the game", "error", 2000);
    }
    return false;
  }, []);
  const squareClick = useCallback(async (row, col, status) => {
    try {
      if (gameState.status === "T" || gameState.status === "W") {
        notify.show(
          "The game already completed. Please click reset button and play another game.",
          "warning",
          2000
        );
        return;
      }
      if (matrix[row][col] !== "") {
        notify.show(
          "This is already taken. Please put the stone to another cell.",
          "error",
          2000
        );
        return;
      }
      if (gameState.new_game === true) {
        setLoading(true);
        let res = await consumeCreditHandler();
        setLoading(false);
        if (res === false) return;
      }
      matrix[row][col] = status;
      let check_res = checkWinner(row, col, status);
      if (check_res === true) {
        setGameState({
          status: "W",
          new_game: true,
          status_text: "Winner: " + status,
        });
      } else if (check_res === undefined) {
        setGameState({ status: "T", new_game: true, status_text: "Tie" });
      } else if (gameState.status === "X") {
        setGameState({
          status: "O",
          new_game: false,
          status_text: "Next player: O",
        });
      } else if (gameState.status === "O") {
        setGameState({
          status: "X",
          new_game: false,
          status_text: "Next player: X",
        });
      }
    } catch {}
  }, []);
  const reset = useCallback(() => {
    for (let i = 0; i < matrix_elem_count; i++) {
      for (let j = 0; j < matrix_elem_count; j++) matrix[i][j] = "";
    }
    // setMatrix(matrix);
    setGameState({
      status: "X",
      new_game: true,
      status_text: "Next player: X",
    });
    // this.setState({ status_text: "Next player: X" });
  }, []);

  useEffect(() => {
    matrix = [];
    for (let i = 0; i < matrix_elem_count; i++) {
      let arr = new Array(matrix_elem_count).fill("");
      matrix.push(arr);
    }
    setGameState({
      status: "X",
      new_game: true,
      status_text: "Next player: X",
    });
  }, []);

  useEffect(() => {});

  items = useMemo(
    (matrix) =>
      matrix.map((elem, index) => (
        <div className="tilerow" key={index}>
          {elem.map((e, i) => (
            <Square
              val={e}
              status={gameState.status}
              row={index}
              col={i}
              squareClick={squareClick}
              key={i}
            ></Square>
          ))}
        </div>
      )),
    [matrix]
  );

  return (
    <div>
      <Notifications />
      {loading && <LoadingIndicator />}
      <div className="status mb-2">{gameState.status_text}</div>
      <div className="grid">{items}</div>
      <div className="button-wrap">
        <button className="button-reset" type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
