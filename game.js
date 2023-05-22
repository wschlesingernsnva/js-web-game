function resizeCanvas(canvas) {
	const ratio = window.devicePixelRatio;

	canvas.width = window.innerWidth * ratio;
	canvas.height = window.innerHeight * ratio;
	canvas.style.width = window.innerWidth + "px";
	canvas.style.height = window.innerHeight + "px";

	let ctx = canvas.getContext("2d");

	ctx.scale(ratio, ratio);
}

function draw(canvas) {
	let ctx = canvas.getContext("2d");
}

function main() {
	const canvas = document.getElementById("canvas");

	resizeCanvas(canvas);
	addEventListener("resize", () => {
		resizeCanvas(canvas);
	});

	setInterval(draw, 10, canvas);
}

main();
