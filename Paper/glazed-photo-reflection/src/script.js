[...document.querySelectorAll('figure')].forEach(e => {
	const move = (_x, _y) => {
		const { clientWidth: width, clientHeight: height } = e;
		const [x, y] = [_x / width, _y / height].map(e => e * 2 - 1);
		e.style.setProperty('--x', x);
		e.style.setProperty('--y', y);
	};
	
	e.addEventListener('mousemove', ({ offsetX: _x, offsetY: _y }) => move(_x, _y));
	e.addEventListener('touchmove', ({touches}) => {
		const { x, y } = e.getBoundingClientRect();
		move(touches[0].clientX - x, touches[0].clientY - y);
	});
	
})