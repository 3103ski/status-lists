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
		}
	}
`;

export const GET_USER_INFO = gql`
	query GetUserInfo($userId: ID) {
		user(userId: $userId) {
			id
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
