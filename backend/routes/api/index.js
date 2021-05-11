const router = require('express').Router()

// 기능별 /users, /board 라우팅
router.use('/user', require('./user'))
router.use('/board', require('./board'))

module.exports = router
