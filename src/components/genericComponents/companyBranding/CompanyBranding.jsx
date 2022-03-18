import React from 'react';
import { Link } from 'react-router-dom';

import * as style from './companyBranding.module.scss';

import { LANDING } from '../../../routes';

export default function CompanyBranding({ inverted = null }) {
	return (
		<Link className={style.BrandContainer} to={LANDING} data-inverted={inverted ? 1 : 0}>
			<div className={style.LogoWrapper}>
				<div className={style.LogoText} data-logo-color={1}>
					<p className={style.Mix}>MIX</p>
					<p className={style.Studios}>STUDIOS</p>
				</div>
			</div>
			<div className={style.LogoText}>
				<p className={style.Mix}>MIX</p>
				<p className={style.Studios}>STUDIOS</p>
			</div>
		</Link>
	);
}
