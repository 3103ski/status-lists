import React from 'react';

import { Rating as SemanticRating } from 'semantic-ui-react';
import style from './rating.module.scss';

export default function Rating({ stats = null, rating = 1, size = 'large', maxRating = 5, onRate = null, ...rest }) {
	return React.useMemo(
		() => (
			<div className={style.RatingContainer} data-rating-size={size}>
				<SemanticRating
					rating={stats ? stats.ratingAvg : rating}
					icon='star'
					maxRating={maxRating}
					size={size}
					onRate={onRate}
					disabled={onRate === null ? true : false}
					{...rest}
				/>
				{stats ? <p>{parseInt(stats.ratingCount) > 0 ? stats.ratingCount : '0'} reviews</p> : null}
			</div>
		),
		[maxRating, onRate, rating, rest, size, stats]
	);
}
