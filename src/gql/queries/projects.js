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
				title
				id
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
