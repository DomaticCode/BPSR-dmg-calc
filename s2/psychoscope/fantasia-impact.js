(function(){
  window.PSYCHOSCOPE_MODULES = window.PSYCHOSCOPE_MODULES || {};

  function getBonuses() {
    const tree = document.getElementById('psychoscope-tree') 
      ? document.getElementById('psychoscope-tree').value 
      : 'none';
    const bond = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-bond-35') 
      && document.getElementById('psychoscope-fantasia-bond-35').checked;
    const linkage = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-linkage') 
      && document.getElementById('psychoscope-fantasia-linkage').checked;
    const linkageLevel = linkage ? parseInt(document.getElementById('psychoscope-fantasia-linkage-pct').value) : 0;
    const reconstruct = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-reconstruct') 
      && document.getElementById('psychoscope-fantasia-reconstruct').checked;
    const ultimateFortune = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-ultimate-fortune') 
      && document.getElementById('psychoscope-fantasia-ultimate-fortune').checked;

    let luckPct = 0;
    if (bond) luckPct += 1.00;
    if (linkage) luckPct += linkageLevel;

    const luckyStrikeMultPct = reconstruct ? 10.0 : 0;
    const mainStatPct = ultimateFortune ? 10.0 : 0;

    return {
      tree: tree,
      luckPct: luckPct,
      luckyStrikeMultPct: luckyStrikeMultPct,
      mainStatPct: mainStatPct
    };
  }

  window.PSYCHOSCOPE_MODULES['fantasia-impact'] = { getBonuses };
})();


document.addEventListener('DOMContentLoaded', () => {
  const linkage = document.getElementById('psychoscope-fantasia-linkage');
  const reconstruct = document.getElementById('psychoscope-fantasia-reconstruct');

  linkage.addEventListener('change', () => {
    if (linkage.checked) {
      reconstruct.checked = false;
      reconstruct.disabled = true;
    } else {
      reconstruct.disabled = false;
    }
  });

  reconstruct.addEventListener('change', () => {
    if (reconstruct.checked) {
      linkage.checked = false;
      linkage.disabled = true;
    } else {
      linkage.disabled = false;
    }
  });
});