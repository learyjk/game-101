const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 30, 'blue');
player.draw();

function calculateAngle(x1, y1, x2, y2) {
  let diffX = x2 - x1;
  let diffY = y2 - y1;
  let angle = Math.atan2(diffY, diffX) * 180 / Math.PI;
  console.log(angle);
  return angle;
}

const projectiles = []
const enemies = []

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;

    let enemyX, enemyY;
    if (Math.random() < 0.5) {
      enemyX = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      enemyY = Math.random() * canvas.height;
    } else {
      enemyX = Math.random() * canvas.width;
      enemyY = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = 'green'
    const angle = calculateAngle(enemyX, enemyY, player.x, player.y)
    const velocity = { x: Math.cos(angle * Math.PI / 180), y: Math.sin(angle * Math.PI / 180) }
    enemies.push(new Enemy(enemyX, enemyY, radius, color, velocity))
  }, 1000)
}

function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  player.draw();
  projectiles.forEach(projectile => {
    projectile.update();
  });
  enemies.forEach(enemy => {
    enemy.update();
  });
}

const projectile = new Projectile(player.x, player.y, 5, 'red', { x: 1, y: 1 });
projectile.update();
// const projectile2 = new Projectile(player.x, player.y, 5, 'green', { x: 3, y: 3 });

addEventListener('click', (event) => {
  console.log('clicked!');
  let angle = calculateAngle(player.x, player.y, event.clientX, event.clientY)
  let velocity = { x: Math.cos(angle * Math.PI / 180), y: Math.sin(angle * Math.PI / 180) }
  projectiles.push(new Projectile(player.x, player.y, 5, 'red', velocity));
  console.log(angle);
  //projectile.draw();
});

animate();
spawnEnemies();
