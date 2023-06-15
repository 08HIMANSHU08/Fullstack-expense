

const express = require('express');

const router = express.Router();

const signupController = require('../controllers/sign');

const loginController = require('../controllers/login');

router.post('/signup',signupController.postSignup);
router.post('/login',loginController.postLogin);

module.exports = router;