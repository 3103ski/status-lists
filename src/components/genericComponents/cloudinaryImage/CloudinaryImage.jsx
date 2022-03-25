import React from 'react';

import { Icon } from '@iconify/react';

import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';
import { ICONIFY_NO_USER } from '../../../icons';
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default function CloudinaryImage({
	publicId,
	width = '100%',
	height = '',
	cloudname = 'bjastski-apps',
	round = null,
}) {
	return (
		<CloudinaryContext cloudName={cloudname}>
			{publicId ? (
				<Image
					style={{ display: 'flex', borderRadius: '100%' }}
					publicId={`${publicId}`}
					width={!height ? width : undefined}
					height={height ? height : undefined}>
					<Transformation aspectRatio='1.0' gravity='north' crop='fill' />
					{round && <Transformation radius='max' />}
				</Image>
			) : (
				<div style={{ width: '100%' }}>
					<Icon icon={ICONIFY_NO_USER} />
				</div>
			)}
		</CloudinaryContext>
	);
}
