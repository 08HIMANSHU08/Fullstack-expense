

const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize=require('./util/database');

var cors = require('cors');

const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());

app.set('view engine','ejs')
app.set('views','views')

app.use(bodyParser.json({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.use('/user',adminRoutes)

app.use(errorController.get404)

sequelize.sync()
.then(result=>{
    app.listen(3000)
})
.catch(err=>{console.log(err)});
