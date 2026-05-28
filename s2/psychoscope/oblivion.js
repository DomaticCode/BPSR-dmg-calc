(function(){
  window.PSYCHOSCOPE_MODULES = window.PSYCHOSCOPE_MODULES || {};
  function getBonuses() {
    const tree = document.getElementById('psychoscope-tree') 
      ? document.getElementById('psychoscope-tree').value 
      : 'none';

    const bond = tree === 'oblivion' && !!document.getElementById('psychoscope-oblivion-bond-35')?.checked;
    const harmony_grace = tree === 'oblivion' && !!document.getElementById('psychoscope-oblivion-harmony-grace')?.checked;
    const tuning = tree === 'oblivion' && !!document.getElementById('psychoscope-oblivion-tuning')?.checked;
    const beauty_refinement = tree === 'oblivion' && !!document.getElementById('psychoscope-oblivion-beauty-refinement')?.checked;
    const feint_strike = tree === 'oblivion' && !!document.getElementById('psychoscope-oblivion-feint-strike')?.checked;

    const dropdown = document.getElementById('oblivion-buff');

    let targetLuckPct = 0.0, targetCritPct = 0.0, refinePct = 0.0, dreamDmgPct = 0.0;
    if (bond) {
      targetLuckPct += 2.0;
      targetCritPct += 2.0;
    }

    if(beauty_refinement){
      refinePct = 10.00;
    }

    if(feint_strike){
      dreamDmgPct = 6.00;
    }

    let value = 'ob';
    if (tree === 'oblivion' && dropdown) {

      if(harmony_grace){
        value = 'ob-ms';
      } else if(tuning){
        value = 'ob-ae';
      }
    }

    dropdown.value = value;

    console.log('Oblivion bonuses:', { targetLuckPct, targetCritPct, refinePct, dreamDmgPct });

    return {
      tree: tree,
      targetLuckPct,
      targetCritPct,
      refinePct,
      dreamDmgPct,
    };
  }

  window.PSYCHOSCOPE_MODULES['oblivion'] = { getBonuses };
})();


document.addEventListener('DOMContentLoaded', () => {
  const harmony_grace = document.getElementById('psychoscope-oblivion-harmony-grace');
  const tuning = document.getElementById('psychoscope-oblivion-tuning');

  harmony_grace.addEventListener('change', () => {
    if (harmony_grace.checked) {
      tuning.checked = false;
      tuning.disabled = true;
    } else {
      tuning.disabled = false;
    }
  });

  tuning.addEventListener('change', () => {
    if (tuning.checked) {
      harmony_grace.checked = false;
      harmony_grace.disabled = true;
    } else {
      harmony_grace.disabled = false;
    }
  });
});