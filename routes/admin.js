

const express = require('express');

const router = express.Router();

const signupController = require('../controllers/sign');

const loginController = require('../controllers/login');

router.post('/signup',signupController.postSignup);
router.post('/login',loginController.postLogin);

// router.post('/add-expense',expenseController.postExpense);

// router.get('/get-expense',expenseController.getExpense);

// router.delete('/delete-expense/:id',expenseController.deleteExpense);

// router.put('/edit-expense/:id',expenseController.editExpense);

module.exports = router;