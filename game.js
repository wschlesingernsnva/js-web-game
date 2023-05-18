function resizeCanvas(canvas) {
	const ratio = window.devicePixelRatio;

	canvas.width = window.innerWidth * ratio;
	canvas.height = window.innerHeight * ratio;
	canvas.style.width = window.innerWidth + "px";
	canvas.style.height = window.innerHeight + "px";

	let ctx = canvas.getContext("2d");

	ctx.scale(ratio, ratio);
}

let mousex = 0;
let mousey = 0;
let start = false;

function fadeOut(canvas) {
	let ctx = canvas.getContext("2d");

	ctx.beginPath();
	ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalCompositeOperation = "source-over";
}

let hue = 0;

function draw(canvas) {
	let ctx = canvas.getContext("2d");

	ctx.beginPath();
	ctx.strokeStyle = "hsl(" + hue + ", 100%, 50%)";
	if (hue < 360) {
		hue++;
	} else {
		hue = 0;
	}
	ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
	ctx.lineTo(mousex, mousey);
	ctx.stroke();
}

function main() {
	const canvas = document.getElementById("canvas");

	resizeCanvas(canvas);
	addEventListener("resize", () => {
		resizeCanvas(canvas);
	});

	addEventListener("mousemove", (event) => {
		if (!start) {
			setInterval(fadeOut, 10, canvas);
			setInterval(draw, 10, canvas);
			start = true;
		}

		mousex = event.clientX;
		mousey = event.clientY;
	});
}

main();
