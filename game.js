const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let stepInterval = 0;
let spikeTimeout = 0;

// Ground
const gy = 500;

// Player
const playerx = 150;
const prad = 17;
const ySpdMax = 5;
const yMax = gy - prad;
const jumpSpd = -10;
const grav = 0.3;

// Spikes
let spikeGroups = [];
const spikeLen = 75;
const spikeHeight = spikeLen;
const spikeSpeed = 8;
const spikeHitboxLen = spikeLen / 2;
const spikeHitboxHeight = spikeHeight / 2;

// Colors
const gCol = "hsl(0, 0%, 90%)";
const pCol = "black";
const spikeCol = gCol;
const scoreCol = "black";
const highScoreCol = "hsl(0, 0%, 80%)";

const player = {
	y: yMax,
	ySpd: 0,
	onGround: true,
};

let score = 0;
let highScore = score;
let scoreUpdatable = false;

function updatePlayer() {
	let yNew = player.y + player.ySpd;
	if (yNew >= yMax) {
		player.y = yMax;
		player.ySpd = 0;
		player.onGround = true;
	} else {
		player.ySpd += grav;
		player.y = yNew;
	}
}

function drawPlayer() {
	ctx.beginPath();
	ctx.fillStyle = pCol;
	ctx.arc(playerx, player.y, prad, 0, Math.PI * 2);
	ctx.fill();
}

function drawGround() {
	ctx.fillStyle = gCol;
	ctx.fillRect(0, gy, window.innerWidth, canvas.height - gy);
}

function updateScore() {
	if (scoreUpdatable) {
		score += 1;
	}
}

function drawScore() {
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";

	ctx.font = "30px sans-serif";
	ctx.fillStyle = scoreCol;
	ctx.fillText(score, window.innerWidth / 2, 80);

	ctx.font = "20px sans-serif";
	ctx.fillStyle = highScoreCol;
	ctx.fillText(highScore, window.innerWidth / 2, 50);
}

function addSpikes() {
	spikeGroups.push({
		x: window.innerWidth,
		size: Math.ceil(Math.random() * 3),
	});
	spikeTimeout = setTimeout(addSpikes, Math.random() * 500 + 700);
}

function onDeath() {
	if (score > highScore) {
		highScore = score;
	}
	reset();
}

function detectSpikeCollision() {
	if (player.y + prad > gy - spikeHitboxHeight) {
		for (spikeGroup of spikeGroups) {
			let boxLeft = spikeGroup.x + spikeLen / 2 - spikeHitboxLen / 2;
			let boxRight =
				spikeGroup.x +
				(spikeGroup.size - 1) * spikeLen +
				spikeLen / 2 +
				spikeHitboxLen / 2;
			if (boxLeft < playerx + prad && boxRight > playerx) {
				onDeath();
			}
		}
	}
}

function updateSpikes() {
	for (groupIndex in spikeGroups) {
		let group = spikeGroups[groupIndex];

		if (!scoreUpdatable && group.x < playerx) {
			scoreUpdatable = true;
		}

		if (group.x + group.size * spikeLen < 0) {
			spikeGroups.splice(groupIndex, 1);
		} else {
			group.x -= spikeSpeed;
		}
	}

	detectSpikeCollision();
}

function drawSpikes() {
	for (spikeGroup of spikeGroups) {
		for (let spikeIndex = 0; spikeIndex < spikeGroup.size; spikeIndex++) {
			let startPoint = spikeGroup.x + spikeIndex * spikeLen;
			ctx.beginPath();
			ctx.fillStyle = gCol;
			ctx.moveTo(startPoint, gy);
			ctx.lineTo(startPoint + spikeLen / 2, gy - spikeHeight);
			ctx.lineTo(startPoint + spikeLen, gy);
			ctx.lineTo(startPoint, gy);
			ctx.fill();
		}
	}
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, gy);
}

function draw() {
	clearCanvas();

	drawPlayer();
	drawSpikes();
	drawScore();
}

function update() {
	updatePlayer();
	updateSpikes();
	updateScore();
}

function step() {
	draw();
	update();
}

function resizeCanvas() {
	const ratio = window.devicePixelRatio;

	canvas.width = window.innerWidth * ratio;
	canvas.height = window.innerHeight * ratio;
	canvas.style.width = window.innerWidth + "px";
	canvas.style.height = window.innerHeight + "px";

	ctx.scale(ratio, ratio);
}

function init() {
	resizeCanvas();
	drawGround();
	addSpikes();

	stepInterval = setInterval(step, 10);
}

function clearIntervals() {
	clearInterval(stepInterval);
	clearInterval(spikeTimeout);
}

function reset() {
	spikeGroups.length = 0;

	score = 0;
	player.y = yMax;
	player.ySpd = 0;
	player.onGround = true;
	clearIntervals();
	init();
}

function main() {
	init();

	window.addEventListener("resize", reset);

	// Jump
	document.addEventListener("keydown", (event) => {
		if (event.key === "ArrowUp" && player.onGround) {
			player.ySpd += jumpSpd;
			player.onGround = false;
		}
	});
}

main();
