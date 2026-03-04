const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 100,
  y: 300,
  width: 40,
  height: 40,
  dy: 0,
  gravity: 0.6,
  jumpPower: -12,
  grounded: false
};

let platforms = [
  { x: 0, y: 360, width: 800, height: 40 },
  { x: 300, y: 280, width: 120, height: 20 },
  { x: 550, y: 220, width: 120, height: 20 }
];

let coins = [
  { x: 340, y: 240, size: 15 },
  { x: 590, y: 180, size: 15 }
];

let score = 0;

// BUTTON STEUERUNG
document.getElementById("leftBtn").onclick = () => player.x -= 20;
document.getElementById("rightBtn").onclick = () => player.x += 20;
document.getElementById("jumpBtn").onclick = () => {
  if (player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
};

function drawPlayer() {
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = "green";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

function drawCoins() {
  ctx.fillStyle = "gold";
  coins.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function update() {
  player.dy += player.gravity;
  player.y += player.dy;

  player.grounded = false;

  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y < p.y + p.height &&
      player.y + player.height > p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.grounded = true;
    }
  });

  // Münzen sammeln
  coins = coins.filter(c => {
    const dx = player.x + player.width/2 - c.x;
    const dy = player.y + player.height/2 - c.y;
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance < 25) {
      score++;
      return false;
    }
    return true;
  });

  // Game Over
  if (player.y > canvas.height) {
    alert("Game Over! Punkte: " + score);
    location.reload();
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Punkte: " + score, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  drawPlatforms();
  drawCoins();
  drawPlayer();
  drawScore();

  requestAnimationFrame(gameLoop);
}

gameLoop();
