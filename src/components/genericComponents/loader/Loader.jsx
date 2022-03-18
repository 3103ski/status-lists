import React from 'react';

import { Dimmer, Loader } from 'semantic-ui-react';
import style from './loader.module.scss';

export default function CustomSemanticUILoader({ loadingText = 'Loading' }) {
	return (
		<Dimmer active inverted className={style.Dimmer}>
			<Loader content={loadingText} />
		</Dimmer>
	);
}
