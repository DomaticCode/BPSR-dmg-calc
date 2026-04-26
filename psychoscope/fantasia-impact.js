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
    const reconstruct = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-reconstruct') 
      && document.getElementById('psychoscope-fantasia-reconstruct').checked;
    const ultimateFortune = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-ultimate-fortune') 
      && document.getElementById('psychoscope-fantasia-ultimate-fortune').checked;

    let luckPct = 0;
    if (bond) luckPct += 0.01;
    if (linkage) luckPct += 0.03;

    const luckyStrikeMult = reconstruct ? 0.1 : 0;
    const mainStatPct = ultimateFortune ? 0.10 : 0;

    return {
      tree: tree,
      luckPct: luckPct,
      luckyStrikeMult: luckyStrikeMult,
      mainStatPct: mainStatPct
    };
  }

  window.PSYCHOSCOPE_MODULES['fantasia-impact'] = { getBonuses };
})();