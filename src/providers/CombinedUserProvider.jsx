import React from 'react';

import { CurrentUserProvider } from '../contexts/';

export default function CombinedUserProvider({ children, ...rest }) {
	return <CurrentUserProvider {...rest}>{children}</CurrentUserProvider>;
}
