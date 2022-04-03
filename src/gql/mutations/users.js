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

export const UPDATE_USER_PREFERENCES = gql`
	mutation UpdateUserPreferences(
		$showDaysSinceTaskUpdate: Boolean
		$autoBell: Boolean
		$daysUntilAutoBell: Int
		$bellUpgradeToClock: Boolean
		$daysUntilBellUpgrade: Int
		$removeBellOnNewStatus: Boolean
		$showLabelColorsInNav: Boolean
		$showLabelsInTaskLinks: Boolean
	) {
		updateUserPreferences(
			userPreferencesInput: {
				showDaysSinceTaskUpdate: $showDaysSinceTaskUpdate
				autoBell: $autoBell
				daysUntilAutoBell: $daysUntilAutoBell
				daysUntilBellUpgrade: $daysUntilBellUpgrade
				bellUpgradeToClock: $bellUpgradeToClock
				removeBellOnNewStatus: $removeBellOnNewStatus
				showLabelColorsInNav: $showLabelColorsInNav
				showLabelsInTaskLinks: $showLabelsInTaskLinks
			}
		) {
			id
			userId
			showDaysSinceTaskUpdate
			autoBell
			daysUntilAutoBell
			bellUpgradeToClock
			daysUntilBellUpgrade
			removeBellOnNewStatus
			showLabelColorsInNav
			showLabelsInTaskLinks
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

export const CREATE_LABEL = gql`
	mutation CreateLabel($label: String, $color: String, $addToTaskId: ID) {
		label(label: $label, color: $color, addToTaskId: $addToTaskId) {
			id
			label
			color
			userId
		}
	}
`;

export const UPDATE_LABEL = gql`
	mutation UpdateLabel($label: String, $color: String, $labelId: ID) {
		updatedLabel(updateLabelInput: { label: $label, color: $color, labelId: $labelId }) {
			id
			label
			color
			userId
		}
	}
`;

export const DELETE_LABEL = gql`
	mutation DeleteLabel($labelId: ID) {
		deletedLabel(labelId: $labelId) {
			id
			label
			color
			userId
		}
	}
`;
