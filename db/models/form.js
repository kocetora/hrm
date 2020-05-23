'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../db.js');

const Form = sequelize.define("form", {
    formid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { firstname: "firstname is required" },
        },
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { firstname: "secondname is required" },
        },
    },
    sex: {
        type: Sequelize.ENUM,
        values: ['male', 'female'],
        allowNull: false,
        validate: {
            notNull: { firstname: "sex is required" },
        },
    },
    born: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            notNull: { firstname: "birthdate is required" },
        },
    },
    height: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: { firstname: "height is required" },
        },
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { firstname: "phone is required" },
        },
    },  
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { firstname: "email is required" },
        },
    },
    education: {
        type: Sequelize.ENUM,
        values: [
            'primary', 
            'secondary', 
            'unfinished_higher', 
            'higher'],
        allowNull: false,
        validate: {
            notNull: { firstname: "education is required" },
        },
    },
    expectedSalary: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: { firstname: "salary is required" },
        },
    },
    prefferedRegion: {
        type: Sequelize.STRING,
    },
    workExperience: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: { firstname: "experience is required" },
        },
    },
    unemployedFor: {
        type: Sequelize.INTEGER
    },
    note: {
        type: Sequelize.TEXT
    },
}, { timestamps: false });

sequelize.sync({force:true}).then(()=>{
    console.log("Tables have been created");
  }).catch(err=>console.log(err));

module.exports = Form;

// const User = sequelize.define('user', {
//     userid: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     login: {
//         type: Sequelize.STRING
//     },
//     name: {
//         type: Sequelize.STRING
//     },
//     password: {
//         type: Sequelize.STRING
//     }
// }, { timestamps: false });

// const Comment = sequelize.define('comment', {
//     commentid: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     comment: {
//         type: Sequelize.TEXT
//     }
// }, { timestamps: false });

// Form.hasMany(Comment);
// User.hasMany(Comment);



