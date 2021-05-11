import React from "react"; // react 라이브러리를 import
import { Route } from "react-router-dom"; // URL 이동을 위한 컴포넌트들 import
import Login from "./pages/Login"; // 로그인 페이지 Import
import Home from "./pages/Home"; // 홈 화면
import Register from "./pages/Register"; // 회원가입 페이지 Import
import Forgot from "./pages/Forgot"; //아이디/비밀번호 찾기 페이지 import
import Callback from "./pages/Callback"; //네이버로그인 콜백페이지
import Address from "./pages/Address"; // 주소검색 페이지
import Ipopup from "./pages/Ipopup"; // 주소검색 페이지
import Mpopup from "./pages/Mpopup"; // 주소검색 페이지
import Management from "./pages/Management"; //로그인 후 회원정보를 관리하는 페이지 Import
import BoardList from "./pages/BoardList";
import Board from "./pages/Board";
import Main from "./pages/Main";
const App = () => {
  // Path 에 매칭하여 페이지를 나타내는 부분
  /*
    / - Login.js
    /home - Home.js
    /management - Management.js
    /register - Register.js
    /update - Register에 props로 info를 주었습니다. (요구사항에 회원가입 페이지를 그대로 사용해달라고 하셔서, 저 info가 true일경우에 회원 수정으로 판단합니다.)
  */
  return (
    <>
      <Route exact path="/" component={Main} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/management" component={Management} />
      <Route exact path="/management-callback" component={Callback} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/update" render={() => <Register info={true} />} />
      <Route exact path="/updateBoard" render={() => <Board info={true} />} />
      <Route exact path="/forgot" component={Forgot} />
      <Route exact path="/address" component={Address} />
      <Route exact path="/ipopup" component={Ipopup} />
      <Route exact path="/mpopup" component={Mpopup} />
      <Route exact path="/boardList" component={BoardList} />
      <Route exact path="/board" component={Board} />
    </>
  );
};

export default App;
