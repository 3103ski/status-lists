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
				archived
				isComplete
				listExpanded
				attentionFlag
				label {
					id
					userId
					color
					label
				}
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
