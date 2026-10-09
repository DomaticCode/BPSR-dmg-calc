(function(){

  // Main stat passive, active damage boost is for 20 seconds (cannot be extended), and stacks are a bonus on top of active damage boost
  // Increasing every 10 hits up to 5 stacks, at max stacks its extended up to 5 times for 3 seconds each. 
  // In a basic test it lasted ~38 seconds total. (probably depends on how fast you hit to get a lot of stacks).
  const BOYCE_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];
  const BOYCE_ACTIVE_ATK_BOOST = [8, 9.6, 11.2, 12.8, 14.4, 16];
  const BOYCE_ACTIVE_EXTRA_ATK_BOOST_PER_STACK = [1, 1.2, 1.4, 1.6, 1.8, 2];     

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    const mainStatPct = 
    (BOYCE_PASSIVE_MAIN_STAT_PER_LEVEL && BOYCE_PASSIVE_MAIN_STAT_PER_LEVEL[state.level] && state.applyPassiveStats
      ? BOYCE_PASSIVE_MAIN_STAT_PER_LEVEL[state.level] : 0) || 0;

    const activeDamage = state.mode === 'active'
        ? (BOYCE_ACTIVE_ATK_BOOST[state.level] || 0)
        : 0;

    const extraPerStack = BOYCE_ACTIVE_EXTRA_ATK_BOOST_PER_STACK[state.level] || 0;

    return {
      mainStatPct,
      matkPct:
        activeDamage + (extraPerStack * state.stacks)
    };
  }

  function provideSkills(state) {
    if (state.imagine !== 'boyce') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [1050, 1207.4, 1365, 1522.5, 1680, 1837.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 1 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Boyce (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      105,
      true,
      skillName,
      [
        ['damageType', 'magical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['boyce'] = { displayName: 'Boyce', provideBonuses, provideSkills };
})();