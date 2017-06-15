import Sequelize from 'sequelize';
import moment from 'moment';

export default connect => connect.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Cannot be empty' },
    },
  },
  description: {
    type: Sequelize.TEXT,
  },
  statusId: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  creatorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  assignedToId: {
    type: Sequelize.INTEGER,
  },
}, {
  getterMethods: {
    created: function created() {
      return moment(this.createdAt).format('MMMM Do Y, h:mm:ss a');
    },
    createdShort: function createdShort() {
      return moment(this.createdAt).format('YYYY/MM/DD');
    },
  },
  freezeTableName: true,
});
