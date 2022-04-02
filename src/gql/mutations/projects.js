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

export const SWAP_PROJECT_POSITION = gql`
	mutation SwapProjectPosition(
		$projectId: ID
		$projectFolderId: ID
		$oldIndex: Int
		$newIndex: Int
		$oldFolder: Int
		$newFolder: Int
	) {
		swapProjectPosition(
			swapProjectInput: {
				projectFolderId: $projectFolderId
				projectId: $projectId
				oldIndex: $oldIndex
				newIndex: $newIndex
				oldFolder: $oldFolder
				newFolder: $newFolder
			}
		) {
			projectId
			oldIndex
			newIndex
			userId
		}
	}
`;
