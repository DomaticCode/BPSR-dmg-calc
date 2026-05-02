(function(){

  const FAFALA_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'fafala') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    // main stat is passive and independent of mode
    const mainStatPct = (FAFALA_PASSIVE_MAIN_STAT_PER_LEVEL && FAFALA_PASSIVE_MAIN_STAT_PER_LEVEL[level]) || 0;
    return { mainStatPct };
  }
  window.IMAGINES['fafala'] = { provideBonuses };
})();