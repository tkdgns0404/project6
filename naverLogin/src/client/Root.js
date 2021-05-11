import React from "react";
import { BrowserRouter } from "react-router-dom"; // 페이지 이동 처리를 위한 BrowserRouter Import
import App from "../App"; //라우팅 처리를 하는 App 파일입니다. (여러개의 페이지 이동을 위한)

const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default Root;
