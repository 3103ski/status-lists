//~~~
import React, { useContext } from 'react';
//~~~
import GoogleLogin from 'react-google-login';
import icon from './google.png';
//~~~
import { GOOGLE_CLIENT_ID, USE_OAUTH } from '../../../../config';
import { Button } from '../../../../components';
import { GOOGLE_AUTH } from '../../../../routes.js';
import { CurrentUserContext } from '../../../../contexts/';
//~~~
import style from '../oAuthButtons.module.scss';
//~~~

export default function GoogleAuthButton({ history }) {
	const { authRegisterApi } = useContext(CurrentUserContext);

	const googleResponseCallback = ({ tokenId, error, details }) => {
		if (tokenId && tokenId !== -1) {
			const authEndpoint = GOOGLE_AUTH + tokenId;
			return authRegisterApi({ authEndpoint, method: 'get' }, history);
		}
	};
	return USE_OAUTH.google ? (
		<GoogleLogin
			clientId={GOOGLE_CLIENT_ID}
			render={(renderProps) => (
				<Button customClass={`${style.GoogleBtn} ${style.OAuthBtn}`} onClick={renderProps.onClick}>
					<img src={icon} alt='google logo' />
					Login With Google
				</Button>
			)}
			onSuccess={googleResponseCallback}
			onFailure={googleResponseCallback}
		/>
	) : null;
}
