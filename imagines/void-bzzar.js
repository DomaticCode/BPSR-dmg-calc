(function(){

  // Active transform not calculated, just passive procs
  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    return { };
  }
  function provideSkills(state) {
    if (state.imagine !== 'void-bzzar') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    //const damageMultipliers = [225, 258.7, 292.5, 326.2, 360, 393.7];
    //const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const passiveDamageMultipliers = [11.2, 14.56, 17.92, 21.28, 24.64, 28];
    const passiveDamageMultiplier = passiveDamageMultipliers[level] || passiveDamageMultipliers[0];

    // Fetching lucky hit count
    const parentRow = document.querySelector('.breakdown-row[data-item-id="lucky-hit"]');
    const firstChild = parentRow.querySelector('div'); // Grabs the first child div
    const match = firstChild.textContent.match(/\(([^)]+)\)/);
    const luckyHitsCount = match ? parseInt(match[1], 10) : null;

    const hitsPerParse = Math.round(luckyHitsCount * 0.66);
    const procSkillName = `Void Bzzar (${level}) passive proc (assuming 66% of lucky hits per parse)`;
    return [
      [
        'imagine(passive)',
        passiveDamageMultiplier,
        0,
        false,
        procSkillName,
        [
          ['damageType', 'physical luck-effect'],
        ],
        hitsPerParse,
        0
      ]
    ];
  }
  window.IMAGINES['void-bzzar'] = { displayName: 'Void Bzzar', provideBonuses, provideSkills };
})();