(function(){
  // TODO NOT OFFICIALLY SUPPORTED YET, only added for testing privately
  // Active transform not calculated, just passive procs
  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    return { };
  }
  function provideSkills(state) {
    if (state.imagine !== 'brigand-leader') return [];
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

    const passiveDamageMultipliers = [29.1, 37.83, 46.56, 55.29, 64.02, 72.75];
    const passiveDamageMultiplier = passiveDamageMultipliers[level] || passiveDamageMultipliers[0];

    // Fetching lucky hit count
    const parentRow = document.querySelector('.breakdown-row[data-item-id="lucky-hit"]');
    const firstChild = parentRow.querySelector('div'); // Grabs the first child div
    const match = firstChild.textContent.match(/\(([^)]+)\)/);
    const luckyHitsCount = match ? parseInt(match[1], 10) : null;

    const hitsPerParse = Math.round(luckyHitsCount * 0.66);
    const procSkillName = `Brigand Leader (${level}) passive proc (assuming 66% of lucky hits per parse)`;
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
  window.IMAGINES['brigand-leader'] = { displayName: 'Brigand Leader', provideBonuses, provideSkills };
})();