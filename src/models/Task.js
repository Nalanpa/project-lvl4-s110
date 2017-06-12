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
    allowNull: false,
  },
}, {
  getterMethods: {
    created: function created() {
      return moment(this.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    },
    status: async function statusName() {
      const status = await this.getStatus();
      return status.dataValues.name;
    },
  },
  freezeTableName: true,
});
