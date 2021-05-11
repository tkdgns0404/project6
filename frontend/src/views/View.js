import React from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import { history } from "../history";

import axios from "axios";

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    // 파라미터 데이터를 확인
    this.state = {
      id: props.match.params.id,
      info: {},
    };
  }

  componentDidMount() {
    const { id } = this.state; // id 불러옴
    // 게시글 정보를 읽어와 저장
    axios.get(`/board/${id}`).then((res) => this.setState({ info: res.data }));
  }

  toggleGood() {
    let { info } = this.state;
    // 좋아요를 toggle방식으로 업데이트
    info.good = info.good ? 0 : 1;
    // state에 저장
    this.setState({ info });
  }

  changeStar(val) {
    let { info } = this.state;
    // 입력한 만큼 별점 저장
    info.star = val;
    this.setState({ info });
  }

  update() {
    const { id, info } = this.state;

    // id와 게시글 정보를 서버에 업데이트
    axios
      .post("/board/comment", { pk: id, ...info })
      .then((res) => alert("코멘트를 수정하였습니다")); // 성공 시 알림
  }

  render() {
    const { info } = this.state; // 게시글 정보를 읽어옴
    // 별점을 읽어와 버튼으로 렌더링
    const stars = [];
    for (let i = 0; i < 5; i++)
      stars.push(
        <Button
          className="rounded-0 btn-light px-1"
          onClick={() => this.changeStar(i + 1)}
        >
          {i < info.star ? "★" : "☆"}
        </Button>
      ); // 클릭시 별점 업데이트

    return (
      <>
        <Row className="mb-2">
          <Col md={12}>
            <Table responsive>
              <tr>
                <th width="120">제목</th>
                <td>{info.title}</td>
              </tr>
              <tr>
                <th>글내용</th>
                <td>
                  {info.content != "null" ? info.content : "내용이 없습니다"}
                </td>
              </tr>
              <tr>
                <th>이미지</th>
                <td>
                  {info.image && (
                    <img
                      src={`http://192.168.1.2:3000/images/${info.image}`}
                      width="100%"
                    />
                  )}
                </td>
              </tr>
            </Table>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <Button
              className={`circle ${
                info.good == 1 ? "btn-warning" : "btn-light"
              } rounded-md mr-4`}
              onClick={() => this.toggleGood()}
            >
              좋아요
            </Button>

            {stars}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Button
              className="btn-secondary btn-block"
              onClick={() => this.update()}
            >
              평가내용저장
            </Button>
          </Col>
          <Col md={6}>
            <Button
              className="btn-secondary btn-block"
              onClick={() => history.goBack()}
            >
              글목록보기
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}
