const router = require('express').Router()
const controller = require('./controllers')

// [POST] /login 요청시 호출
router.post('/login', controller.login)

module.exports = router
