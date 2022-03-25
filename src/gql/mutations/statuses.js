import gql from 'graphql-tag';

export const NEW_STATUS = gql`
	mutation NewStatus($text: String, $taskId: ID) {
		newStatus(statusInput: { text: $text }, taskId: $taskId) {
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
`;

export const LIKE_STATUS = gql`
	mutation LikeStatus($statusId: ID) {
		likeStatus(statusId: $statusId) {
			id
			likes {
				id
				userId
				likedStatusId
				createdAt
			}
		}
	}
`;

export const UNLIKE_STATUS = gql`
	mutation UnlikeStatus($statusId: ID) {
		unlikeStatus(statusId: $statusId) {
			id
			likes {
				id
				userId
				likedStatusId
				createdAt
			}
		}
	}
`;
