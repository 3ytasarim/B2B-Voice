(() => {
  const form = document.getElementById('b2bv-score');
  if (!form) return;
  const weights = Array.from(form.querySelectorAll('[data-weight]'));
  const ratings = Array.from(form.querySelectorAll('[data-rating]'));
  const gates = Array.from(form.querySelectorAll('[data-gate]'));
  const points = form.querySelector('[data-score-result]');
  const decision = form.querySelector('[data-gate-result]');
  const formatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 });

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
      points.textContent = 'Geben Sie für jede Dimension eine Gewichtung zwischen 0 % und 100 % an.';
      if (focusInvalid) invalid[0].focus();
    } else if (Math.abs(weightTotal - 100) >= 0.0001) {
      points.textContent = 'Die Gewichtungen müssen zusammen 100 % ergeben. Aktuelle Summe ' + formatter.format(weightTotal) + ' %.';
      if (focusInvalid) weights[0].focus();
    } else if (missingRating) {
      points.textContent = 'Bewertung unvollständig. Bewerten Sie alle sechs Dimensionen, auch solche mit einer Gewichtung von 0 %.';
      if (focusInvalid) missingRating.focus();
    } else {
      const score = weights.reduce((sum, input, index) => sum + input.valueAsNumber * Number(ratings[index].value) / 5, 0);
      points.textContent = formatter.format(score) + '/100 auf Basis von Nachweisen.';
    }

    if (gates.some(select => select.value === 'fail')) {
      decision.textContent = 'Go-live stoppen. Mindestens ein Pflicht-Gate wurde nicht bestanden.';
    } else if (gates.some(select => select.value !== 'pass')) {
      decision.textContent = 'Go-live stoppen. Prüfen Sie jedes Pflicht-Gate.';
    } else {
      decision.textContent = scored ? 'Alle Gates bestanden. Bereit für die Prüfung durch den Käufer.' : 'Alle Gates bestanden. Schließen Sie die Bewertung für die Prüfung durch den Käufer ab.';
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    calculate(true);
  });
  form.addEventListener('input', () => {
    points.textContent = 'Klicken Sie auf Berechnen, um Punktzahl und Gate-Entscheidung zu aktualisieren.';
    decision.textContent = '';
  });
  form.hidden = false;
  calculate();
})();
