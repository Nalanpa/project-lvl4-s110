import getUser from './User';
import getTaskStatus from './TaskStatus';

export default connect => ({
  User: getUser(connect),
  TaskStatus: getTaskStatus(connect),
});
