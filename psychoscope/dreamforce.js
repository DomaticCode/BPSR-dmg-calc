(function(){
  window.PSYCHOSCOPE_MODULES = window.PSYCHOSCOPE_MODULES || {};
  function getBonuses() {
    const tree = document.getElementById('psychoscope-tree') ? document.getElementById('psychoscope-tree').value : 'none';
    const mainStatsEnabled = tree === 'dreamforce' && !!document.getElementById('psychoscope-main-stats') && document.getElementById('psychoscope-main-stats').checked;
    const mainStatsValue = mainStatsEnabled ? (parseFloat(document.getElementById('psychoscope-main-stats-bonus')?.value) || 0) : 0;
    const bondDreamDmgPct = tree === 'dreamforce' && !!document.getElementById('psychoscope-bond-lvl35') && document.getElementById('psychoscope-bond-lvl35').checked ? 2.00 : 0;
    const amplifyRare = tree === 'dreamforce' && !!document.getElementById('psychoscope-amplify-rare') && document.getElementById('psychoscope-amplify-rare').checked ? 3.00 : 0;
    return {
      tree: tree,
      mainStat: mainStatsValue,
      dreamDmgPct: bondDreamDmgPct,
      highestSubstatPctBonus: amplifyRare
    };
  }
  window.PSYCHOSCOPE_MODULES['dreamforce'] = { getBonuses };
})();