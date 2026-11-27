(() => {
  const form = document.getElementById('b2bv-score');
  if (!form) return;
  const weights = Array.from(form.querySelectorAll('[data-weight]'));
  const ratings = Array.from(form.querySelectorAll('[data-rating]'));
  const gates = Array.from(form.querySelectorAll('[data-gate]'));
  const points = form.querySelector('[data-score-result]');
  const decision = form.querySelector('[data-gate-result]');
  const formatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });

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
      points.textContent = 'Utilice una ponderación entre 0 % y 100 % para cada dimensión.';
      if (focusInvalid) invalid[0].focus();
    } else if (Math.abs(weightTotal - 100) >= 0.0001) {
      points.textContent = 'Las ponderaciones deben sumar 100 %. Total actual ' + formatter.format(weightTotal) + ' %.';
      if (focusInvalid) weights[0].focus();
    } else if (missingRating) {
      points.textContent = 'Puntuación incompleta. Evalúe las seis dimensiones, incluidas las ponderadas al 0 %.';
      if (focusInvalid) missingRating.focus();
    } else {
      const score = weights.reduce((sum, input, index) => sum + input.valueAsNumber * Number(ratings[index].value) / 5, 0);
      points.textContent = formatter.format(score) + '/100 según la evidencia.';
    }

    if (gates.some(select => select.value === 'fail')) {
      decision.textContent = 'Detenga el lanzamiento. Al menos un criterio obligatorio no se ha superado.';
    } else if (gates.some(select => select.value !== 'pass')) {
      decision.textContent = 'Detenga el lanzamiento. Verifique cada criterio obligatorio.';
    } else {
      decision.textContent = scored ? 'Todos los criterios superados. Listo para la revisión del comprador.' : 'Todos los criterios superados. Complete la puntuación para la revisión del comprador.';
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    calculate(true);
  });
  form.addEventListener('input', () => {
    points.textContent = 'Calcule para actualizar la puntuación y la decisión sobre los criterios.';
    decision.textContent = '';
  });
  form.hidden = false;
  calculate();
})();
