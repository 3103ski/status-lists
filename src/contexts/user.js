import React from 'react';

import { useHistory } from 'react-router-dom';
import { useApolloClient, useQuery, useMutation } from '@apollo/client';

import jwtDecode from 'jwt-decode';
import axios from 'axios';

import { updateObj } from '../util';
import { TOKEN_TITLE } from '../config.js';

import { LOGIN_SUCCES_REDIRECT, SERVER_URL, LOGIN } from '../routes.js';
import { GET_USER, REFRESH_TOKEN, UPDATE_USER_INFO, UPDATE_USER, UPLOAD_AVATAR, DELETE_USER_PICTURE } from '../gql';

const initialState = {
	token: null,
	userId: null,
	errorMsg: null,
	user: null,
	isLoading: false,
	isUploadingAvatar: false,
	uploadingAvatarError: null,
	darkMode: false,
	errors: {},
};

const CurrentUserContext = React.createContext(initialState);

const currentUserReducer = (state, { type, token, userId, errors, logoutTimer, darkMode, avatarError, user }) => {
	switch (type) {
		case 'AUTH_START':
			return updateObj(state, {
				userId: null,
				token: null,
				avatar: '',
				isLoading: true,
				errors: {},
			});
		case 'AUTH_SUCCESS':
			return updateObj(state, {
				token,
				userId,
				logoutTimer: logoutTimer,
				isLoading: false,
				user,
			});
		case 'AUTH_ERROR':
			return updateObj(state, {
				userId: null,
				token: null,
				avatar: '',
				isLoading: false,
				errors,
			});
		case 'UPLOAD_AVATAR_START':
			return updateObj(state, {
				isUploadingAvatar: true,
			});
		case 'UPLOAD_AVATAR_ERROR':
			return updateObj(state, {
				isUploadingAvatar: false,
				uploadingAvatarError: avatarError,
			});
		case 'UPLOAD_AVATAR_SUCCESS':
			return updateObj(state, {
				isUploadingAvatar: false,
			});
		case 'TOGGLE_DARK_MODE':
			return updateObj(state, {
				darkMode,
			});
		case 'SET_ERRORS':
			return updateObj(state, {
				isLoading: false,
				errors,
			});
		case 'CLEAR_ERRORS':
			return updateObj(state, {
				errors: {},
			});
		case 'REFRESH':
			return updateObj(state, {
				userId,
				token,
			});
		case 'LOGOUT':
			return initialState;
		default:
			return state;
	}
};

