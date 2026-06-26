(function(){

  const OLVERA_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'olvera') return {};
    const level = state.level;

    const mainStatPct = 
    (OLVERA_PASSIVE_MAIN_STAT_PER_LEVEL && 
      OLVERA_PASSIVE_MAIN_STAT_PER_LEVEL[level]) || 0;

    return { mainStatPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'olvera') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [122.4, 140.7, 159.12, 177.48, 195.84, 214.2];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const activePassiveDamageMultipliers = [105, 120.7, 136.5, 152.2, 168, 183.7];
    const activePassiveDamageMultiplier = activePassiveDamageMultipliers[level] || activePassiveDamageMultipliers[0];

    //const activeProcHitsPerParse = 60 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));

    const hitsPerParse = 5 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Olvera (${level})`;
    const procSkillName = `Olvera (${level}) Explosions (input hits per parse)`;
    return [
      [
        'imagine',
        damageMultiplier,
        12,
        true,
        skillName,
        [
          ['damageType', 'physical'],
        ],
        hitsPerParse,
        0
      ],
      [
        'imagine',
        activePassiveDamageMultiplier,
        10,
        true,
        procSkillName,
        [
          ['damageType', 'magical'],
        ],
        0,
        0
      ]
    ];
  }
  window.IMAGINES['olvera'] = { displayName: 'Olvera', provideBonuses, provideSkills };
})();