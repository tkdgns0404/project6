import oracledb from "oracledb"; // 오라클 DB연동을 위한 라이브러리

oracledb.autoCommit = true; // 자동 커밋을 하도록 설정

export const getRows = (sql) => {
  // 데이터를 수정하는게 아닌,  받기만 할때 사용하는 함수입니다.
  return new Promise((resolve, reject) => {
    oracledb.getConnection(
      // 오라클과 커넥션
      {
        user: "project6", // DB의 USER 이름
        password: "project6", // DB의 비밀번호
        connectString: "orcl", // DB의 이름
      },
      function (err, connection) {
        if (err) {
          // 에러가났을때
          console.error(err.message); // 콘솔로 메세지를 뿌려줍니다.
          reject(err); // 동일
          return;
        } else {
          connection.execute(sql).then((res) => {
            //매개변수로 받은 sql을 실행하고, 결과를 return합니다.
            resolve(res.rows); // 리턴
          });
        }
      }
    );
  });
};

export const getResult = (sql) => {
  // 데이터를 추가, 입력, 삭제 등 "수정"할때 사용하는 함수 입니다.
  return new Promise((resolve, reject) => {
    oracledb.getConnection(
      // 위와동일
      {
        user: "project6",
        password: "project6",
        connectString: "orcl",
      },
      function (err, connection) {
        // 위와동일
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        } else {
          connection.execute(sql).then((res) => {
            // 위와 동일
            resolve(res);
          });
        }
      }
    );
  });
};
