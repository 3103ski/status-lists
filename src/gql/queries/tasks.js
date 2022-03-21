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
			projectOwner {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			createdBy {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			users {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			statuses {
				id
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
			projectOwner {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			createdBy {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			users {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			statuses {
				id
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
			projectOwner {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			createdBy {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			users {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			statuses {
				id
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
			projectOwner {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			createdBy {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			users {
				id
				info {
					avatar
					displayName
					firstName
					lastName
				}
			}
			statuses {
				id
			}
		}
	}
`;
