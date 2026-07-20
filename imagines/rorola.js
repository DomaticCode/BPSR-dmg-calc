(function(){

  // Main stat passive, active damage boost is for 20 seconds (cannot be extended), and stacks are a bonus on top of active damage boost
  // Increasing every 10 hits up to 5 stacks, at max stacks its extended up to 5 times for 3 seconds each. 
  // In a basic test it lasted ~38 seconds total. (probably depends on how fast you hit to get a lot of stacks).
  const ROROLA_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];
  const ROROLA_ACTIVE_DAMAGE_BOOST = [10.0, 12.0, 14.0, 16.0, 18.0, 20.0];
  const ROROLA_ACTIVE_EXTRA_DAMAGE_BOOST_PER_STACK = [1.2, 1.44, 1.68, 1.92, 2.16, 2.4];     

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    const mainStatPct = 
    (ROROLA_PASSIVE_MAIN_STAT_PER_LEVEL && ROROLA_PASSIVE_MAIN_STAT_PER_LEVEL[state.level] && state.applyPassiveStats
      ? ROROLA_PASSIVE_MAIN_STAT_PER_LEVEL[state.level] : 0) || 0;

    const activeDamage = state.mode === 'active'
        ? (ROROLA_ACTIVE_DAMAGE_BOOST[state.level] || 0)
        : 0;

    const extraPerStack = ROROLA_ACTIVE_EXTRA_DAMAGE_BOOST_PER_STACK[state.level] || 0;

    return {
      mainStatPct,
      genDamagePct:
        activeDamage + (extraPerStack * state.stacks)
    };
  }
  function provideSkills(state) {
    if (state.imagine !== 'rorola') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [300, 344.92, 390, 434.98, 480, 524.98];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 5 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Rorola (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      30,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  function provideFormulaParts(kind, state) {
    if (kind !== 'gen') return '';
    const activeDamage = state.mode === 'active'
        ? (ROROLA_ACTIVE_DAMAGE_BOOST[state.level] || 0)
        : 0;
    
    const extraPerStack = ROROLA_ACTIVE_EXTRA_DAMAGE_BOOST_PER_STACK[state.level] || 0;
    const genDamagePct = activeDamage + (extraPerStack * state.stacks);

    return `rorola ${genDamagePct.toFixed(2)}%`;
  }
  window.IMAGINES['rorola'] = { displayName: 'Rorola', provideBonuses, provideFormulaParts, provideSkills };
})();