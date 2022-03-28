import gql from 'graphql-tag';

export const NEW_TASK = gql`
	mutation NewTask($title: String, $notes: String, $projectId: ID) {
		newTask(taskInput: { title: $title, notes: $notes }, projectId: $projectId) {
			id
			title
			notes
			project
			isComplete
			archived
			attentionFlag
			createdAt
			projectOwner
			listExpanded
			users
			createdBy
			statuses {
				id
				text
				task
				projectOwner
				taskCreator
				createdBy
				likes {
					id
					userId
					likedStatusId
					createdAt
				}
			}
		}
	}
`;

export const UPDATE_TASK = gql`
	mutation UpdateTask(
		$title: String
		$notes: String
		$isComplete: Boolean
		$archived: Boolean
		$attentionFlag: Boolean
		$listExpanded: Boolean
		$taskId: ID
	) {
		updatedTask(
			taskInput: {
				title: $title
				notes: $notes
				isComplete: $isComplete
				archived: $archived
				attentionFlag: $attentionFlag
				listExpanded: $listExpanded
			}
			taskId: $taskId
		) {
			id
			title
			notes
			project
			isComplete
			listExpanded
			archived
			attentionFlag
			createdAt
			projectOwner
			users
			createdBy
		}
	}
`;
