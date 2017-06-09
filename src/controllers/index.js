import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import account from './account';
import taskStatuses from './task_statuses';

const controllers = [welcome, users, sessions, account, taskStatuses];

export default (router, container) => controllers.forEach(f => f(router, container));
