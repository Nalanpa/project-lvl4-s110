import getUser from './User';
import getTaskStatus from './TaskStatus';
import getTag from './Tag';
import getTask from './Task';

export default connect => ({
  User: getUser(connect),
  TaskStatus: getTaskStatus(connect),
  Tag: getTag(connect),
  Task: getTask(connect),
});
