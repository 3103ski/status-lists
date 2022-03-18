import { gql } from '@apollo/client';

//====================================

export const REFRESH_TOKEN = gql`
	mutation RefreshToken($token: String) {
		refreshToken(token: $token) {
			refreshToken
			msg
		}
	}
`;

export const UPDATE_USER = gql`
	mutation updateUser($email: String, $isPublic: Boolean) {
		updateUser(updateUserInput: { email: $email, isPublic: $isPublic }) {
			id
			email
			isPublic
			createdAt
		}
	}
`;

export const UPLOAD_AVATAR = gql`
	mutation uploadAvatar($avatar: String) {
		uploadAvatar(avatar: $avatar) {
			id
			info {
				displayName
				userId
				avatar
			}
		}
	}
`;

export const UPDATE_USER_INFO = gql`
	mutation updateUserInfo(
		$displayName: String
		$firstName: String
		$lastName: String
		$location: String
		$bio: String
		$avatar: String
		$profileBanner: String
	) {
		updateUserInfo(
			updateUserInfoInput: {
				firstName: $firstName
				lastName: $lastName
				displayName: $displayName
				location: $location
				bio: $bio
				avatar: $avatar
				profileBanner: $profileBanner
			}
		) {
			id
			isPublic
			info {
				userId
				firstName
				lastName
				displayName
				profileBanner
				pictures
				avatar
				location
				bio
			}
		}
	}
`;

export const DELETE_USER_PICTURE = gql`
	mutation DeleteUserPicture($image: String) {
		deletePicture(image: $image) {
			id
			isPublic
			info {
				userId
				displayName
				profileBanner
				pictures
				avatar
			}
		}
	}
`;
