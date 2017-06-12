import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);
  await Promise.all(Object.values(models).map(model => model.sync({ force: true })));

  await models.TaskStatus.bulkCreate([
    { id: 1, name: 'New' },
    { name: 'Processing' },
    { name: 'Testing' },
    { name: 'Done' },
  ]);

  await models.User.bulkCreate([
    { firstName: 'Julius', lastName: 'Caesar', email: 'julius@ancient.rome', password: '111' },
    { firstName: 'Vladimir', lastName: 'Putin', email: 'vvp@kremlin.ru', password: '111' },
    { firstName: 'Epifan', lastName: 'Lykov', email: 'epifan@syberia.ru', password: '111' },
    { firstName: 'Bill', lastName: 'Gates', email: 'billy@microsoft.com', password: '111' },
  ]);
};
