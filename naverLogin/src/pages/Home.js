import React from 'react';
import { Button } from '@rmwc/button';
import { Link, useHistory } from "react-router-dom";
import "../css/management.css";


    function Home() {
        const history = useHistory(); // 라우팅 히스토리

        const logoutFunc = () => {
            localStorage.removeItem("login");
        
            if (localStorage.getItem("login_type")) {
              localStorage.removeItem("login_type");
            }
        
            alert("로그아웃 되었습니다.");
            history.push("/");
          };

          const boardListClick =()=>{
            history.push("/boardList");
          };

        return (

        <div className="wrapper table_wrapper">
        
        {(localStorage.getItem("login_role")!="관리자") ? <h1>메인페이지</h1> : <h1>관리자 전용 페이지</h1>} 

          <h3>{localStorage.getItem("login_name")}님 환영합니다.</h3>

        <div className="column">
       
        {(localStorage.getItem("login_role")!="관리자") ? null : 
         <Link to="/management">
         <Button
          label="회원정보 관리"
          outlined
          className="management homeButtons"
        /></Link> }

        <Button
          label="게시판"
          outlined
          className="boardListButtons"
          onClick={boardListClick}
        />

        <Button
          label="로그아웃"
          outlined
          className="logoutButton"
          onClick={logoutFunc}
        />

      </div>
        </div>
        );
    } export default Home;

