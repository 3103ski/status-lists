import gql from 'graphql-tag';

export const NEW_TASK = gql`
	mutation NewTask($title: String, $notes: String, $projectId: ID) {
		newTask(taskInput: { title: $title, notes: $notes }, projectId: $projectId) {
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
export const UPDATED_TASK = gql`
	mutation UpdateTask($title: String, $notes: String, $isComplete: Boolean, $attentionFlag: Boolean) {
		updatedTask(
			taskInput: { title: $title, notes: $notes, isComplete: $isComplete, attentionFlag: $attentionFlag }
		) {
			id
			title
			notes
			project
			isComplete
			attentionFlag
			createdAt
		}
	}
`;
