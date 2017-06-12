import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// import User from '../models/User';
// import Task from '../models/Task';
// import TaskStatus from '../models/TaskStatus';
// import Tag from '../models/Tag';

dotenv.config();

export default new Sequelize(process.env.DATABASE_URL);

// Task.belongsTo(User);
// User.hasMany(Task);
