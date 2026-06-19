// =========================
// MATRIX MONEY BACKGROUND
// =========================

const canvas = document.querySelector('#moneyCanvas');
const ctx = canvas.getContext('2d');

const symbols = ['£', '£', '£', '$', '$', '€', '₿', 'M', '1', '0', '💰'];

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

let frameDelay = 50;
let lastFrame = 0;

function draw(timestamp) {
  if (timestamp - lastFrame < frameDelay) {
    requestAnimationFrame(draw);
    return;
  }

  lastFrame = timestamp;

  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    const x = i * columnSpacing;
    const y = drops[i] * fontSize;

    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;

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

// =========================
// MILLIONAIRE CALCULATOR
// =========================

const TARGET = 1_000_000;
const ANNUAL_RETURN = 0.07;

function calculateProjection(monthlySavings, years) {
  // More accurate monthly rate equivalent to 7% annual
  const monthlyReturn = Math.pow(1 + ANNUAL_RETURN, 1 / 12) - 1;

  const months = years * 12;

  const portfolioValue =
    monthlySavings *
    ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);

  const contributions = monthlySavings * months;

  const gains = portfolioValue - contributions;

  return {
    portfolioValue,
    contributions,
    gains,
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateRequiredMonthlySavings(years) {
  const monthlyReturn = Math.pow(1 + ANNUAL_RETURN, 1 / 12) - 1;

  const months = years * 12;

  return TARGET / ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
}

// =========================
// FORM HANDLER
// =========================

const form = document.getElementById('millionaireForm');
const resultContent = document.getElementById('resultContent');
const resultSection = document.getElementById('result');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const currentAge = Number(document.getElementById('currentAge').value);

  const monthlySavings = Number(
    document.getElementById('monthlySavings').value,
  );

  const retirementValue = document.getElementById('retirementTarget').value;

  if (!currentAge || !monthlySavings) {
    alert('Please complete all fields.');
    return;
  }

  let retirementAge;

  if (retirementValue === 'kids') {
    retirementAge = currentAge + 100;
  } else {
    retirementAge = Number(retirementValue);
  }

  const years = retirementAge - currentAge;

  if (years <= 0) {
    resultContent.innerHTML = `
      <h2 class="text-3xl font-black text-red-400 mb-4">
        🤔 Time Machine Required
      </h2>

      <p>
        Retirement age must be greater than your current age.
      </p>
    `;

    return;
  }

  // Speed up matrix while "thinking"
  frameDelay = 15;

  resultContent.innerHTML = `
    <div class="animate-pulse">
      <h2 class="text-3xl font-black text-green-400">
        Calculating your millionaire destiny...
      </h2>
    </div>
  `;

  resultSection.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });

  setTimeout(() => {
    frameDelay = 50;

    const projection = calculateProjection(monthlySavings, years);

    const futureValue = projection.portfolioValue;
    const WIN_MARGIN = 5000;

    const millionaire = futureValue >= TARGET - WIN_MARGIN;
    const difference = Math.abs(TARGET - futureValue);

    const requiredMonthlySavings = calculateRequiredMonthlySavings(years);

    const additionalMonthlySavings = Math.max(
      0,
      requiredMonthlySavings - monthlySavings,
    );

    console.log({
      requiredMonthlySavings,
      monthlySavings,
      futureValue,
    });

    result.classList.remove('hidden');

    if (millionaire) {
      resultContent.innerHTML = `
        <h2 class="text-5xl font-black text-green-400 mb-4">
          🎉 YOU WIN!
        </h2>

        <p class="text-lg text-gray-300 mb-6">
          By age ${retirementAge}, your portfolio could grow to:
        </p>

        <p class="text-6xl font-black text-green-300 mb-6">
          ${formatCurrency(futureValue)}
        </p>

        <div class="space-y-2 text-left max-w-sm mx-auto mb-6">
          <div class="flex justify-between">
            <span>Total Invested:</span>
            <span>${formatCurrency(projection.contributions)}</span>
          </div>

          <div class="flex justify-between">
            <span>Market Growth:</span>
            <span>${formatCurrency(projection.gains)}</span>
          </div>
        </div>

        <p class="text-green-200">
          Congratulations. You beat the game and became a millionaire.
        </p>

        <div class="mt-6 text-sm text-gray-400">
          Assumes a 7% annual inflation-adjusted return.
        </div>
      `;
    } else {
      resultContent.innerHTML = `
        <h2 class="text-5xl font-black text-red-400 mb-4">
          ❌ GAME OVER
        </h2>

        <p class="text-lg text-gray-300 mb-6">
          By age ${retirementAge}, your portfolio could grow to:
        </p>

        <p class="text-5xl font-black mb-6">
          ${formatCurrency(futureValue)}
        </p>

        <div class="space-y-2 text-left max-w-sm mx-auto mb-6">
          <div class="flex justify-between">
            <span>Total Invested:</span>
            <span>${formatCurrency(projection.contributions)}</span>
          </div>

          <div class="flex justify-between">
            <span>Market Growth:</span>
            <span>${formatCurrency(projection.gains)}</span>
          </div>
        </div>

        <p class="text-xl text-red-300">
          You missed millionaire status by
        </p>

        <p class="text-4xl font-black text-red-400 mt-2">
          ${formatCurrency(difference)}
        </p>

        <p class="text-xl text-red-300 mt-6">
        To become a millionaire by age ${retirementAge},
        you'd need to invest:
        </p>

        <p class="text-4xl font-black text-green-400 mt-2">
        ${formatCurrency(requiredMonthlySavings)}
        / month
        </p>

        <p class="text-gray-300 mt-4">
        That's an extra
        <strong>${formatCurrency(additionalMonthlySavings)}</strong>
        each month.
        </p>

        <div class="mt-6 text-sm text-gray-400">
          Assumes a 7% annual inflation-adjusted return.
        </div>
      `;
    }
  }, 2000);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('Service Worker Registered');
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
