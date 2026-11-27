(() => {
  const form = document.getElementById('b2bv-score');
  if (!form) return;
  const weights = Array.from(form.querySelectorAll('[data-weight]'));
  const ratings = Array.from(form.querySelectorAll('[data-rating]'));
  const gates = Array.from(form.querySelectorAll('[data-gate]'));
  const points = form.querySelector('[data-score-result]');
  const decision = form.querySelector('[data-gate-result]');
  const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
  const weightFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 });

  function calculate(focusInvalid = false) {
    const invalid = weights.filter(input => !input.validity.valid || !Number.isFinite(input.valueAsNumber));
    for (const weight of weights) {
      if (invalid.includes(weight)) weight.setAttribute('aria-invalid', 'true');
      else weight.removeAttribute('aria-invalid');
    }

    const weightTotal = weights.reduce((sum, input) => sum + input.valueAsNumber, 0);
    const missingRating = ratings.find(select => select.value === '');
    const scored = invalid.length === 0 && Math.abs(weightTotal - 100) < 0.0001 && !missingRating;

    if (invalid.length) {
      points.textContent = 'Use a weight between 0% and 100% for each dimension.';
      if (focusInvalid) invalid[0].focus();
    } else if (Math.abs(weightTotal - 100) >= 0.0001) {
      points.textContent = 'Weights must total 100%. Current total ' + weightFormatter.format(weightTotal) + '%.';
      if (focusInvalid) weights[0].focus();
    } else if (missingRating) {
      points.textContent = 'Score incomplete. Assess all eight dimensions, including any weighted at 0%.';
      if (focusInvalid) missingRating.focus();
    } else {
      const score = weights.reduce((sum, input, index) => sum + input.valueAsNumber * Number(ratings[index].value) / 5, 0);
      points.textContent = formatter.format(score) + '/100 on evidence.';
    }

    if (gates.some(select => select.value === 'fail')) {
      decision.textContent = 'Hold launch. At least one mandatory gate failed.';
    } else if (gates.some(select => select.value !== 'pass')) {
      decision.textContent = 'Hold launch. Verify every mandatory gate.';
    } else {
      decision.textContent = scored ? 'All gates passed. Eligible for buyer review.' : 'All gates passed. Complete scoring for buyer review.';
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    calculate(true);
  });
  form.addEventListener('input', () => {
    points.textContent = 'Calculate to update the score and gate decision.';
    decision.textContent = '';
  });
  form.hidden = false;
  calculate();
})();
