function resizeCanvas(canvas) {
	const ratio = window.devicePixelRatio;

	canvas.width = window.innerWidth * ratio;
	canvas.height = window.innerHeight * ratio;
	canvas.style.width = window.innerWidth + "px";
	canvas.style.height = window.innerHeight + "px";

	const ctx = canvas.getContext("2d");

	ctx.scale(ratio, ratio);
}

const gcol = "hsl(0, 0%, 90%)";
const pcol = "black";
const scorecol = "black";

const playerx = 150;
const gy = 500;

const grav = 0.3;
const prad = 17;
const yspdMax = 5;
const yMax = gy - prad;
const jumpSpd = -10;

let player = {
	y: yMax,
	yspd: 0,
	bCollide: true,
};

function init(canvas) {
	const ctx = canvas.getContext("2d");

	// Draw ground
	ctx.fillStyle = gcol;
	ctx.fillRect(0, gy, window.innerWidth, canvas.height - gy);
}

const spikeGroups = [];
const spikeLen = 75;
const spikeHeight = spikeLen;
const spikeSpeed = 8;
const spikeHitboxLen = spikeLen / 2;
const spikeHitboxHeight = spikeHeight / 2;

function draw(canvas) {
	const ctx = canvas.getContext("2d");

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
	ctx.arc(playerx, player.y, prad, 0, Math.PI * 2);
	ctx.fill();

	// Draw spikes
	for (spikeGroup of spikeGroups) {
		for (let spikeIndex = 0; spikeIndex < spikeGroup.size; spikeIndex++) {
			let startPoint = spikeGroup.x + spikeIndex * spikeLen;
			ctx.beginPath();
			ctx.fillStyle = gcol;
			ctx.moveTo(startPoint, gy);
			ctx.lineTo(startPoint + spikeLen / 2, gy - spikeHeight);
			ctx.lineTo(startPoint + spikeLen, gy);
			ctx.lineTo(startPoint, gy);
			ctx.fill();
		}
	}

	updateSpikes();
	updateScore(canvas);

	// Detect spike collision
	if (player.y + prad > gy - spikeHitboxHeight) {
		for (spikeGroup of spikeGroups) {
			if (
				spikeGroup.x + spikeLen / 2 - spikeHitboxLen / 2 < playerx + prad &&
				spikeGroup.x +
					(spikeGroup.size - 1) * spikeLen +
					spikeLen / 2 +
					spikeHitboxLen / 2 >
					playerx
			) {
				clearInterval(drawIntervalID);
			}
		}
	}
}

function addSpikes() {
	spikeGroups.push({
		x: window.innerWidth,
		size: Math.ceil(Math.random() * 3),
	});
	setTimeout(addSpikes, Math.random() * 500 + 700);
}

function updateSpikes() {
	for (groupIndex in spikeGroups) {
		let group = spikeGroups[groupIndex];
		if (group.x + group.size * spikeLen < 0) {
			spikeGroups.splice(groupIndex, 1);
		} else {
			group.x -= spikeSpeed;
		}
	}
}

let score = 0;

function updateScore(canvas) {
	score += 1;
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = scorecol;
	ctx.font = "30px sans-serif";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillText(score, window.innerWidth / 2, 80);
}

let drawIntervalID = 0;

function main() {
	const canvas = document.getElementById("canvas");

	resizeCanvas(canvas);
	addEventListener("resize", () => {
		resizeCanvas(canvas);
	});

	init(canvas);
	drawIntervalID = setInterval(draw, 10, canvas);
	addSpikes();

	document.addEventListener("keydown", (event) => {
		if (event.key === "ArrowUp" && player.bCollide) {
			// Jump
			player.yspd += jumpSpd;
			player.bCollide = false;
		}
	});
}

main();
