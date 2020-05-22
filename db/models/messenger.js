const Sequelize = require('sequelize')
const sequelize = require('../db.js')
const Form = require('../form');

const Messenger = sequelize.define('messenger', {
    messengerid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    messenger: {
        type: Sequelize.ENUM,
        values: [
            'Telegram', 
            'Viber', 
            'WhatsApp']
    },
    info: {
        type: Sequelize.STRING
    }
}, { timestamps: false });

const Form_Messenger = sequelize.define('Form_Messenger', {}, { timestamps: false });
Form.belongsToMany(Messenger, { through: Form_Messenger });
Messenger.belongsToMany(Form, { through: Form_Messenger });

module.exports = Messenger;
    