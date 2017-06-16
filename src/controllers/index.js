import welcome from './welcome';
import users from './users';
import session from './session';
import account from './account';
import taskStatuses from './task_statuses';
import tags from './tags';
import tasks from './tasks';
import tasksTags from './tasks_tags';

const controllers = [welcome, users, session, account, taskStatuses, tags, tasks, tasksTags];

export default (router, container) => controllers.forEach(f => f(router, container));
