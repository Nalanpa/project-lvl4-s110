import Sequelize from 'sequelize';

export default connect => connect.define('TaskStatus', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      notEmpty: { msg: 'Cannot be empty' },
    },
  },
}, {
  freezeTableName: true,
  timestamps: false,
});
