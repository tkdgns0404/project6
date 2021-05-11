import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

// 메인 파일들
import App from './App'
import './assets/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// 라우팅을 포함하여 #root에 렌더링
ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
  document.getElementById('root')
)
