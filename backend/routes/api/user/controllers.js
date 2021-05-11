const jwt = require('jsonwebtoken') // 인증 모듈
const oracledb = require('oracledb') // 오라클 모듈
const config = require('../../../config') // 설정파일
oracledb.autoCommit = true // DB 설정

// # APIs
exports.login = async (req, res, next) => {
	const { id, password } = req.body // 바디에서 데이터를 읽어옴
	// 예외처리
	if(!id || !password) return res.status(422).json({ msg: '필수로 요구되는 항목입니다' })

	// Oracle DB에 연결
	const db = await oracledb.getConnection(config.db)
	const query = `SELECT * FROM MEMBER WHERE ID='${id}' AND PASSWORD='${password}'` // 사용자 정보 체크
	const result = await db.execute(query)
	db.close() // db close

	// 계정이 올바르지 않은 경우
	if(!result.rows.length) return res.status(400).json({ msg: '일치하는 계정이 없습니다' })
	
	// 인증정보 생성
	const user = result.rows[0]
	const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

	// 토큰 생성
  const token = jwt.sign({
		pk: user[0],
		id: user[1],
		name: user[3],
		exp: parseInt(exp.getTime() / 1000),
  }, config.secret)

	// 결과 리턴
	return res.json({
		msg: '로그인하였습니다',
		token, name: user[3],
	})
}
