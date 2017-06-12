import Sequelize from 'sequelize';

export default connect => connect.define('Tag', {
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
