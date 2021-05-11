const router = require('express').Router()
const controller = require('./controllers')
			cert = require('../../certification')

// 이미지 업로드 모듈
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// 게시글 CRUD
router.get('/:pk', cert.required, controller.getOne) // 파라미터 지정
router.get('/', cert.required, controller.getList)
router.put('/', cert.required, upload.single('image'), controller.put)
router.post('/', cert.required, upload.single('image'), controller.update)
router.delete('/', cert.required, controller.delete)
// 게시글 커멘트
router.post('/comment', cert.required, controller.comment)

module.exports = router
