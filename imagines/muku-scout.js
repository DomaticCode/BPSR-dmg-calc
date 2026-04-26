(function(){

  // Muku Scout MATK% / ATK% boost per level (passive = 3 stacks, active = 6 stacks)
  const MUKU_PASSIVE_PER_STACK = [2, 2.6, 3.2, 3.8, 4.4, 5];
  const MUKU_PASSIVE_STACKS    = 3;
  const MUKU_ACTIVE_STACKS     = 6;

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'muku-scout') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const stacks = mode === 'active' ? (MUKU_ACTIVE_STACKS || 0) : (MUKU_PASSIVE_STACKS || 0);
    const perStack = (MUKU_PASSIVE_PER_STACK && MUKU_PASSIVE_PER_STACK[level]) || 0;
    const matkPct = perStack * stacks;
    console.log(`Muku Scout bonuses for slot ${slot}: level ${level}, mode ${mode}, stacks ${stacks}, perStack ${perStack} => matkPct ${matkPct}`);
    return { matkPct };
  }
  window.IMAGINES['muku-scout'] = { provideBonuses };
})();