const CurrentUserProvider = (props) => {
	const history = useHistory();
	const client = useApolloClient();

	const [state, dispatch] = React.useReducer(currentUserReducer, initialState);

	/**••••••••••••• */
	/**	USER SETTING */
	/**••••••••••••• */
	const toggleDarkMode = (declaredState = null) => {
		return dispatch({ type: 'TOGGLE_DARK_MODE', darkMode: declaredState ? declaredState : !state.darkMode });
	};

	/**••••••••••••• */
	/**	AUTH METHODS */
	/**••••••••••••• */

	const authStart = () => dispatch({ type: 'AUTH_START', isLoading: true });

	const authSuccess = (token, userId, avatar, user) => {
		localStorage.setItem(TOKEN_TITLE, token);
		return dispatch({ type: 'AUTH_SUCCESS', token, userId, user });
	};

	const authError = (errors) => {
		localStorage.removeItem(TOKEN_TITLE);
		return dispatch({ type: 'AUTH_ERROR', errors });
	};

	/** ERRORS */
	const clearErrors = () => (Object.keys(state.errors).length > 0 ? dispatch({ type: 'CLEAR_ERRORS' }) : null);

	const setErrors = (errors) => {
		return dispatch({ type: 'SET_ERRORS', errors });
	};

	/** AUTHENTICATE */
	const authRegisterApi = async ({ authEndpoint, data, method = 'post', headers = {} }, history, callback) => {
		const url = await `${SERVER_URL}${authEndpoint}`;
		const hdrs = await {
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
		};

		console.log({ url });

		/** the 'history' value is flagging if this api call should be treated as a login success/fail
		 *  or an atttempt to just change data like auth email or update password
		 */

		if (history) await authStart();
		console.log('tried in the user context');

		return axios({ url, data, hdrs, method })
			.then(({ data: { success, token, user } }) => {
				if (success) {
					if (history) {
						authSuccess(token, user._id, user.info.avatar, user);
						if (callback) callback();
						return history.push(LOGIN_SUCCES_REDIRECT);
					}
				}
			})
			.catch((error) => {
				console.log({ msg: 'the stupid error made it a long way', error });
				if (error.response) {
					if (error.response.statusText === 'Unauthorized') {
						if (history) return authError({ password: 'The Email or Password you entered is incorrect' });
						return setErrors({ password: 'The Email or Password you entered is incorrect' });
					}
					if (error.response.data.errors) {
						if (error.response.statusText === 'Bad Request' || error.response.data.msg === 'MISSING_INPUT')
							return setErrors(error.response.data.errors);
						return authError(error.response.data.errors);
					}
					if (error.response.statusText === 'Bad Request')
						return setErrors({
							message: 'Something went wrong. Make sure you are entering real credentials',
						});
					console.log('This error was not correctly handled by auth.js context:: ', error.response);
				} else {
					console.log('This error has no response :: ', error.response);
				}
			});
	};

	function logout() {
		client.clearStore();
		localStorage.removeItem(TOKEN_TITLE);
		dispatch({ type: 'LOGOUT' });

		return client.resetStore();
	}

	function tokenErrorCheck(err) {
		if (err.message === 'Invalid/Expired token') {
			logout();
		}
	}

	/**••••••••••••• */
	/**	 USERS CRUD  */
	/**••••••••••••• */

	// >>>>>> UPDATING
	const [updateInfo, { loading: updatingUserInfo }] = useMutation(UPDATE_USER_INFO, {
		update(cache, { data: update }) {
			cache.updateQuery({ query: GET_USER, variables: { userId: update.updateUserInfo.id } }, (qd) => {
				if (qd) {
					return {
						user: {
							...qd.user,
							info: {
								...qd.user.info,
								...update.updateUserInfo.info,
							},
						},
					};
				}
			});
		},
	});

	const [updateUser, { loading: updatingUser }] = useMutation(UPDATE_USER, {
		update(cache, { data }) {
			cache.updateQuery({ query: GET_USER, variables: { userId: data.updateUser.id } }, (qd) => {
				return {
					user: {
						...qd.user,
						...data.updateUser,
					},
				};
			});
		},
	});

	function toggleIsPublic(callback) {
		updateUser({
			variables: {
				isPublic: !currentUser.user.isPublic,
			},
		});

		if (callback) {
			callback();
		}
	}

	function updateEmail(email, callback, handleError) {
		updateUser({
			variables: {
				email,
			},
			update() {
				if (callback) {
					callback();
				}
			},
			onError(err) {
				handleError(err);
			},
		});
	}

	// >>>>>> AVATAR

	const [newAvatar, { loading: uploadingAvatar }] = useMutation(UPLOAD_AVATAR);

	function uploadAvatar({ avatar, toggle = null }) {
		newAvatar({
			variables: { avatar },
			update(cache, { data }) {
				cache.updateQuery({ query: GET_USER, variables: { userId: state.userId } }, (qd) => {
					return {
						user: {
							...qd.user,
							...data.uploadAvatar,
						},
					};
				});
				if (toggle) {
					toggle(false);
				}
			},
			onError(error) {
				console.log('This error Uploading the Avatar :: ', error);
			},
		});
	}

	const [deletePicture, { loading: deletingPicture }] = useMutation(DELETE_USER_PICTURE, {
		update(cache, { data }) {
			cache.updateQuery({ query: GET_USER, variables: { userId: data.deletePicture.id } }, (qd) => {
				return {
					user: {
						...qd.user,
						info: {
							...qd.user.info,
							pictures: data.deletePicture.info.pictures,
							avatar: data.deletePicture.info.avatar,
							profileBanner: data.deletePicture.info.profileBanner,
						},
					},
				};
			});
		},
	});

	/**••••••••••••• */
	/**	 TOKEN MGMT  */
	/**••••••••••••• */

	const [refreshToken, { loading: refreshingToken }] = useMutation(REFRESH_TOKEN, {
		update(_, { data: { refreshToken: token } }) {
			// if there is no token, there is no user being checked
			if (token) {
				if (token.msg === 'refresh successful') {
					const decodedToken = jwtDecode(token.refreshToken);
					localStorage.setItem(TOKEN_TITLE, token.refreshToken);

					dispatch({
						type: 'REFRESH',
						token: token.refreshToken,
						userId: decodedToken._id,
					});
				}
				if (token.msg === 'invalid token') {
					dispatch({ type: 'LOGOUT' });
					history.push(LOGIN);
				}
			}
		},
		onError(err) {
			tokenErrorCheck(err);
		},
	});

	const {
		data: currentUser,
		loading: loadingCurrentUser,
		refetch: refetchUser,
	} = useQuery(GET_USER, {
		variables: { userId: state.userId },
		onError(err) {
			console.log('in user :: ', err);
		},
	});

	React.useEffect(() => {
		// check and refresh token on page refresh
		const storedToken = localStorage.getItem(TOKEN_TITLE);
		if (storedToken) {
			// we found a token in localStorage
			refreshToken({ variables: { token: storedToken } });
		}

		if (!storedToken && state.token) {
			// no token in local, but we had one in state
			refreshToken({ variables: { token: state.token } });
		}
		// ther was no token, we shouldnt be here; logout
		if (!storedToken && !state.token) {
			dispatch({ type: 'LOGOUT' });
		}
		// refetch the user with refreshed ID; user will be cached; persssion will not
		refetchUser();
	}, [refetchUser, refreshToken, state.token]);
	// eslint-disable-next-line react-hooks/exhaustive-deps

	/** Set User after auth returns a token and sets a userId from it */

	return (
		<CurrentUserContext.Provider
			value={{
				// >>>> Context State		•••••••
				loadingCurrentUser,
				updatingUserInfo,
				updatingUser,

				isLoading: state.isLoading,

				// Auth
				token: state.token,
				userId: state.userId,
				errors: state.errors,

				// User
				currentUser:
					currentUser && currentUser.user ? currentUser : { user: { info: { avatar: '', userId: null } } },

				uploadingAvatar,
				deletePicture,
				deletingPicture,

				// >>>> Exposed Methods		•••••••
				setErrors,
				clearErrors,
				uploadAvatar,
				updateInfo,
				toggleIsPublic,
				updateEmail,

				// Auth
				authRegisterApi,
				logout,

				// Token
				refreshToken,
				refreshingToken,
				tokenErrorCheck,

				// Settings
				darkMode: state.darkMode,
				toggleDarkMode,
			}}
			{...props}
		/>
	);
};

export { CurrentUserContext, CurrentUserProvider };
