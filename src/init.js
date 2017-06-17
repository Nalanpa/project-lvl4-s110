import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);
  // await Promise.all(Object.values(models).map(model => model.sync({ force: true })));

  await models.TaskStatus.sync({ force: true });
  await models.Tag.sync({ force: true });
  await models.User.sync({ force: true });
  await models.Task.sync({ force: true });
  await models.TaskTag.sync({ force: true });

  await models.TaskStatus.bulkCreate([
    { id: 1, name: 'New' },
    { id: 2, name: 'Processing' },
    { id: 3, name: 'Testing' },
    { id: 4, name: 'Done' },
  ]);

  // Test data following

  await models.User.bulkCreate([
    { firstName: 'Julius', lastName: 'Caesar', email: 'julius@ancient.rome', password: '111' },
    { firstName: 'Vladimir', lastName: 'Putin', email: 'vvp@kremlin.ru', password: '111' },
    { firstName: 'Epifan', lastName: 'Lykov', email: 'epifan@syberia.ru', password: '111' },
    { firstName: 'Bill', lastName: 'Gates', email: 'billy@microsoft.com', password: '111' },
    { firstName: 'Elon', lastName: 'Musk', email: 'ElonMusk@station1.mars', password: '111' },
    { firstName: 'Creator of everything', lastName: '', email: 'god@univer.sum', password: '111' },
  ]);

  const dateConq = new Date(-45, 6, 1);
  const dateOS = new Date(1980, 5, 10);
  const datePayPal = new Date(1998, 3, 7);
  const dateTesla = new Date(2003, 6, 8);
  const dateMars = new Date(2014, 2, 17);
  const dateSave = new Date(2000, 1, 1);


  await models.Task.bulkCreate([
    { name: 'Make good OS', description: 'OS for everybody', statusId: 3, creatorId: 4, assignedToId: 4, createdAt: dateOS },
    { name: 'Conquer Europe', description: 'Build a greatest empire in the world', statusId: 4, creatorId: 6, assignedToId: 1, createdAt: dateConq },
    { name: 'Make PayPal', description: 'Make best payment system', statusId: 4, creatorId: 5, assignedToId: 5, createdAt: datePayPal },
    { name: 'Make Tesla', description: 'Electro car', statusId: 2, creatorId: 5, assignedToId: 5, createdAt: dateTesla },
    { name: 'Human colonization', description: 'Colonization of Mars', statusId: 1, creatorId: 6, assignedToId: 5, createdAt: dateMars },
    { name: 'Save Russia', description: '', statusId: 3, creatorId: 6, assignedToId: 2, createdAt: dateSave },
  ]);

  await models.Tag.bulkCreate([
    { name: 'Important' },
    { name: 'Very important' },
    { name: 'Urgent' },
    { name: 'Learning' },
    { name: 'For fun' },
  ]);

  await models.TaskTag.bulkCreate([
    { TaskId: 6, TagId: 3 },
    { TaskId: 4, TagId: 4 },
    { TaskId: 4, TagId: 5 },
    { TaskId: 2, TagId: 5 },
    { TaskId: 5, TagId: 4 },
    { TaskId: 1, TagId: 1 },
  ]);
};
