/**
 *  TOGGLE_MATCH_CHILD_HEIGHT
 *
 *  ** Will toggle a div's height between zero and its child node
 *
 *  ** Helpful for toggling height of wrapper with transition
 *
 * - Must have ONE child node.
 * - Padding must be on child node.
 */
export const toggleMatchChildHeight = async (wrapperID, open) => {
	let wrapper = await document.getElementById(wrapperID);
	if (wrapper) {
		wrapper.style.transition = '.18s';
		let children = await wrapper.children;
		if (children.length === 1) {
			let child = await children.item(0);
			if (open === true) {
				wrapper.style.height = `${child.getBoundingClientRect().height}px`;
			} else {
				wrapper.style.height = `0px`;
			}
		}
	}
};
