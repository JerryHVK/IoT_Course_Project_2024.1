import React from "react";
import "./MyInfo.css";

function MyInfo({token}) {
  return <div>Write my info here - {JSON.stringify(token)}</div>;
}

export default MyInfo;