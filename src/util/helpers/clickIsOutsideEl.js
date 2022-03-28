export default function clickIsOutside(e, id, callback) {
	const el = document.getElementById(id);
	let clickX = e.clientX;
	let clickY = e.clientY;

	let elTop = el.getBoundingClientRect().top;
	let elRight = el.getBoundingClientRect().right;
	let elBottom = el.getBoundingClientRect().bottom;
	let elLeft = el.getBoundingClientRect().left;

	console.log({
		clickX,
		clickY,
		elBottom,
		elTop,
		elRight,
		elLeft,
	});

	if (clickX < elLeft || clickX > elRight || clickY < elTop || clickY > elBottom) {
		callback();
	}
}
