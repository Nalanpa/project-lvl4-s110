import Sequelize from 'sequelize';

// Task (name, description, status, creator, assignedTo, tags)
// name: обязательно
// description: не обязательно
// status: обязательно, по умолчанию 'новый'. Список берется из справочника TaskStatus
// creator: обязательно, автор задачи
// assignedTo: тот на кого поставлена задача
// tags: связь m2m с тегами

export default connect => connect.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Cannot be empty' },
    },
  },
  description: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Cannot be empty' },
    },
  },
  creator: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  assignedTo: {
  },
  tags: {
  },
}, {
  freezeTableName: true,
});
