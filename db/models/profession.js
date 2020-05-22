const Sequelize = require('sequelize')
const sequelize = require('../db.js')
const Form = require('../form');

const Profession = sequelize.define('prodession', {
    professionid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    profession: {
        type: Sequelize.ENUM,
        values: [
            'trainee',
            'dealer',
            'inspector',
            'manager',
            'pit_boss',
            'waiter',
            'barman']
    }
}, { timestamps: false });

const Form_Profession = sequelize.define('Form_Profession', {}, { timestamps: false });
Form.belongsToMany(Profession, { through: Form_Profession });
Profession.belongsToMany(Form, { through: Form_Profession });

module.exports = Profession;

// sequelize.sync({force:true}).then(()=>{
//     console.log("Tables have been created");
//   }).catch(err=>console.log(err));
  