function resizeCanvas(canvas) {
	const ratio = window.devicePixelRatio;

	canvas.width = window.innerWidth * ratio;
	canvas.height = window.innerHeight * ratio;
	canvas.style.width = window.innerWidth + "px";
	canvas.style.height = window.innerHeight + "px";

	let ctx = canvas.getContext("2d");

	ctx.scale(ratio, ratio);
}

const gcol = "hsl(0, 0%, 90%)";
const pcol = "hsl(0, 0%, 0%)";

const gy = 500;

const grav = 0.5;
const prad = 17;
const yspdMax = 5;
const yMax = gy - prad;
const jumpSpd = -12;

let player = {
	y: yMax,
	yspd: 0,
	bCollide: true,
};

function init(canvas) {
	let ctx = canvas.getContext("2d");

	// Draw ground
	ctx.fillStyle = gcol;
	ctx.fillRect(0, gy, canvas.width, canvas.height - gy);
}

function draw(canvas) {
	let ctx = canvas.getContext("2d");

	// Calculate player y
	let newy = player.y + player.yspd;
	if (newy >= yMax) {
		player.y = yMax;
		player.yspd = 0;
		player.bCollide = true;
	} else {
		player.yspd += grav;
		player.y = newy;
	}

	// Reset canvas
	ctx.clearRect(0, 0, canvas.width, gy);

	// Draw player
	ctx.beginPath();
	ctx.fillStyle = pcol;
	ctx.arc(150, player.y, prad, 0, Math.PI * 2);
	ctx.fill();
}

function main() {
	const canvas = document.getElementById("canvas");

	resizeCanvas(canvas);
	addEventListener("resize", () => {
		resizeCanvas(canvas);
	});

	init(canvas);
	setInterval(draw, 10, canvas);

	document.addEventListener("keydown", (event) => {
		if (event.key === "ArrowUp" && player.bCollide) {
			// Jump
			player.yspd += jumpSpd;
			player.bCollide = false;
		}
	});
}

main();
