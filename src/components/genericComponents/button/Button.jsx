import React from 'react';

import { Button } from 'semantic-ui-react';
import style from './button.module.scss';

export default function CustomButton({
	text,
	uppercase = false,
	letterSpacing = '0.03rem',
	weight = '500',
	children,
	hover,
	btnColor,
	customClass,
	...rest
}) {
	return (
		<Button
			className={`${style.Button} ${customClass}`}
			data-uppercase={uppercase ? 1 : 0}
			data-hover={hover}
			data-weight={weight}
			data-btncolor={btnColor}
			style={{ letterSpacing }}
			{...rest}>
			{text ? text : children}
		</Button>
	);
}

CustomButton.FadedSeeMore = ({ text = 'Learn More' }) => (
	<div className={style.SeeMoreBtn}>
		<p>{text}</p>
	</div>
);
