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
    { firstName: 'Ilon', lastName: 'Mask', email: 'IlonMask@station1.mars', password: '111' },
  ]);

  const date = new Date(-45, 6, 1);

  await models.Task.bulkCreate([
    { name: 'Make good OS', description: '', statusId: 3, creatorId: 4, assignedToId: 4 },
    { name: 'Conquer Europe', description: '...almost whole', statusId: 4, creatorId: 1, assignedToId: 1, createdAt: date },
    { name: 'Make PayPal', description: '', statusId: 4, creatorId: 5, assignedToId: 5 },
    { name: 'Make Tesla', description: '', statusId: 2, creatorId: 5, assignedToId: 5 },
  ]);
};
