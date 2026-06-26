(function(){

  // Flamehorn lucky strike DMG boost by level
  const FLAMEHORN_BOOST = [8, 10.4, 12.8, 15.2, 17.6, 20];
  const FLAMEHORN_LUCK_STAT = [5600, 7280, 8960, 10640, 12320, 14000];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'flamehorn') return {};
    const level = state.level;
    let luckStat = 0;

    if (state.applyPassiveStats) {
      luckStat = (FLAMEHORN_LUCK_STAT && FLAMEHORN_LUCK_STAT[level]) || 0;
    }

    const boost = (FLAMEHORN_BOOST && FLAMEHORN_BOOST[level]) || 0;

    return { luckStat, flamehornBoost: boost};
  }

  function provideSkills(state) {
    if (state.imagine !== 'flamehorn') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [500, 574.934, 650, 725, 800, 875];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const activePassiveDamageMultipliers = [50, 57.5, 65, 72.5, 80, 87.5];
    const activePassiveDamageMultiplier = activePassiveDamageMultipliers[level] || activePassiveDamageMultipliers[0];

    const fhActiveProcHitsPerParse = 65 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));

    const hitsPerParse = 3 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Flamehorn (${level})`;
    const procSkillName = `Flamehorn (${level}) active proc (assuming 65 hits per active)`;
    return [
      [
        'imagine',
        damageMultiplier,
        50,
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
        5,
        false,
        procSkillName,
        [
          ['damageType', 'magical'],
          ['generic', ' luck-effect'],
        ],
        fhActiveProcHitsPerParse,
        0
      ]
    ];
  }
  window.IMAGINES['flamehorn'] = { displayName: 'Flamehorn', provideBonuses, provideSkills };
})();