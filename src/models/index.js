import getUser from './User';
import getTaskStatus from './TaskStatus';
import getTag from './Tag';

export default connect => ({
  User: getUser(connect),
  TaskStatus: getTaskStatus(connect),
  Tag: getTag(connect),
});
