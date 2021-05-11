import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Route, Switch, Redirect } from 'react-router-dom'

// 페이지들
import Board from './views/Board'
import Form from './views/Form'
import View from './views/View'
import Login from './views/Login'
// 인증 모듈
import auth from './auth'

// 인증 확인해서 로그인 안되었을 경우 /login으로 리다이렉션하는 커스텀 함수
function PrivateRoute ({component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => auth.loggedIn === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

export default class App extends React.Component {
	constructor(props) {
		super(props)
		auth.chkAuth() // 인증 확인
	}

	render() {
		return (<>
			<Container>
				<Row className='py-5'>
					<Col md={12}>
						{/* 라우팅 */}
						<Switch>
							<PrivateRoute path='/' component={Board} exact/>
							<PrivateRoute path='/add' component={Form} exact/>
							<PrivateRoute path='/edit/:id' component={Form}/>
							<PrivateRoute path='/view/:id' component={View}/>
							<Route path='/login' component={Login} exact/>
						</Switch>
					</Col>
				</Row>
			</Container>
		</>)
	}
}
