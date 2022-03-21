// Users
export { GET_USERS, GET_USER, GET_USER_INFO } from './queries/users.js';
export { UPDATE_USER, UPLOAD_AVATAR, UPDATE_USER_INFO, REFRESH_TOKEN, DELETE_USER_PICTURE } from './mutations/users.js';

// Projects
export { GET_PROJECT, GET_USER_PROJECTS } from './queries/projects';
export { NEW_PROJECT, UPDATED_PROJECT } from './mutations/projects';

//Tasks
export { GET_TASK, GET_PROJECT_TASKS, GET_TASKS_CREATED_BY_USER, GET_USER_TASKS } from './queries/tasks';
export { NEW_TASK, UPDATED_TASK } from './mutations/tasks';
