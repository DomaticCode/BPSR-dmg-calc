(function(){

  // Main stat passive, active damage boost is for 20 seconds (cannot be extended), and stacks are a bonus on top of active damage boost
  // Increasing every 10 hits up to 5 stacks, at max stacks its extended up to 5 times for 3 seconds each. 
  // In a basic test it lasted ~38 seconds total. (probably depends on how fast you hit to get a lot of stacks).
  const BOYCE_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];
  const BOYCE_ACTIVE_ATK_BOOST = [8, 9.6, 11.2, 12.8, 14.4, 16];
  const BOYCE_ACTIVE_EXTRA_ATK_BOOST_PER_STACK = [1, 1.2, 1.4, 1.6, 1.8, 2];     

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    const mainStatPct = BOYCE_PASSIVE_MAIN_STAT_PER_LEVEL[state.level] || 0;

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
  window.IMAGINES['boyce'] = { provideBonuses };
})();