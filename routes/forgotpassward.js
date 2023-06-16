
const express = require('express');

const router = express.Router(); 

const forgotPasswardController = require('../controllers/forgot');

const userAuthentication = require('../middlewares/auth');

router.post('/forgotpassward',forgotPasswardController.postForgetPassword);

module.exports = router;