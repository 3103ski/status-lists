import gql from 'graphql-tag';

export const GET_TASK = gql`
	query GetTask($taskId: ID) {
		task(taskId: $taskId) {
			id
			title
			notes
			project
			isComplete
			attentionFlag
			createdAt
			projectOwner
			createdBy
			users
			statuses {
				id
				projectOwner
				taskCreator
				createdBy
				text
				task
				likes {
					id
				}
				createdAt
			}
		}
	}
`;

export const GET_PROJECT_TASKS = gql`
	query GetProjectTasks($projectId: ID) {
		projectTasks(projectId: $projectId) {
			id
			title
			notes
			project
			isComplete
			attentionFlag
			createdAt
			projectOwner
			createdBy
			users
			statuses {
				id
				projectOwner
				taskCreator
				createdBy
				text
				task
				likes {
					id
				}
				createdAt
			}
		}
	}
`;

export const GET_USER_TASKS = gql`
	query GetAllOfAUsersTasks {
		userTasks {
			id
			title
			notes
			project
			isComplete
			attentionFlag
			createdAt
			projectOwner
			createdBy
			users
			statuses {
				id
				projectOwner
				taskCreator
				createdBy
				text
				task
				likes {
					id
				}
				createdAt
			}
		}
	}
`;

export const GET_TASKS_CREATED_BY_USER = gql`
	query GetAllTasksCreatedByUser {
		tasksCreatedByUser {
			id
			title
			notes
			project
			isComplete
			attentionFlag
			createdAt
			projectOwner
			createdBy
			users
			statuses {
				id
				projectOwner
				taskCreator
				createdBy
				text
				task
				likes {
					id
				}
				createdAt
			}
		}
	}
`;
