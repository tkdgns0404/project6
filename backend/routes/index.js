const router = require('express').Router()

// 기본 / 라우팅
router.use('/', require('./api'))

module.exports = router
