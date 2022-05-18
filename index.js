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

const friction = 0.97;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw()
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 10, 'white');
player.draw();

const projectiles = []
const enemies = []
const particles = []

function calculateAngle(x1, y1, x2, y2) {
  let diffX = x2 - x1;
  let diffY = y2 - y1;
  let angle = Math.atan2(diffY, diffX) * 180 / Math.PI;
  return angle;
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`

    let enemyX, enemyY;
    if (Math.random() < 0.5) {
      enemyX = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      enemyY = Math.random() * canvas.height;
    } else {
      enemyX = Math.random() * canvas.width;
      enemyY = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const angle = calculateAngle(enemyX, enemyY, player.x, player.y)
    const velocity = { x: Math.cos(angle * Math.PI / 180), y: Math.sin(angle * Math.PI / 180) }
    enemies.push(new Enemy(enemyX, enemyY, radius, color, velocity))
  }, 1000)
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(30, 30, 30, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0.1) {
      particles.splice(index, 1);
    }
    particle.update()
  })
  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update();

    // remove from edges of screen
    if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
      setTimeout(() => { // setTimeout to wait until next frame to prevent flashing
        projectiles.splice(projectileIndex, 1)
      }, 0);
    }
  });
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    //enemy hits player
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      // projectile hits enemy
      if (dist - enemy.radius - projectile.radius < 1) {

        //create explosions
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {
            x: (Math.random() - 0.5) * (Math.random() * 5),
            y: (Math.random() - 0.5) * (Math.random() * 5),
          }))
        }
        if (enemy.radius - 10 > 5) {
          gsap.to(enemy, { radius: enemy.radius - 10 })
          setTimeout(() => { // setTimeout to wait until next frame to prevent flashing
            projectiles.splice(projectileIndex, 1)
          }, 0);
        } else {
          setTimeout(() => { // setTimeout to wait until next frame to prevent flashing
            enemies.splice(enemyIndex, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0);
        }
      }
    })
  });
}

// const projectile = new Projectile(player.x, player.y, 5, 'white', { x: 1, y: 1 });
// projectile.update();
// const projectile2 = new Projectile(player.x, player.y, 5, 'green', { x: 3, y: 3 });

addEventListener('click', (event) => {
  let angle = calculateAngle(player.x, player.y, event.clientX, event.clientY)
  let velocity = { x: Math.cos(angle * Math.PI / 180) * 5, y: Math.sin(angle * Math.PI / 180) * 5 }
  projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity));
});

animate();
spawnEnemies();
