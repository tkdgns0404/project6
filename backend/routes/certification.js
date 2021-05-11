var jwt = require('express-jwt') // JWT 인증 모듈
var secret = require('../config').secret // 시크릿키

// 헤더에서 토큰 분리하여 리턴
function getTokenFromHeader(req) {
	if (!req || !req.headers) return false
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  }

  return null
}

// 인증 옵션
var auth = {
	// 기본 요구
	required: jwt({
    secret: secret,
    userProperty: 'payload',
		getToken: getTokenFromHeader,
		algorithms: ['HS256']
	})
}

module.exports = auth
