import React from 'react';

import style from './card.module.scss';

export default function Card({
	title,
	clear = null,
	marginBottom = '30px',
	blueGrey = null,
	gradient = null,
	gradientSize = 75,
	nopad = null,
	brand = null,
	children,
	...rest
}) {
	return (
		<div
			className={style.Card}
			data-clear={clear ? 1 : 0}
			data-blue-grey={blueGrey ? 1 : 0}
			data-brand={brand ? 1 : 0}
			data-nopad={nopad ? 1 : 0}
			data-gradient={gradient ? 1 : 0}
			style={{ marginBottom }}
			{...rest}>
			<div
				className={style.GradientBar}
				style={gradient ? { height: `${gradientSize}px` } : {}}
				data-gradient={gradient ? 1 : 0}
			/>
			<div>{title ? <p className={style.Label}>{title}</p> : null}</div>
			<div className={style.Content}>
				<div
					style={{
						position: 'relative',
						height: `${gradientSize + 30}px`,
						display: gradient ? 'block' : 'none',
					}}
				/>
				{children}
			</div>
		</div>
	);
}
