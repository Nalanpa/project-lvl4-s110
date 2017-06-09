import welcome from './welcome';
import users from './users';
import session from './session';
import taskStatuses from './task_statuses';

const controllers = [welcome, users, session, taskStatuses];

export default (router, container) => controllers.forEach(f => f(router, container));
