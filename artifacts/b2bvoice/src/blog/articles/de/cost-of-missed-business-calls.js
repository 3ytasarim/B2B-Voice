(() => {
  const form = document.getElementById('b2bv-missed');
  if (!form) return;

  const inputs = Array.from(form.querySelectorAll('input[type="number"][required]'));
  const preset = form.querySelector('[data-preset]');
  const status = form.querySelector('[role="status"]');
  const results = form.querySelector('dl');
  const outputs = Array.from(results.querySelectorAll('[data-result]'));
  const dollars = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD', signDisplay: 'negative' });
  const count = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 3, signDisplay: 'negative' });

  function clearResults() {
    results.hidden = true;
    outputs.forEach(output => { output.textContent = ''; });
  }

  function isValid(input) {
    return input.validity.valid
      && Number.isFinite(input.valueAsNumber)
      && (input.name !== 'count' || Number.isSafeInteger(input.valueAsNumber));
  }

  function estimate(values) {
    const qualified = values.count * (values.qualified / 100);
    const baselineReach = qualified * (values.baseline / 100);
    const proposedReach = qualified * (values.proposed / 100);
    const baselineSales = baselineReach * (values.oldFulfilled / 100);
    const proposedSales = proposedReach * (values.newFulfilled / 100);
    const changeSales = proposedSales - baselineSales;
    const revenue = changeSales * values.revenue;
    return {
      qualified,
      baselineReach,
      proposedReach,
      changeReach: proposedReach - baselineReach,
      baselineSales,
      proposedSales,
      changeSales,
      revenue,
      contribution: revenue * (values.margin / 100)
    };
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearResults();

    const invalid = inputs.filter(input => !isValid(input));
    for (const input of inputs) {
      if (invalid.includes(input)) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
    if (invalid.length) {
      status.textContent = 'Bitte füllen Sie die markierten Felder aus. Geben Sie eine ganze Anzahl an Anfragen, Quoten zwischen 0 und 100 und einen nicht negativen Umsatzbetrag an.';
      invalid[0].focus();
      return;
    }

    const values = Object.fromEntries(inputs.map(input => [input.name, input.valueAsNumber]));
    const estimateValues = estimate(values);
    if (!Object.values(estimateValues).every(Number.isFinite)) {
      status.textContent = 'Diese Eingaben überschreiten den Berechnungsbereich. Geben Sie kleinere Werte ein.';
      return;
    }

    for (const output of outputs) {
      const metric = output.dataset.result;
      const format = metric === 'revenue' || metric === 'contribution' ? dollars : count;
      output.textContent = format.format(estimateValues[metric]);
    }
    results.hidden = false;
    status.textContent = 'Erwarteter zusätzlicher monatlicher Deckungsbeitrag ' + dollars.format(estimateValues.contribution) + '.';
  });

  form.addEventListener('input', event => {
    if (!inputs.includes(event.target)) return;
    clearResults();
    event.target.removeAttribute('aria-invalid');
    status.textContent = '';
  });

  preset.addEventListener('change', () => {
    const operatingValues = JSON.parse(preset.selectedOptions[0].dataset.values || '{}');
    for (const input of inputs) {
      input.value = Object.hasOwn(operatingValues, input.name) ? String(operatingValues[input.name]) : '';
      input.removeAttribute('aria-invalid');
    }
    clearResults();
    status.textContent = preset.value ? 'Geben Sie Ihren eigenen Umsatz und Ihre Deckungsbeitragsmarge ein und berechnen Sie dann.' : '';
  });

  form.hidden = false;
})();
