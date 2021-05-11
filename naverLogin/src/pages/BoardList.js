// 로그인 후 회원정보를 관리하는 페이지

import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@rmwc/button"; // React Material 디자인 Button 컴포넌트 입니다.
import { Checkbox } from "@rmwc/checkbox";
import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableBody,
  DataTableCell,
} from "@rmwc/data-table"; //React Material 디자인 Data-Table 컴포넌트 입니다.
import { TextField } from "@rmwc/textfield"; //React Material 디자인 TextField 컴포넌트 입니다.
import "@rmwc/textfield/styles"; // //React Material TextField 디자인 입니다.
import "@rmwc/button/styles"; // React Material Button 디자인 CSS 입니다.
import "@rmwc/data-table/styles"; // React Material Data-Table 디자인 CSS 입니다.
import "@rmwc/checkbox/styles"; // React Meterial checkbox 디자인 CSS 입니다.
import "../css/management.css"; // 이 페이지의 커스텀 디자인 CSS 입니다.
const BoardList = () => {
  // 이부분들은 state 초기화 부분이라 보실게 없습니다.
  const history = useHistory(); // 라우팅 히스토리
  const [allChecked, setAllChecked] = useState(false);
  const [isChecked, setChecked] = useState([]);
  const [rows, setRows] = React.useState(0);
  const [cols, setCols] = React.useState(0);
  const [state, setState] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [globalArray, setGlobalArray] = useState([]);
  const [tempCount, setTempCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  //전체 체크박스 체크하는 이벤트 리스너입니다.
  const toggleChange = () => {
    const checkboxes = Array.from(document.getElementsByClassName("check_box")); // 현재 체크박스들을 모두 array에 담습니다.
    let tempCheckArray = []; // 이 부분에 넣어주고, state에 업데이트 할 예정인 부분.
    setAllChecked(!allChecked); // 토글
    if (!allChecked) {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].children[0].checked = true; //체크되면 모든 체크박스에 체크가 됩니다.
        tempCheckArray.push(
          checkboxes[i].children[0].attributes.value.nodeValue
        ); // 그리고 위의 temp array에 push합니다.
      }
      setGlobalArray(tempCheckArray); // 이 임시array를 실제로 사용할 globalArray state에 업데이트합니다.
    } else {
      for (let i = 0; i < checkboxes.length; i++) {
        // 체크해제시 모든체크박스가 해제되며, globalArray또한 초기화됩니다.
        checkboxes[i].children[0].checked = false;
        setGlobalArray([]);
      }
    }
  };

  useEffect(() => {
    // 페이지 로딩시 딱 한번만 실행되는 부분입니다. (로딩시 회원정보들을 불러와야 함.)
    const fetchData = async () => {
      const response = await fetch("http://172.30.1.26:3001/api/boardList/", {
        //모든 유저들을 불러오는데, api단에서, params가 없으면 기본적으로 1page로 세팅이 되기때문에 처음 1~10개의 데이터만 요청됩니다.
        method: "GET",
      });
      const jsonData = await response.json();
      setState(jsonData.result); //state 업데이트
      setTotalPage(jsonData.totalPage);
    };
    fetchData();
  }, [tempCount]); // tempCount가 값이 변하면 리렌더링되는데, 비중이 적어 신경안쓰셔도 될거같습니다.

  const getPageData = async (page) => {
    // 이부분은 페이지 블록을 클릭했을때 해당 페이지의 정보를 다시 로딩합니다. [2]를 누르면 당연히 2번 페이지가 요청이 되겟죠?
    const URL = `http://172.30.1.26:3001/api/boardList/${page}`;
    const response = await fetch(URL, {
      method: "GET",
    });
    const jsonData = await response.json();
    setState(jsonData.result);
    setTotalPage(jsonData.totalPage); // state 업데이트
  };

  const selectCheckBox = (evt) => {
    // 이부분은 전체 체크박스 체크가 아닌, multiple. 즉 여러개 체크박스를 위한 이벤트 리스너입니다.
    if (evt.target.checked) {
      //글로벌 어레이로 관리합니다. 체크를하면, idx값이 배열형태로 state에 업데이트 됩니다.
      setGlobalArray([...globalArray, evt.target.value]);
    } else {
      let index = globalArray.indexOf(+evt.target.value);
      globalArray.splice(index, 1); //ex) [12,24,68]
    }
    setChecked(globalArray);
  };

  const updateClick = (evt) => {
    
    // 회원수정버튼 클릭시 작동합니다.
    if (globalArray.length == 0) {
      alert("상세보기를 하려면 체크를 해주세요.");
      return;
  }
  if (globalArray.length > 1) {
        alert("상세보기는 한개만 가능합니다.");
    return;
  }

    history.push({
      // /회원수정페이지로  이동!
      pathname: "/updateBoard",
      state: { idx: globalArray[0] },
    });
  };

  const deleteClick = (evt) => {
    
    // 회원정보 삭제 버튼 클릭시 작동합니다.
    fetch("http://172.30.1.26:3001/api/board/delete", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        indexes: globalArray.toString(), // globalArray는 위에 말했듯, [12, 24, 25] 형태로 저장되는데 이걸 string으로 바꿔서 보냅니다. 즉, "12,24,25" 형태가 되는데, 서버에서 IN () 괄호안에 넣기위해 변환했습니다.
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          // 서버로부터 true가 날라오면 정상적으로 삭제됩니다.
          alert(`${globalArray.length}개의 게시글이 삭제되었습니다.`); // 알림창
          getPageData(1); // 삭제후엔, 1페이지로 돌아갑니다. Re-rendering을 위해,
          setAllChecked(false); // 그리고 전체체크박스로 삭제했을시에는, 삭제가됬으니 체크해제를 해줘야겠죠?
          setGlobalArray([]);
        }
      });
  };

  const searchHandle = (evt) => {
    // 이부분은 회원정보 검색 input부분 state 업데이트 입니다.
    setSearchInput(evt.target.value);
  };

  const searchClick = async (evt) => {
    // 검색버튼 클릭시 작동합니다.
    if (searchInput.length < 1) {
      // 한글자라도 적지않으면 알림창이 나옵니다.
      alert("검색어를 입력하세요");
      return;
      evt.preventDefault();
    }
    const response = await fetch(
      `http://172.30.1.26:3001/api/board/search/${searchInput}`,
      {
        method: "GET",
      }
    );
    const jsonData = await response.json();
    setState(jsonData); // 결과를 state에 반영합니다.
  };

  const pageClick = (evt) => {
    // 페이지클릭시 작동
    const pageNum = evt.currentTarget.id;
    getPageData(pageNum); // 동일
  };

  const hoemClick =()=>{
    history.push("/home");
  };

  const logoutFunc = () => {
    localStorage.removeItem("login");

    if (localStorage.getItem("login_type")) {
      localStorage.removeItem("login_type");
    }

    alert("로그아웃 되었습니다.");
    history.push("/");
  };

  //아래는 JSX 껍데기및, 이벤트리스너 연동.

  return (
   
    <div className="wrapper table_wrapper">
      <div className="column">
      {(localStorage.getItem("login_role")!="관리자") ? <h1 className="managementTitle">게시글 목록(사용자용)</h1> :
                                                       <h1 className="managementTitle">게시글 목록(관리자용)</h1>} 
      </div>
      <DataTable
        style={{ height: "600px", width: "1500px" }}
        stickyRows={rows}
        stickyColumns={cols}
      >
        <DataTableContent>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>
                <Checkbox
                  className="check_all"
                  checked={allChecked}
                  onChange={toggleChange}
                />
              </DataTableHeadCell>
              <DataTableHeadCell>순번</DataTableHeadCell>
              <DataTableHeadCell>게시글 번호</DataTableHeadCell>
              <DataTableHeadCell>작성자</DataTableHeadCell>
              <DataTableHeadCell>제목</DataTableHeadCell>
              <DataTableHeadCell>작성날짜</DataTableHeadCell>
              <DataTableHeadCell>조회수</DataTableHeadCell>
              <DataTableHeadCell>좋아요</DataTableHeadCell>
              <DataTableHeadCell>별점</DataTableHeadCell>
              <DataTableHeadCell>[파일]</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {state.map((v, i) => (
              <DataTableRow key={i + 1123}>
                <DataTableCell key={v[1] + i}>
                  <Checkbox
                    className="check_box"
                    onChange={selectCheckBox}
                    value={v[0]}
                  />
                </DataTableCell>
                <DataTableCell key={v[2] + i}>{i + 1}</DataTableCell>
                {v.map((j) => (
                  <DataTableCell key={j + Math.random(100) * 10}>
                    {j}
                  </DataTableCell>
                ))}
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTableContent>
      </DataTable>

      <div className="column pagination_wrapper">
        {[...Array(totalPage)].map((n, index) => {
          return (
            <span
              className="pagination_number"
              value={index + 1}
              onClick={pageClick}
              id={index + 1}
              key={index + 10}
            >
              [{index + 1}]
            </span>
          );
        })}
      </div>

      <div className="column">
        <TextField
          outlined
          label="작성자"
          className="writer searchInput"
          placeholder="검색할 이름 입력"
          onChange={searchHandle}
        />
        <Button
          label="검색"
          outlined
          className="searchButton homeButtons"
          onClick={searchClick}
        />
      </div>

        
      <div className="column">
        <Button
          label="게시글 상세"
          outlined
          className="updateButton homeButtons"
          onClick={updateClick}
        ></Button>
        
        {(localStorage.getItem("login_role")!="관리자") ? null : 
          <Button
          label="게시글 삭제"
          outlined
          className="deleteButton homeButtons"
          onClick={deleteClick}
        /> }

         <Button
          label="홈으로"
          outlined
          raised
          className="homeButtons"
          onClick={hoemClick}
        />

        <Link to="/board">
          <Button
            label="게시글 등록"
            outlined
            className="addButton homeButtons"
          />
        </Link>
        <Button
          label="로그아웃"
          outlined
          className="logoutButton"
          onClick={logoutFunc}
        />
      </div>
    </div>
  );
};

export default BoardList;
