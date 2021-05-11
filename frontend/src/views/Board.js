import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Form, Button } from 'react-bootstrap'
import ReactPaginate from 'react-js-pagination'

import axios from 'axios'
import auth from '../auth'

export default class Board extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			data: [],
			page: 0,
			count: 0,
			perPage: 0,
			search: null,
		}

		this.getData()
	}

	getData() {
		// 게시글 리스트를 읽어와 저장
		axios.get('/board').then(res => {
			const data = res.data
			this.setState({ data: this.appendChkOpt(data.data), ...data })
		})
	}

	search() {
		const { search } = this.state // 검색어를 읽어옴

		// 검색어 쿼리로 요청 및 저장
		axios.get('/board', { params: { search } }).then(res => {
			const data = res.data
			this.setState({ data: this.appendChkOpt(data.data), ...data })
		})
	}

	handlePage(page) {
		const { search } = this.state

		// 페이지 업데이트. 검색어와 페이지 정보로 읽어와 저장
		axios.get('/board', { params: { search, page } }).then(res => {
			const data = res.data
			this.setState({ data: this.appendChkOpt(data.data), ...data })
		})
	}

	// 체크박스에 대한 옵션을 추가해주는 함수
	appendChkOpt(data) {
		return data.map(obj => { return { ...obj, check: false } })
	}
	// 체크박스 클릭처리 이벤트 함수
	clickCheckbox(index) {
		let { data } = this.state
		// data의 index 데이터에 check 옵션 toggle
		data[index].check = !data[index].check
		this.setState({ data }) // data저장
	}
	// 전체선택 함수
	allCheck(checked) {
		let { data } = this.state
		// data의 모든 값들을 입력받은 checked로 저장
		this.setState({ data: data.map(obj => { return { ...obj, check: checked } }) })
	}
	// pk에 대한 게시글 삭제
	deleteOne(pk) {
		// pk를 옵션으로 삭제
		axios.delete('/board/', { data: { pk } })
			.then(res => {
				alert(res.data.msg) // 결과 알림
				this.getData() // 게시글을 새로 불러옴
			})
	}
	// 선택된 게시글 삭제
	deleteChk() {
		const { data } = this.state
		let pk_list = [] // 삭제할 pk 리스트
		// 데이터를 반복해 체크가 되어있으면 pk_list에 추가
		data.map(obj => { if(obj.check) pk_list.push(obj.id) })
		// 삭제 요청
		axios.delete('/board', { data: { pk: pk_list } })
			.then(res => {
				alert(res.data.msg) // 결과 알림
				this.getData() // 게시글을 새로 불러옴
			})
	}
	
	render() {
		const { data, page, count, perPage } = this.state

		return (<>
			<Row>
				<Col md={12} className='pb-4'>
					<span>안녕하세요, {auth.name}님 </span>
					<Link to='/login'>로그아웃</Link>
				</Col>

				<Col md={12} className='mb-2'>
					<Table>
						<thead>
							<tr>
								<th><Form.Check type='checkbox' onClick={(event) => this.allCheck(event.target.checked)}/></th>
								<th>글 번호</th>
								<th>제목</th>
								<th>아이디</th>
								<th>작성자</th>
								<th>관리</th>
							</tr>
						</thead>
						<tbody>
							{data.map((obj, index) => <tr key={index}>
								<td>
									<input type='checkbox' checked={obj.check} onClick={() => this.clickCheckbox(index)}/>
								</td>
								<td>{obj.no}</td>
								<td>
									<Link to={`/view/${obj.id}`}>{obj.title}</Link>
								</td>
								<td>{obj.user_id}</td>
								<td>{obj.user_name}</td>
								<td>
									<Link to={`/edit/${obj.id}`}>수정</Link>
									<span> / </span>
									<Link onClick={() => this.deleteOne(obj.id)}>삭제</Link>
								</td>
							</tr>)}
						</tbody>
					</Table>

					{/* 페이징 처리 */}
					<ReactPaginate
						activePage={page}
						totalItemsCount={count}
						itemsCountPerPage={perPage}
						onChange={page => this.handlePage(page)}
						
						innerClass='pagination'
						itemClass='page-item'
						activeClass='active'

						nextPageText='다음'
						prevPageText='이전'
						/>
				</Col>

				<Col md={10}>
					<Form.Group>
						<Form.Control type='text' onChange={(event) => this.setState({ search: event.target.value })}/>
					</Form.Group>
				</Col>
				<Col md={2}>
					<Button className='btn-secondary btn-block' onClick={() => this.search()}>검색</Button>
				</Col>

				<Col md={6}>
					<Link to='/add'>
						<Button className='btn-secondary btn-block text-white'>글쓰기</Button>
					</Link>
				</Col>
				<Col md={6}>
					<Button className='btn-secondary btn-block' onClick={() => this.deleteChk()}>선택삭제</Button>
				</Col>
			</Row>
		</>)
	}
}
