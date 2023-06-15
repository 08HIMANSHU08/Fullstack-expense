

const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize=require('./util/database');

var cors = require('cors');

const SignUp = require('./models/signup');
const Expense = require('./models/expensetable');

const adminRoutes = require('./routes/admin');
const expenseRoutes = require('./routes/expenseapp');
const purchaseRoutes = require('./routes/purchase');
const Order = require('./models/order');
const app = express();

app.use(cors());

app.set('view engine','ejs')
app.set('views','views')

app.use(bodyParser.json({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.use('/user',adminRoutes)

app.use('/expense',expenseRoutes);

app.use('/purchase',purchaseRoutes);

app.use(errorController.get404)

SignUp.hasMany(Expense);
Expense.belongsTo(SignUp);

SignUp.hasMany(Order);
Order.belongsTo(SignUp);

sequelize.sync()
.then(result=>{
    app.listen(3000)
})
.catch(err=>{console.log(err)});
