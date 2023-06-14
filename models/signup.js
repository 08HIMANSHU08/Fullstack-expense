
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const SignUp = sequelize.define('signup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    name:Sequelize.STRING,
    email:Sequelize.STRING,
    passward:Sequelize.STRING,
});


module.exports = SignUp;
