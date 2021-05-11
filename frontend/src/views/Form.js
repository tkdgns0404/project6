import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { history } from '../history'

import axios from 'axios'

export default class Add extends React.Component {
	constructor(props) {
		super(props)

		// 파라미터에서 id를 읽어와 수정모드인지 추가모드인지 확인
		this.state = {
			id: props.match.params.id,
			mode: props.match.params.id ? 'edit' : 'add',

			title: null,
			content: null,
			image: null,
		}
	}

	componentDidMount() {
		const { id } = this.state // id를 읽어옴
		if(!id) return // id가 없는경우 종료

		// 수정모드이므로 게시글 정보를 읽어와 저장
		axios.get('/board/' + id)
			.then(res => this.setState({ ...res.data }))
	}

	action() {
		const { title, content, image, mode, id } = this.state // 데이터를 읽어옴

		// 폼 생성 및 데이터 추가
		let form = new FormData()
		form.append('pk', id)
		form.append('title', title)
		form.append('content', content)
		if(image) form.append('image', image)

		// 추가 모드이면 put 메소드. 업데이트면 post 메소드로 전송
		if(mode == 'add') {
			axios.put('/board', form, { headers: { 'Content-Type': 'multipart/form-data; charset=utf-8;' }})
				.then(res => { alert(res.data.msg); history.goBack() }) // 성공 시 알림 및 페이지 되돌아가기
				.catch(err => alert(err.response.data.msg)) // 실패 시 알림
		} else {
			axios.post('/board', form, { headers: { 'Content-Type': 'multipart/form-data; charset=utf-8;' }})
				.then(res => { alert(res.data.msg); history.goBack() }) // 성공 시 알림 및 페이지 되돌아가기
				.catch(err => alert(err.response.data.msg)) // 실패 시 알림
		}
	}

	render() {
		const { title, content, mode } = this.state

		return (<>
			<Row className='mb-2'>
				<Col md={12}>
					<Form.Group>
						<Form.Label>제목</Form.Label>
						<Form.Control type='text' value={title} onChange={(event) => this.setState({ title: event.target.value })}/>
					</Form.Group>
					<Form.Group>
						<Form.Label>내용</Form.Label>
						<Form.Control type='text' value={content} onChange={(event) => this.setState({ content: event.target.value })}/>
					</Form.Group>
					<Form.Group>
						<Form.Label>이미지</Form.Label>
						<Form.File accept='image/*' onChange={(event) => this.setState({ image: event.target.files[0] })}/>
					</Form.Group>
				</Col>
				<Col md={6}>
				<Button className='btn-secondary btn-block' onClick={() => history.goBack()}>취소</Button>
				</Col>
				<Col md={6}>
					<Button className='btn-secondary btn-block' onClick={() => this.action()}>{mode == 'add' ? '글쓰기' : '수정'}</Button>
				</Col>
			</Row>
		</>)
	}
}
