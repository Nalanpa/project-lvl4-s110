import _ from 'lodash';

const getTagsString = async (task) => {
  const unsortedTags = await task.getTags();
  const tags = _.sortBy(unsortedTags, ['name']);
  if (!tags) return '';

  return tags.reduce((result, tag) => `${result}, ${tag.name}`, '').substr(2);
};


const getUsers = async (User, id) => {
  const unsortedUsers = await User.findAll();
  const users = _.sortBy(unsortedUsers, ['firstName']);
  return users.map((user) => {
    if (id && user.id === id) {
      return { id: user.id, name: '<< me >>' };
    }
    return { id: user.id, name: user.fullName };
  });
};

const getFilters = (query, { User, TaskStatus, Tag }) => {
  if (!query) return {};
  const filters = [];
  const creator = Number(query.creator);
  const assignedTo = Number(query.assignedTo);
  const status = Number(query.status);
  const tag = query.tag;

  if (creator && creator > 0) {
    filters.push({ model: User, as: 'creator', where: { id: creator } });
  }
  if (assignedTo && assignedTo > 0) {
    filters.push({ model: User, as: 'assignedTo', where: { id: assignedTo } });
  }
  if (status && status > 0) {
    filters.push({ model: TaskStatus, as: 'status', where: { id: status } });
  }
  if (tag) {
    filters.push({ model: Tag, where: { name: { $like: `%${tag}%` } } });
  }
  return { include: filters };
};

const getTitle = async (query, { User, TaskStatus }) => {
  let title = 'Tasks';
  if (!query) return title;

  const creatorId = Number(query.creator);
  const assignedToId = Number(query.assignedTo);
  const statusId = Number(query.status);
  const tag = query.tag;

  if (creatorId && creatorId > 0) {
    const creator = await User.findById(creatorId);
    title = `${title} created by '${creator.fullName}'`;
  }
  if (assignedToId && assignedToId > 0) {
    const worker = await User.findById(assignedToId);
    title = `${title} assigned to '${worker.fullName}'`;
  }
  if (statusId && statusId > 0) {
    const status = await TaskStatus.findById(statusId);
    title = `${title} with status '${status.name}'`;
  }
  if (tag) {
    title = `${title} with tags like '${tag}'`;
  }

  return title;
};

export { getTitle, getUsers, getFilters, getTagsString };
