import Sequelize from 'sequelize';
import encrypt from '../lib/secure';

export default connect => connect.define('User', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: { msg: "Wrong email's format" },
      notEmpty: { msg: 'Cannot be empty' },
    },
  },
  passwordDigest: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: { msg: 'Cannot be empty' },
    },
  },
  firstName: {
    type: Sequelize.STRING,
    // field: 'first_name',
    validate: {
      notEmpty: { msg: 'Cannot be empty' },
    },
  },
  lastName: {
    type: Sequelize.STRING,
    // field: 'last_name',
  },
  password: {
    type: Sequelize.VIRTUAL,
    set: function set(value) {
      this.setDataValue('passwordDigest', encrypt(value));
      this.setDataValue('password', value);
      return value;
    },
    validate: {
      len: { args: [3, +Infinity], msg: 'Must have at least 3 characters' },
    },
  },
}, {
  getterMethods: {
    fullName: function fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
  freezeTableName: true, // Model tableName will be the same as the model name
});
