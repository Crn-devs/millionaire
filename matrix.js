const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const symbols = ['£', '$', '€', '₿', 'M', '1', '0', '💰'];

const fontSize = 24;
const columnSpacing = fontSize * 1.5;

let columns;
let drops = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  columns = Math.floor(canvas.width / columnSpacing);
  drops = Array(columns).fill(1);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let lastFrame = 0;
const frameDelay = 30; // bigger = slower

function draw(timestamp) {
  if (timestamp - lastFrame < frameDelay) {
    requestAnimationFrame(draw);
    return;
  }

  lastFrame = timestamp;

  // Longer trails
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    const x = i * columnSpacing;
    const y = drops[i] * fontSize;

    // Bright green
    ctx.fillStyle = '#22c55e';

    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 12;

    ctx.fillText(symbol, x, y);

    drops[i]++;

    if (y > canvas.height && Math.random() > 0.985) {
      drops[i] = 0;
    }
  }

  ctx.shadowBlur = 0;

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
