(function(){

  // Sunfire & Moonstrike lucky strike DMG boost by level
  const SM_ACTIVE_LUCK_PCT = [5, 6, 7, 8, 9, 10];
  const SM_LUCK_EFFECT_CRIT_PCT = [35, 42, 49, 56, 63, 70];
  const SM_LUCK_EFFECT_CRIT_REDUCED = [5.25, 6.3, 7.35, 8.4, 9.45, 10.5];
  const SM_LUCK_MULT_PER_STACK = [4, 5.2, 6.4, 7.6, 8.8, 10];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'sunfire-moonstrike') return {};
    const level = state.level;

    let luckEffectCritPct = 0;
    let luckPct = 0;
    const luckMult = (state.stacks ?? 0) * (SM_LUCK_MULT_PER_STACK[level] || 0);

    if (state.mode === 'active') {
      luckPct = SM_ACTIVE_LUCK_PCT?.[level] || 0;
      console.log("stack2:", state.stacks2);
      luckEffectCritPct = (SM_LUCK_EFFECT_CRIT_PCT[level] || 0)
        - (SM_LUCK_EFFECT_CRIT_REDUCED[level] || 0) * (state.stacks2 || 0);
    }

    return { luckPct, luckEffectCritPct, luckMult };
  }

  function provideSkills(state) {
    if (state.imagine !== 'sunfire-moonstrike') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [750, 862.5, 975, 1087.5, 1200, 1312.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const passiveDamageMultipliers = [34, 44.2, 54.4, 64.6, 74.8, 85];
    const passiveDamageMultiplier = passiveDamageMultipliers[level] || passiveDamageMultipliers[0];

    // Fetching lucky hit count
    const parentRow = document.querySelector('.breakdown-row[data-item-id="lucky-hit"]');
    const firstChild = parentRow.querySelector('div'); // Grabs the first child div
    const match = firstChild.textContent.match(/\(([^)]+)\)/);
    const luckyHitsCount = match ? parseInt(match[1], 10) : null;

    const passiveHitsPerParse = Math.round(luckyHitsCount * 0.8);

    const hitsPerParse = 2 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Sunfire & Moonstrike (${level})`;
    const procSkillName = `Sunfire & Moonstrike (${level}) passive proc`;
    return [
      [
        'imagine',
        damageMultiplier,
        75,
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
        passiveDamageMultiplier,
        0,
        false,
        procSkillName,
        [
          ['damageType', 'magical luck-effect'],
          ['critChance', 100],
          ['staticCritDamage', 50],
        ],
        passiveHitsPerParse,
        0
      ]
    ];
  }
  window.IMAGINES['sunfire-moonstrike'] = {
    displayName: 'Sunfire & Moonstrike',
    aliases: ['twin goats', 'twin deer', 'deers', 'goats', 'luck crit', 'crit luck', 'luck effect'],
    stackInputLabels: {
      stacks: { label: 'Passive Heal stacks', max: 3 },
      stacks2: { label: 'Active Crit Red. stacks', max: 3 }
    },
    provideBonuses,
    provideSkills
  };
})();