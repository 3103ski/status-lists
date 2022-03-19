import React from 'react';

import StatusListItem from './statusListItem/StatusListItem';

import * as style from './statusList.module.scss';

export default function StatusList() {
	return (
		<div className={style.Container}>
			<div className={style.ListWrapper}>
				<StatusListItem
					first={true}
					even={1}
					text={`They got the stuff from person but black ble`}
					date={'03/21/2022 @ 4:21pm'}
				/>
				<StatusListItem
					even={0}
					text={`I packed it up now somebody prepare the goods`}
					date={'03/21/2022 @ 6:45pm'}
				/>
				<StatusListItem even={1} text={`I got this done and its good to go`} date={'03/22/2022 @ 8:45am'} />
				<StatusListItem even={0} text={`I got this done and its good to go`} date={'03/22/2022 @ 8:45am'} />
			</div>
		</div>
	);
}
