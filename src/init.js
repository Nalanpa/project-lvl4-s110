import connect from './db';
import getModels from './models';
import getTaskStatus from './models/TaskStatus';

export default async () => {
  const models = getModels(connect);
  await Promise.all(Object.values(models).map(model => model.sync()));

  const TaskStatus = getTaskStatus(connect);
  await TaskStatus.sync({ force: true });
  await TaskStatus.bulkCreate([
    { name: 'New' },
    { name: 'Processing' },
    { name: 'Testing' },
    { name: 'Done' },
  ]);
};
