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
import "../css/register.css"; // 회원가입 페이지 커스텀 디자인 CSS 입니다.

const Register = (props) => {
  // 회원가입 페이지입니다. props는 회원수정인지 판단하기 위하여 매개변수로 받습니다. (info)
  const location = useLocation();
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const [allChecked, setAllChecked] = useState(false);
  const [formData, setFormData] = useState({
    profile: null,
    userId: "",
    userName: "",
    userPassword: "",
    userPassword2: "",
    userMail: "",
    userRole:"",
    userPhone: "",
    userFullAddress: "",
    userSubAddress: "",
  });

  const [tempFormData, setTempFormData] = useState({
    profile: null,
    userId: "",
    userName: "",
    userPassword: "",
    userPassword2: "",
    userMail: "",
    userRole:"",
    userPhone: "",
    userFullAddress: "",
    userSubAddress: "",
  });

  const [address, setAddress] = useState("");

  const profileRef = useRef();
  const iconRef = useRef();
  const previewRef = useRef();

  const [checkI, setCheckI] = useState(false);
  const [checkM, setCheckM] = useState(false);
  const [fullAdd, setFullAdd] = useState("");
  const [subAdd, setSubAdd] = useState("");
  /* 위에는 변수선언부분들 */

  // 프로필 로딩, 페이지 로드시 한번만 실행합니다.
  useEffect(() => {
    if (location.state) {
      // 회원수정페인지 확인하는 if문
      fetch(`http://172.30.1.26:3001/api/user/update/${location.state.idx}`, {
        method: "GET",
      })
        .then((data) => data.json())
        .then((json) => {
          console.log(json);
          setTempFormData({
            profile: json[0][8],
            userId: json[0][1],
            userName: json[0][3],
            userPassword: json[0][2],
            userMail: json[0][4],
            userPhone: json[0][5],
          });
          setFormData({
            profile: json[0][8],
            userId: json[0][1],
            userName: json[0][3],
            userPassword: json[0][2],
            userMail: json[0][4],
            userPhone: json[0][5],
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

  const testFunc = () => {
    alert("회원가입이 되셨습니다.");
    history.push("/");
  };

  const registerSubmit = async (event) => {
    event.preventDefault();
    // 회원가입버튼을 누르면 동작합니다.
    if (formData.userRole == "") {
      // 계정권한을 선택하지 않으면 경고!
      alert("계정권한을 선택 해주세요");
      return;
    }

    if (formData.profile == "") {
      // 프로필을 업로드 하지 않으면 경고!
      alert("프로필 파일을 업로드 해주세요");
      return;
    }

    if (formData.userPassword !== formData.userPassword2) {
      // 비밀번호가 서로 다른지 체크하는 validation 코드입니다.
      alert("비밀번호를 다시 확인 해주세요");
      return;
    }

    if (checkI === false) {
      alert("필수 약관을 동의 해주세요");
      return;
    }

    let fullAddress = document.getElementById("fullAddress").value;
    let subAddress = document.getElementById("subAddress").value;

    const reqFormData = new FormData(); // 파일이 업로드되는 폼이기때문에, multipart/form-data로 전송해야합니다.
    reqFormData.append("profile", formData.profile); // 입력한정보들을 폼데이터에 넣어줍니다.
    reqFormData.append("userRole", formData.userRole);
    reqFormData.append("userId", formData.userId);
    reqFormData.append("userName", formData.userName);
    reqFormData.append("userPassword", formData.userPassword);
    reqFormData.append("userMail", formData.userMail);
    reqFormData.append("userPhone", formData.userPhone);
    reqFormData.append("userFullAddress", fullAddress);
    reqFormData.append("userSubAddress", subAddress);
    const config = {
      headers: {
        "content-type": "multipart/form-data", // 헤더설정
      },
    };

    let resData = await post(
      `http://172.30.1.26:3001/api/register`,
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
    if (formData.userPassword !== formData.userPassword2) {
      alert("비밀번호를 다시 확인 해주세요");
      return;
    }

    let fullAddress = document.getElementById("fullAddress").value;
    let subAddress = document.getElementById("subAddress").value;

    const reqFormData = new FormData();
    reqFormData.append("profile", formData.profile);
    reqFormData.append("userRole", formData.userRole);
    reqFormData.append("userId", formData.userId);
    reqFormData.append("userName", formData.userName);
    reqFormData.append("userPassword", formData.userPassword);
    reqFormData.append("userMail", formData.userMail);
    reqFormData.append("userPhone", formData.userPhone);
    reqFormData.append("userFullAddress", fullAddress);
    reqFormData.append("userSubAddress", subAddress);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    post(
      `http://172.30.1.26:3001/api/user/update/${location.state.idx}`,
      reqFormData,
      config
    ).then((res) => {
      if (res.data.success === true) {
        alert(res.data.msg);
        history.push("/management"); // 단 회원수정을했을때는 회원관리페이지로 이동합니다.
      }
    });
  };

  const handleAddress = () => {
    let win = window.open(
      "http://172.30.1.26:3000/address",
      "blank",
      "width=500, height=500"
    );
  };

  const importantPopup = () => {
    window.open(
      "http://172.30.1.26:3000/ipopup",
      "새창",
      "width=500, height=500, resizeable=yes"
    );
  };

  const marketingPopup = () => {
    window.open(
      "http://172.30.1.26:3000/mpopup",
      "새창",
      "width=500, height=500, resizeable=yes"
    );
  };

  const toggleChange = () => {
    const checkboxes = Array.from(document.getElementsByClassName("check_box")); // 현재 체크박스들을 모두 array에 담습니다.

    setAllChecked(!allChecked);

    if (!allChecked) {
      setCheckI(true);
      setCheckM(true);
    } else {
      setCheckI(false);
      setCheckM(false);
    }
  };

  const checkIHandle = () => {
    console.log("handle");
    console.log(!checkI);
    setCheckI(!checkI);
  };

  const checkMHandle = () => {
    setCheckM(!checkM);
  };

  //아래부분들은 JSX 껍데기입니다.
  return (
    <div className="wrapper">
      <div className="column">
        <h1 className="registerTitle">회원가입</h1>
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
          label="회원사진 등록"
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

        
      {props.info ? null : 
      <div className="registerInput">
      <input
          type="radio"
          name="userRole"
          onChange={handleValueChange}
          value = "사용자"
          />사용자
        <br></br>
        <input
          type="radio"
          name="userRole"
          onChange={handleValueChange}
          value = "관리자"
          />관리자
        <br></br>
        <h2>{formData.userRole}</h2>
        </div>
        }


        <TextField
          outlined
          label="이름"
          className="userName registerInput"
          placeholder="공백없이 입력해주세요."
          onChange={handleValueChange}
          name="userName"
          value={formData.userName ? formData.userName : ""}
        />
        <TextField
          outlined
          label="이메일"
          className="userEmail registerInput"
          placeholder="이메일 주소를 입력해주세요."
          type="email"
          onChange={handleValueChange}
          name="userMail"
          value={formData.userMail ? formData.userMail : ""}
        />
        <TextField
          outlined
          label="휴대전화"
          className="userPhone registerInput"
          placeholder="-없이 숫자만 입력해주세요."
          onChange={handleValueChange}
          name="userPhone"
          value={formData.userPhone ? formData.userPhone : ""}
        />
        <TextField
          outlined
          label="아이디"
          className="userId registerInput"
          placeholder="공백없이 입력해주세요."
          onChange={handleValueChange}
          name="userId"
          value={formData.userId ? formData.userId : ""}
        />
        <TextField
          outlined
          label="비밀번호"
          className="userPassword registerInput"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          onChange={handleValueChange}
          name="userPassword"
        />
        <TextField
          outlined
          label="비밀번호 확인"
          className="userPassword2 registerInput"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          onChange={handleValueChange}
          name="userPassword2"
        />
      </div>

      <div className="column">
        <TextField
          icon="search"
          label="주소 검색"
          outlined
          className="registerInput"
          onChange={handleValueChange}
          id="fullAddress"
        />
      </div>

      <div className="column">
        <Button raised className="addressButton" onClick={handleAddress}>
          {" "}
          주소 검색
        </Button>
      </div>

      <div className="column">
        <TextField
          label=""
          outlined
          className="registerInput"
          placeholder="나머지 주소를 입력하세요."
          id="subAddress"
          onChange={handleValueChange}
        />
      </div>

      {!props.info ? (
        <Fragment>
          <div className="column custom_use">
            <Checkbox
              label="아래 약관을 전체 동의 합니다."
              className="check_all"
              checked={allChecked}
              onChange={toggleChange}
            />
          </div>

          <div className="column custom_use">
            <Checkbox
              label="서비스 약관 동의 [필수]"
              className="check_box"
              checked={checkI}
              onChange={checkIHandle}
            />
            <Button outlined onClick={importantPopup}>
              약관보기
            </Button>
          </div>

          <div className="column custom_use">
            <Checkbox
              label="마케팅 수신 동의 [선택]"
              className="check_box"
              checked={checkM}
              onChange={checkMHandle}
            />
            <Button outlined onClick={marketingPopup}>
              약관보기
            </Button>
          </div>
        </Fragment>
      ) : (
        ""
      )}
      <div className="column">
        <Button
          label={props.info ? "회원 정보 수정" : "회원 가입"}
          raised
          className={
            props.info ? "registerButton updateButton" : "registerButton"
          }
          type="button"
          onClick={props.info ? updateSubmit : registerSubmit}
        />
        {!props.info ? (
          <Link to="/">
            <Button
              label="회원 가입 취소"
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

export default Register;
