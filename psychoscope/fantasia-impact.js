(function(){
  window.PSYCHOSCOPE_MODULES = window.PSYCHOSCOPE_MODULES || {};

  function getBonuses() {
    const tree = document.getElementById('psychoscope-tree') 
      ? document.getElementById('psychoscope-tree').value 
      : 'none';
    const bond = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-bond-35') 
      && document.getElementById('psychoscope-fantasia-bond-35').checked;
    const linkage = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-linkage') 
      && document.getElementById('psychoscope-fantasia-linkage').checked;
    const linkageLevel = linkage ? parseInt(document.getElementById('psychoscope-fantasia-linkage-pct').value) : 0;
    const reconstruct = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-reconstruct') 
      && document.getElementById('psychoscope-fantasia-reconstruct').checked;
    const ultimateFortune = tree === 'fantasia-impact' && !!document.getElementById('psychoscope-fantasia-ultimate-fortune') 
      && document.getElementById('psychoscope-fantasia-ultimate-fortune').checked;

    let luckPct = 0;
    if (bond) luckPct += 1.00;
    if (linkage) luckPct += linkageLevel;

    const luckyStrikeMultPct = reconstruct ? 10.0 : 0;
    const mainStatPct = ultimateFortune ? 10.0 : 0;

    return {
      tree: tree,
      luckPct: luckPct,
      luckyStrikeMultPct: luckyStrikeMultPct,
      mainStatPct: mainStatPct
    };
  }

  function getSkillEffects() {
    const effects = [
      ['damageType', 'no-crit'],
      ['generic', 'luck-effect']
    ];

    const timeStep = !!document.getElementById('psychoscope-fantasia-time-step')?.checked;
    const multiPhasic = !!document.getElementById('psychoscope-fantasia-multi-phasic-strike')?.checked;
    const ripple = !!document.getElementById('psychoscope-fantasia-ripple-of-fate')?.checked;
    const dreamDmgPct = (timeStep || multiPhasic ? 100 : 0) + (ripple ? 15 : 0);

    if (dreamDmgPct > 0) {
      effects.push(['dreamDmg', String(dreamDmgPct)]);
    }

    return effects;
  }

  function provideSkills(state) {
    return [
      [
        'psychoscope',
        1375,
        0,
        false,
        'Fantasia Impact',
        getSkillEffects(),
        16,
        0
      ]
    ];
  }

  window.PSYCHOSCOPE_MODULES['fantasia-impact'] = { getBonuses, provideSkills, getSkillEffects };
})();

