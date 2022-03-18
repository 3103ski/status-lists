import React from 'react';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~ Other Package Imports
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default function CloudinaryImage({
	publicId,
	width = '100%',
	height = '',
	cloudname = 'mixstudios',
	round = null,
}) {
	return (
		<CloudinaryContext cloudName={cloudname}>
			<Image
				style={{ display: 'flex', borderRadius: '5px' }}
				publicId={`${publicId}`}
				width={!height ? width : undefined}
				height={height ? height : undefined}>
				<Transformation aspectRatio='1.0' gravity='north' crop='fill' />
				{round && <Transformation radius='max' />}
			</Image>
		</CloudinaryContext>
	);
}
