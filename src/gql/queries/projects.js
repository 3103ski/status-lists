import gql from 'graphql-tag';

export const GET_PROJECT = gql`
	query GetProject($projectId: ID) {
		project(projectId: $projectId) {
			id
			owner
			users
			title
			notes
			isArchived
			bellCount
			tasks {
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
			createdAt
		}
	}
`;

export const GET_USER_PROJECTS = gql`
	query GetUserProjects {
		userProjects {
			id
			owner
			users
			title
			notes
			isArchived
			bellCount
			tasks {
				title
				id
			}
			createdAt
		}
	}
`;
