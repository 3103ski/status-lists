import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollTop() {
	const routePath = useLocation();

	const toTop = () => {
		let view = document.getElementById('view-container');

		if (view) {
			view.scrollTo(0, 0);
		}
	};

	useEffect(() => {
		toTop();
	}, [routePath]);
	return null;
}
