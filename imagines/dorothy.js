(function(){

  const DOROTHY_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'dorothy') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    // main stat is passive and independent of mode
    const mainStatPct = (DOROTHY_PASSIVE_MAIN_STAT_PER_LEVEL && DOROTHY_PASSIVE_MAIN_STAT_PER_LEVEL[level]) || 0;
    return { mainStatPct };
  }
  window.IMAGINES['dorothy'] = { provideBonuses };
})();