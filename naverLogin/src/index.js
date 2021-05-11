import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import Root from "./client/Root"; //이부분, react-router를 위한 Root를 임포트하여,
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Root />, document.getElementById("root")); // 적용시켰습니다.

//나머지 부분은 create-react-app 기본설정이라 가만히 놔뒀습니다.

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
