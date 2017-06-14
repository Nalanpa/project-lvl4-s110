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
    { firstName: 'Elon', lastName: 'Musk', email: 'ElonMusk@station1.mars', password: '111' },
  ]);

  const dateConq = new Date(-45, 6, 1);
  const dateOS = new Date(1980, 5, 10);
  const datePayPal = new Date(1998, 3, 7);
  const dateTesla = new Date(2003, 6, 8);
  const dateMars = new Date(2014, 2, 17);


  await models.Task.bulkCreate([
    { name: 'Make good OS', description: '', statusId: 3, creatorId: 4, assignedToId: 4, createdAt: dateOS },
    { name: 'Conquer Europe', description: 'Build a greatest empire in the world', statusId: 4, creatorId: 1, assignedToId: 1, createdAt: dateConq },
    { name: 'Make PayPal', description: '', statusId: 4, creatorId: 5, assignedToId: 5, createdAt: datePayPal },
    { name: 'Make Tesla', description: '', statusId: 2, creatorId: 5, assignedToId: 5, createdAt: dateTesla },
    { name: 'Human colonization', description: 'Colonization of Mars', statusId: 1, creatorId: 5, createdAt: dateMars },
  ]);
};
