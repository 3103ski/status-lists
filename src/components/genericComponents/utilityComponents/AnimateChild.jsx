import React from 'react';
import { Transition } from 'semantic-ui-react';

export function AnimateChild({ duration = 500, animation = 'fade', children }) {
	const [visible, setVisible] = React.useState(false);

	React.useEffect(() => {
		if (!visible) {
			setVisible(true);
		}
	}, [visible]);

	return (
		<Transition duration={duration} visible={visible} animation={animation}>
			<div>{children}</div>
		</Transition>
	);
}
