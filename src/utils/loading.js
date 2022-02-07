import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../assets/css/loading.css";

export default function LoadingIndicator() {
  return (
    <div className="box">
      <div className="loading-indicator">
        <CircularProgress />
      </div>
    </div>
  );
}
