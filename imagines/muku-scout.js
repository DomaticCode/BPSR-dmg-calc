(function(){

  // Muku Scout MATK% / ATK% boost per level (passive = 3 stacks, active = 6 stacks)
  const MUKU_PASSIVE_PER_STACK = [2, 2.6, 3.2, 3.8, 4.4, 5];
  const MUKU_PASSIVE_STACKS    = 3;
  const MUKU_ACTIVE_STACKS     = 6;

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'muku-scout') return {};
    const level = state.level;

    const stacks =state.mode === 'active'
      ? (MUKU_ACTIVE_STACKS || 0)
      : (MUKU_PASSIVE_STACKS || 0);

    const perStack =
      (MUKU_PASSIVE_PER_STACK &&
        MUKU_PASSIVE_PER_STACK[level]) || 0;

    const matkPct = perStack * stacks;

    return { matkPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'muku-scout') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [38, 43.7, 49.4, 55.1, 60.8, 66.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 20 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Muku Scout (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      3,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['muku-scout'] = { displayName: 'Muku Scout', provideBonuses, provideSkills };
})();