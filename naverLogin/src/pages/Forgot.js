import React, { useState, Fragment } from "react";
import { Radio } from "@rmwc/radio"; // React Material 디자인 Radio 컴포넌트입니다.
import { TextField } from "@rmwc/textfield"; //TextField
import { Button } from "@rmwc/button"; //Button
import "@rmwc/radio/styles"; // Radio css
import "@rmwc/textfield/styles"; //textField css
import "@rmwc/button/styles"; // button css
import "../css/forgot.css";

// 아이디/ 비밀번호 찾기 컴포넌트
const Forgot = () => {
  const [value, setValue] = useState("selectId");
  const [formData, setFormData] = useState(null);

  // 인풋 입력시마다 state에 정보저장
  const handleIdChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    console.log(formData);
  };
  //아이디찾기 버튼 눌렀을때 API 요청해서 아이디받아옴
  const findId = (e) => {
    fetch("http://172.30.1.26:3001/api/findid", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        userName: formData.userName,
        userPhone: formData.userPhone,
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        if (data[0]) {
          alert(`아이디는 ${data[0]} 입니다.`);
        } else {
          alert(`아이디가 존재하지 않거나 잘못된 값입니다.`);
        }
      });
  };
  //비밀번호 찾기를 눌렀을때 API 요청해서 데이터를 받아옴
  const findPw = (e) => {
    fetch("http://172.30.1.26:3001/api/findpw", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        userName: formData.userName,
        userPhone: formData.userPhone,
        userId: formData.userId,
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        if (data[0]) {
          alert(`비밀번호는 ${data[0]} 입니다.`);
        } else {
          alert(`정보가 틀렸거나 잘못된 값입니다.`);
        }
      });
  };

  // 아이디찾기 & 비밀번호 찾기 각각 조건부 렌더링
  const ifRender = () => {
    if (value === "selectId") {
      return (
        <Fragment>
          <div className="column">
            <TextField
              outlined
              label="이름"
              className="userName forgotInput"
              name="userName"
              placeholder="이름을 입력하세요."
              onChange={handleIdChange}
            />
          </div>

          <div className="column">
            <TextField
              outlined
              label="휴대번호"
              className="userPhone forgotInput"
              name="userPhone"
              placeholder="휴대번호를 입력하세요."
              onChange={handleIdChange}
            />
          </div>

          <div className="column">
            <Button
              label="찾기"
              raised
              className="findIdButton"
              onClick={findId}
            />
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div className="column">
            <TextField
              outlined
              label="이름"
              className="userName forgotInput"
              name="userName"
              placeholder="이름을 입력하세요."
              onChange={handleIdChange}
            />
          </div>

          <div className="column">
            <TextField
              outlined
              label="휴대번호"
              className="userPhone forgotInput"
              name="userPhone"
              placeholder="휴대번호를 입력하세요."
              onChange={handleIdChange}
            />
          </div>

          <div className="column">
            <TextField
              outlined
              label="아이디"
              className="userId forgotInput"
              name="userId"
              placeholder="아이디를 입력하세요."
              onChange={handleIdChange}
            />
          </div>

          <div className="column">
            <Button
              label="찾기"
              raised
              className="findPwButton"
              onClick={findPw}
            />
          </div>
        </Fragment>
      );
    }
  };

  return (
    <div className="wrapper">
      <div className="column">
        <h1 className="registerTitle">아이디 / 비밀번호 찾기</h1>
      </div>
      <div className="column">
        <Radio
          value="selectId"
          checked={value === "selectId"}
          onChange={(evt) => setValue(String(evt.currentTarget.value))}
        >
          아이디 찾기
        </Radio>

        <Radio
          value="selectPw"
          checked={value === "selectPw"}
          onChange={(evt) => setValue(String(evt.currentTarget.value))}
        >
          비밀번호 찾기
        </Radio>
      </div>

      {ifRender()}
    </div>
  );
};

export default Forgot;
