
const express = require('express');

const router = express.Router(); 

const expenseController = require('../controllers/expense');

const userAuthentication = require('../middlewares/auth');

router.post('/add-expense',userAuthentication.authenticate,expenseController.postExpense);

router.get('/get-expense',userAuthentication.authenticate,expenseController.getExpense);

router.delete('/delete-expense/:id',userAuthentication.authenticate,expenseController.deleteExpense);

module.exports = router;