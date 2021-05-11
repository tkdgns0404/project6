/* 회원가입  페이지 */
import React, { useRef, useState, useEffect, Fragment } from "react"; // state관리와, ref 바인딩을 위한 hooks 라이브러리 임포트
import { post } from "axios"; // 비동기 요청을 위한 axios 라이브러리
import { Link, useHistory, useLocation, useParams } from "react-router-dom"; // 라우팅을 위한 라우터 라이브러리
import { TextField } from "@rmwc/textfield"; // React Material 디자인 TextField 컴포넌트입니다.
import { Button } from "@rmwc/button"; // React Material 디자인 Button 컴포넌트 입니다.
import { Icon } from "@rmwc/icon"; // 프로필 아이콘을 위한 컴포넌트 추가
import { Checkbox } from "@rmwc/checkbox"; //체크박스
import "@rmwc/checkbox/styles"; // checkbox css
import "@rmwc/button/styles"; // React Material Button 디자인 CSS 입니다.
import "@rmwc/textfield/styles"; // React Material TextField 디자인 CSS 입니다.
import "@rmwc/icon/styles"; // 아이콘 디자인 CSS입니다.
import "../css/board.css"; // 회원가입 페이지 커스텀 디자인 CSS 입니다.

const Board = (props) => {
  // 회원가입 페이지입니다. props는 회원수정인지 판단하기 위하여 매개변수로 받습니다. (info)
  const location = useLocation();
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const [allChecked, setAllChecked] = useState(false);
  const [formData, setFormData] = useState({
    profile: null,
    writer: "",
    title: "",
    content: "",
    reg_date: "",
    likes: "",
    stars:"",
    cnt: "",
    reply_cnt: ""
  });

  const [tempFormData, setTempFormData] = useState({
    profile: null,
    writer: "",
    title: "",
    content: "",
    reg_date: "",
    likes: "",
    stars:"",
    cnt: "",
    reply_cnt: ""
  });


  const profileRef = useRef();
  const iconRef = useRef();
  const previewRef = useRef();

  const [checkI, setCheckI] = useState(false);
  const [checkM, setCheckM] = useState(false);
  /* 위에는 변수선언부분들 */

  // 프로필 로딩, 페이지 로드시 한번만 실행합니다.
  useEffect(() => {
    if (location.state) {
      // 회원수정페인지 확인하는 if문
      fetch(`http://172.30.1.26:3001/api/board/updateBoard/${location.state.idx}`, {
        method: "GET",
      })
        .then((data) => data.json())
        .then((json) => {
          setTempFormData({
            profile: json[0][8],
            writer: json[0][3],
            title: json[0][1],
            content: json[0][2],
            reg_date: json[0][4],
            cnt: json[0][5],
            likes: json[0][6],
            stars:json[0][7]
          });
          setFormData({
            profile: json[0][8],
            writer: json[0][3],
            title: json[0][1],
            content: json[0][2],
            reg_date: json[0][4],
            cnt: json[0][5],
            likes: json[0][6],
            stars:json[0][7]
          });
        });

      previewRef.current.style.display = "block";
      iconRef.current.style.display = "none";
    }
  }, []);

  const handleProfileClick = () => {
    // 예쁜 버튼을 사용하기위해, 실제로 프로필사진을 업로드하는 버튼은 숨겨두고 이쁜버튼을누르면 숨겨진버튼이 클릭되도록 하는 부분입니다.
    profileRef.current.click();
  };

  const handleProfile = (event) => {
    // 프로필사진을 올리면, 미리보기에 사진이 보여지는 부분입니다.
    setProfile(URL.createObjectURL(event.target.files[0]));

    previewRef.current.style.display = "block";
    iconRef.current.style.display = "none";

    setFormData({
      ...formData,
      profile: event.target.files[0], // API에 요청을 날릴 Form State에 정보를 추가합니다.
    });
  };

  const handleValueChange = (event) => {
    // API 요청에 날릴 Form state에 정보를 추가합니다.
    console.log(formData);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const deleteClick = (evt) => {
    evt.preventDefault();
    // 회원가입버튼을 누르면 동작합니다.
    if (localStorage.getItem("login_id") != formData.writer) {
      // 계정권한을 선택하지 않으면 경고!
      alert("삭제할 권한이 없습니다.");
      return;
    }
    // 회원정보 삭제 버튼 클릭시 작동합니다.
    fetch("http://172.30.1.26:3001/api/board/delete", {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        indexes: location.state.idx // globalArray는 위에 말했듯, [12, 24, 25] 형태로 저장되는데 이걸 string으로 바꿔서 보냅니다. 즉, "12,24,25" 형태가 되는데, 서버에서 IN () 괄호안에 넣기위해 변환했습니다.
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          // 서버로부터 true가 날라오면 정상적으로 삭제됩니다.
          alert("게시글이 삭제되었습니다."); // 알림창
          history.push("/boardList");
        }
      });
  };

  const testFunc = () => {
    alert("게시글이 등록되었습니다.");
    history.push("/boardList");
  };

  const registerSubmit = async (event) => {
    event.preventDefault();
    // 회원가입버튼을 누르면 동작합니다.
    if (formData.title == "") {
      // 계정권한을 선택하지 않으면 경고!
      alert("제목을 작성해주세요");
      return;
    }
    
    if (formData.content == "") {
      // 프로필을 업로드 하지 않으면 경고!
      alert("내용을 작성해주세요");
      return;
    }
    if (formData.profile == "") {
      // 프로필을 업로드 하지 않으면 경고!
      alert("프로필 파일을 업로드 해주세요");
      return;
    }

    const reqFormData = new FormData(); // 파일이 업로드되는 폼이기때문에, multipart/form-data로 전송해야합니다.
    reqFormData.append("profile", formData.profile); // 입력한정보들을 폼데이터에 넣어줍니다.
    reqFormData.append("title", formData.title);
    reqFormData.append("content", formData.content);
    reqFormData.append("writer", localStorage.getItem("login_name"));
    const config = {
      headers: {
        "content-type": "multipart/form-data", // 헤더설정
      },
    };

    let resData = await post(
      `http://172.30.1.26:3001/api/boardList`,
      reqFormData,
      config
    );

    if (resData.data.success === true) {
      testFunc();
    }
  };

  const updateSubmit = (event) => {

    // 이부분은 회원수정버튼눌렀을때 동작합니다. 회원가입과 동일합니다.
    event.preventDefault();

    if(formData.writer != localStorage.getItem("login_name")){
      alert("수정할 권한이 없습니다.")
      return;
    }
    if (formData.title == "") {
      // 계정권한을 선택하지 않으면 경고!
      alert("제목을 작성해주세요");
      return;
    }
    
    if (formData.content == "") {
      // 프로필을 업로드 하지 않으면 경고!
      alert("내용을 작성해주세요");
      return;
    }
    if (formData.profile == "") {
      // 프로필을 업로드 하지 않으면 경고!
      alert("프로필 파일을 업로드 해주세요");
      return;
    }


    const reqFormData = new FormData();
    reqFormData.append("profile", formData.profile);
    reqFormData.append("title", formData.title);
    reqFormData.append("writer", formData.writer);
    reqFormData.append("content", formData.content);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    post(
      `http://172.30.1.26:3001/api/board/updateBoard/${location.state.idx}`,
      reqFormData,
      config
    ).then((res) => {
      if (res.data.success === true) {
        alert(res.data.msg);
        history.push("/boardList"); // 단 회원수정을했을때는 회원관리페이지로 이동합니다.
      }
    });
  };



  //아래부분들은 JSX 껍데기입니다.
  return (
    <div className="wrapper">
      <div className="column">
      {props.info ? <h1 className="registerTitle">게시글 상세</h1> : <h1 className="registerTitle">게시글 등록</h1>} 
      </div>
      <div className="column">
        <Icon icon="account_circle" className="profile_icon" ref={iconRef} />
        <img
          src={profile ? profile : tempFormData.profile}
          alt="profile_preview"
          className="profile_preview"
          ref={previewRef}
        />
        <Button
          label="파일 등록"
          outlined
          className="profile_button"
          onClick={handleProfileClick}
        />
        <input
          type="file"
          className="hidden_file"
          hidden
          onChange={handleProfile}
          ref={profileRef}
        />
      </div>

      <div className="column_reverse column">
        
      <div className="boardInput">
      
        <TextField
          outlined
          label="작성자"
          display="block"
          className="writerInput"
          onChange={handleValueChange}
          name="writer"
          value={formData.writer ? formData.writer : localStorage.getItem("login_name")}
        /><br></br>
        <TextField
          outlined
          label="제목"
          className="titleInput"
          placeholder="제목을 입력하세요"
          type="title"
          onChange={handleValueChange}
          name="title"
          value={formData.title ? formData.title : ""}
        /><br></br>
        <textarea
          outlined
          label="내용"
          className="contentInput"
          placeholder="내용을 입력해주세요"
          onChange={handleValueChange}
          name="content"
          value={formData.content ? formData.content : ""}
        />
      </div>
      </div>

      <div className="column">
        
        <Button
          label={props.info ? "게시글 수정" : "게시글 등록"}
          raised
          className={
            props.info ? "registerButton updateButton" : "registerButton"
          }
          type="button"
          onClick={props.info ? updateSubmit : registerSubmit}
        />
          {(localStorage.getItem("login_name") != formData.writer) ? null : 
          <Button
          label="게시글 삭제"
          raised
          outlined
          className="deleteButton homeButtons"
          onClick={deleteClick}
        /> }
        
        {!props.info ? (
          <Link to="/boardList">
            <Button
              label="게시글 등록 취소"
              raised
              className="registerCancleButton"
            />
          </Link>

        ) : (
          ""
        )}



        {props.info ? (
          <Link to="/boardList">
            <Button
              label="게시글 목록으로"
              raised
              className="registerCancleButton"
            />
          </Link>
        ) : (
          ""
        )}


        
      </div>
    </div>
  );
};

export default Board;
