(function(){

  // bloodthirsty furball bonus arrays
  const BLOODTHIRSTY_FURBALL_ACTIVE_ADDITIONAL_DAMAGE_PROC = [39, 46.8, 54.6, 62.4, 70.2, 78];
  const BLOODTHIRSTY_FURBALL_PASSIVE_DAMAGE = [160, 208, 256, 304, 352, 400]; // not sure if im going to implement this

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'bloodthirsty-furball') return {};
    const level = state.level;

    const additionalDamageProc = BLOODTHIRSTY_FURBALL_ACTIVE_ADDITIONAL_DAMAGE_PROC && state.mode === 'active'
        ? BLOODTHIRSTY_FURBALL_ACTIVE_ADDITIONAL_DAMAGE_PROC[level]
        : 0;


    return { additionalDamageProc };
  }

  function provideSkills(state) {
    if (state.imagine !== 'bloodthirsty-furball') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [150.0, 172.5, 195.0, 217.5, 240.0, 262.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }
    const hitsPerParse = 10 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));

    const passiveDamageMultipliers = [160, 208, 256, 304, 352, 400];
    const passiveDamageMultiplier = passiveDamageMultipliers[level] || passiveDamageMultipliers[0];

    const passiveHitsPerParse = 60 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));

    const skillName = `Bloodthirsty Furball (${level})`;
    const procSkillName = `Bloodthirsty Furball (${level}) active proc (input your hits per parse)`;
    return [
      [
        'imagine',
        damageMultiplier,
        15,
        true,
        skillName,
        [
          ['damageType', 'physical'],
        ],
        hitsPerParse,
        0
      ],
      [
        'none',
        passiveDamageMultiplier,
        0,
        false,
        procSkillName,
        [
          ['damageType', 'no-typed-dmg'],
        ],
        0, // make user input their hits per parse
        0
      ]
    ];
  }
  window.IMAGINES['bloodthirsty-furball'] = { displayName: 'Bloodthirsty Furball', provideBonuses, provideSkills };
})();