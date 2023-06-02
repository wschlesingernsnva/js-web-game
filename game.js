const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let stepTimeout = 0;
let spikeTimeout = 0;
let jumpTimeout = 0;

let resizeTimeout = 0;

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
let hue;
let gCol;
let bgCol;
let highScoreCol;
const pCol = "black";
const spikeCol = gCol;
const scoreCol = "black";

const player = {
	y: yMax,
	ySpd: 0,
	onGround: true,
};

let jumpKeyDown = false;

let score = 0;
let highScore = score;
let scoreUpdatable = false;
let playerDead = false;

let gameSpeed;
const gameSpeedMultiplier = 1.15;
let nextScore;
const nextScoreMultiplier = 1.5;

function setColors(hue) {
	gCol = `hsl(${hue}, 28.6%, 30.2%)`;
	bgCol = `hsl(${hue - 17}, 69.6%, 63.9%)`;
	highScoreCol = `hsl(${hue}, 19.6%, 22%)`;
}

function genHue() {
	return Math.random() * 255;
}

function updateColors() {
	setColors(hue);
}

function newColors() {
	hue = genHue();
	updateColors();
}

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

	// Jump
	if (player.onGround && jumpKeyDown) {
		player.ySpd += jumpSpd;
		player.onGround = false;
	}
}

function drawGround() {
	ctx.fillStyle = gCol;
	ctx.fillRect(0, gy, canvas.width, canvas.height);
}

function drawBG() {
	ctx.fillStyle = bgCol;
	ctx.fillRect(0, 0, canvas.width, gy);
}

function drawPlayer() {
	ctx.beginPath();
	ctx.fillStyle = pCol;
	ctx.arc(playerx, player.y, prad, 0, Math.PI * 2);
	ctx.fill();
}

function updateScore() {
	if (scoreUpdatable) {
		score += 1;
	}
	if (score >= nextScore) {
		gameSpeed *= gameSpeedMultiplier;
		nextScore *= nextScoreMultiplier;
	}
}

function drawScore() {
	const fontFamily = "sans-serif";

	ctx.textBaseline = "middle";
	ctx.textAlign = "center";

	ctx.font = "30px " + fontFamily;
	ctx.fillStyle = scoreCol;
	ctx.fillText(score, window.innerWidth / 2, 80);

	ctx.font = "20px " + fontFamily;
	ctx.fillStyle = highScoreCol;
	ctx.fillText(highScore, window.innerWidth / 2, 50);
}

function addSpikes() {
	spikeGroups.push({
		x: window.innerWidth,
		size: Math.ceil(Math.random() * 3),
	});
	spikeTimeout = setTimeout(addSpikes, (Math.random() * 600 + 850) / gameSpeed);
}

function onDeath() {
	playerDead = true;
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
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
	clearCanvas();

	hue += 0.01;
	if (hue > 255) {
		hue = 0;
	}
	updateColors();

	drawGround();
	drawBG();
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
	update();
	draw();

	if (!playerDead) {
		stepTimeout = setTimeout(step, 10 / gameSpeed);
	}
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
	gameSpeed = 1;
	nextScore = 500;

	spikeGroups.length = 0;

	score = 0;
	scoreUpdatable = false;

	player.y = yMax;
	player.ySpd = 0;
	player.onGround = true;

	resizeCanvas();
	newColors();

	addSpikes();
	step();

	playerDead = false;
}

function stopGame() {
	clearInterval(stepTimeout);
	clearInterval(spikeTimeout);
	clearInterval(jumpTimeout);
}

function reset() {
	stopGame();
	init();
}

function onResize() {
	clearInterval(resizeTimeout);
	resizeTimeout = setTimeout(reset, 50);
}

function main() {
	init();

	window.addEventListener("resize", onResize);

	// Jump
	document.addEventListener("keydown", (event) => {
		if (
			!jumpKeyDown &&
			(event.code === "ArrowUp" ||
				event.code === "Space" ||
				event.code === "KeyW")
		) {
			jumpKeyDown = true;
		}
	});
	document.addEventListener("keyup", (event) => {
		if (
			event.code === "ArrowUp" ||
			event.code === "Space" ||
			event.code === "KeyW"
		) {
			jumpKeyDown = false;
		}
	});
}

main();
