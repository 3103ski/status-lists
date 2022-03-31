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
			label {
				id
				userId
				color
				label
			}
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
		$label: ID
		$taskId: ID
	) {
		updatedTask(
			taskInput: {
				title: $title
				notes: $notes
				isComplete: $isComplete
				archived: $archived
				label: $label
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
			label {
				id
				userId
				color
				label
			}
			attentionFlag
			createdAt
			projectOwner
			users
			createdBy
		}
	}
`;

export const SWAP_TASK_POS = gql`
	mutation SwapTaskPos($projectId: ID, $oldIndex: Int, $newIndex: Int) {
		swapTaskPos(swapTaskInput: { projectId: $projectId, oldIndex: $oldIndex, newIndex: $newIndex }) {
			projectId
			oldIndex
			newIndex
		}
	}
`;
