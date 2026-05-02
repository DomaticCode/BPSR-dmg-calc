(function(){

  // Main stat passive, active damage boost is for 20 seconds (cannot be extended), and stacks are a bonus on top of active damage boost
  // Increasing every 10 hits up to 5 stacks, at max stacks its extended up to 5 times for 3 seconds each. 
  // In a basic test it lasted ~38 seconds total. (probably depends on how fast you hit to get a lot of stacks).
  const ROROLA_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];
  const ROROLA_ACTIVE_DAMAGE_BOOST = [10.0, 12.0, 14.0, 16.0, 18.0, 20.0];
  const ROROLA_ACTIVE_EXTRA_DAMAGE_BOOST_PER_STACK = [1.2, 1.44, 1.68, 1.92, 2.16, 2.4];     

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'rorola') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    // main stat is passive and independent of mode
    const mainStatPct = (ROROLA_PASSIVE_MAIN_STAT_PER_LEVEL && ROROLA_PASSIVE_MAIN_STAT_PER_LEVEL[level]) || 0;
    // active generic damage (percent) if active
    const activeDamage = (mode === 'active') ? ((ROROLA_ACTIVE_DAMAGE_BOOST && ROROLA_ACTIVE_DAMAGE_BOOST[level]) || 0) : 0;
    // extra per-stack generic damage (percent) if active
    const extraPerStack = (ROROLA_ACTIVE_EXTRA_DAMAGE_BOOST_PER_STACK && ROROLA_ACTIVE_EXTRA_DAMAGE_BOOST_PER_STACK[level]) || 0;
    const stacksEl = document.getElementById(`imagine-${slot}-stacks`);
    const stacks = stacksEl ? (parseInt(stacksEl.value) || 0) : 0;
    if (stacks > 5) stacks = 5; // cap stacks at 5
    const activeExtraTotal = (mode === 'active') ? (extraPerStack * stacks) : 0;
    const genDamagePct = activeDamage + activeExtraTotal;
    return { mainStatPct, genDamagePct};
  }
  function provideFormulaParts(kind, slot) {
    if (kind !== 'gen') return '';
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const activeDamage = (mode === 'active') ? ((ROROLA_ACTIVE_DAMAGE_BOOST && ROROLA_ACTIVE_DAMAGE_BOOST[level]) || 0) : 0;
    const extraPerStack = (ROROLA_ACTIVE_EXTRA_DAMAGE_BOOST_PER_STACK && ROROLA_ACTIVE_EXTRA_DAMAGE_BOOST_PER_STACK[level]) || 0;
    const stacksEl = document.getElementById(`imagine-${slot}-stacks`);
    const stacks = stacksEl ? (parseInt(stacksEl.value) || 0) : 0;
    if (stacks > 5) stacks = 5;
    const activeExtraTotal = (mode === 'active') ? (extraPerStack * stacks) : 0;
    const genDamagePct = activeDamage + activeExtraTotal;
    return `rorola ${(genDamagePct).toFixed(2)}%`;
  }
  window.IMAGINES['rorola'] = { provideBonuses, provideFormulaParts };
})();