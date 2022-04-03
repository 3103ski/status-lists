import gql from 'graphql-tag';

export const GET_USERS = gql`
	query GetUsersList {
		users {
			id
			googleId
			info {
				avatar
				displayName
				firstName
				lastName
				location
				bio
				pictures
				userId
				profileBanner
			}
			createdAt
		}
	}
`;

export const GET_USER = gql`
	query GetUser($userId: ID) {
		user(userId: $userId) {
			id
			email
			isPublic
			googleId
			projectFolder {
				id
				projects {
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
						archived
						isComplete
						label {
							label
							color
							id
							userId
						}
						attentionFlag
						createdAt
						users
					}
					createdAt
				}
			}
			preferences {
				id
				showDaysSinceTaskUpdate
				autoBell
				daysUntilAutoBell
				bellUpgradeToClock
				daysUntilBellUpgrade
				removeBellOnNewStatus
				showLabelColorsInNav
				showLabelsInTaskLinks
			}
			info {
				displayName
				userId
				location
				firstName
				lastName
				pictures
				bio
				profileBanner
				avatar
			}
			labels {
				label
				color
				id
				userId
			}
		}
	}
`;

export const GET_USER_INFO = gql`
	query GetUserInfo($userId: ID) {
		user(userId: $userId) {
			id
			projects {
				id
				title
			}
			info {
				userId
				displayName
				pictures
				firstName
				lastName
				location
				bio
				profileBanner
				avatar
			}
		}
	}
`;
