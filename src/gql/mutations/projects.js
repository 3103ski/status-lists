import gql from 'graphql-tag';

export const NEW_PROJECT = gql`
	mutation NewProject($title: String, $notes: String) {
		newProject(projectInput: { title: $title, notes: $notes }) {
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
export const UPDATED_PROJECT = gql`
	mutation UpdateProject($title: String, $notes: String, $isArchived: Boolean, $projectId: ID) {
		updatedProject(projectInput: { title: $title, notes: $notes, isArchived: $isArchived }, projectId: $projectId) {
			id
			owner
			users
			title
			notes
			isArchived
			bellCount
			createdAt
		}
	}
`;
