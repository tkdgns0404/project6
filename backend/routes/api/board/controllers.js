const oracledb = require('oracledb')
const config = require('../../../config')
oracledb.autoCommit = true

// # APIs
exports.getList = async (req, res, next) => {
	let { search, page } = req.query // query에서 데이터를 읽어옴
	const perPage = 10 // perPage값 지정
	page = page ? parseInt(page) - 1 : 0 // page Int 처리
	
	// Oracle DB에 연결
	const db = await oracledb.getConnection(config.db)
	// 검색데이터가 있을 경우 쿼리에 추가, 페이징 구문
	const query = `SELECT T.* FROM ( 
		SELECT T.*, rowNum as rowIndex FROM
		(SELECT * FROM post ${search ? `WHERE user_name LIKE '%${search}%'` : ''})T ORDER BY PK DESC
	)T
		WHERE ${search ? `user_name LIKE '%${search}%' AND ` : ''}rowIndex > ${page * perPage} AND rowIndex <= ${(page+1) * perPage}`

	const result = await db.execute(query)
	// 총 갯수 확인
	const count = await db.execute(`SELECT COUNT(*) FROM BOARD ${search ? `WHERE WRITER LIKE '%${search}%' ` : ''}`)
	db.close() // db close
	
	let data = [] // 결과 데이터
	for(let i = 0; i < result.rows.length; i++) {
		// 데이터를 읽어와 결과값에 추가
		const val = result.rows[i]
		data.push({
			no: val[6],
			id: val[0],
			user_id: val[1],
			user_name: val[2],
			title: val[3],
			content: val[4],
			image: val[5],
		})
	}
	
	// 값 리턴
	return res.json({ data, count: count.rows[0][0], page: page+1, perPage })
}

exports.getOne = async (req, res, next) => {
	const { pk } = req.params // pk를 파라미터에서 읽어옴
	// 예외처리
	if(!pk) return res.status(400).json({ msg: '잘못된 접근입니다' })

	// Oracle DB에 연결
	const db = await oracledb.getConnection(config.db)
	const query = `SELECT * FROM POST WHERE pk=${pk}` // 데이터를 읽어옴
	const result = await db.execute(query)
	
	// 예외처리
	if(!result.rows.length) return res.status(400).json({ msg: '잘못된 접근입니다' })
	// 코멘트 정보를 읽어옴
	const comment = await db.execute(`SELECT good, star FROM POST_COMMENT WHERE post_pk=${pk} and user_pk=${req.payload.pk}`)
	db.close() // db close
	
	const val = result.rows[0] // 게시글 정보
	const com = comment.rows.length ? comment.rows[0] : [0, 0] // 코멘트 정보
	// 결과 리턴
	return res.json({
		id: val[0],
		user_id: val[1],
		user_name: val[2],
		title: val[3],
		content: val[4],
		image: val[5],
		good: com[0],
		star: com[1],
	})
}

exports.put = async (req, res) => {
	const { title, content } = req.body // body에서 데이터를 읽어옴
	const user = req.payload // JWT 토큰에서 사용자 데이터를 읽어옴
	// 예외처리
	if(!title || !content) return res.status(400).json({ msg: '데이터가 부족합니다' })

	// Oracle DB에 연결
	const db = await oracledb.getConnection(config.db)
	const query = `INSERT INTO POST VALUES(POST_SEQ.nextval, '${user.id}', '${user.name}', '${title}', '${content}', '${req.file ? req.file.filename : ''}')`
	const result = await db.execute(query)
	db.close() // db close

	// 리턴
	return res.json({ msg: '게시글을 생성하였습니다' })
}

exports.update = async (req, res) => {
	const { pk, title, content } = req.body // body에서 데이터를 읽어옴
	// 예외처리
	if(!pk) return res.status(400).json({ msg: '잘못된 접근입니다' })

	// 업데이트 데이터
	let update = {}
	if(title) update.title = title
	if(content) update.content = content
	if(req.file) update.image = req.file.filename

	// 쿼리문 생성
	let arr = []
	for(key in update) arr.push(`${key}='${update[key]}'`)

	// Oracle DB에 연결
	const db = await oracledb.getConnection(config.db)
	const query = `UPDATE POST SET ${arr.join(',')} WHERE pk=${pk}`
	const result = await db.execute(query)
	db.close() // db close

	// 리턴
	return res.json({ msg: '게시글을 수정하였습니다' })
}

exports.delete = async (req, res) => {
	const { pk } = req.body // body에서 데이터를 읽어옴
	// 예외처리
	if(!pk) return res.status(400).json({ msg: '잘못된 접근입니다' })

	// Oracle DB에 연결
	const db = await oracledb.getConnection(config.db)
	const query = `DELETE FROM POST WHERE pk IN (${typeof(pk) == 'object' ? pk.join(',') : pk})` // 삭제 구문
	const result = await db.execute(query)
	db.close() // db close

	// 리턴
	return res.json({ msg: '게시글을 삭제하였습니다' })
}

exports.comment = async (req, res) => {
	const { pk, good, star } = req.body // body에서 데이터를 읽어옴
	const id = req.payload.pk // JWT 사용자 정보에서 pk를 읽어옴
	const selector = `post_pk=${pk} and user_pk=${id}` // 선택자 따로 지정

	// 예외처리
	if(!pk) return res.status(400).json({ msg: '잘못된 접근입니다' })

	// Oracle DB에 연결
	const db = await oracledb.getConnection(config.db)
	const query = `SELECT * FROM POST_COMMENT WHERE ${selector}` // 가존 코멘트 데이터를 읽어옴
	const exist = await db.execute(query)
	
	// 기존 데이터가 있으면 업데이트, 없는 경우 새로 생성
	if(exist.rows.length) await db.execute(`UPDATE POST_COMMENT SET good=${good}, star=${star} WHERE ${selector}`)
	else await db.execute(`INSERT INTO POST_COMMENT VALUES(${pk}, ${id}, ${good}, ${star})`)
	db.close() // db close


	// 리턴
	return res.json({ msg: '코멘트를 수정하였습니다' })
}