(function(){
  window.PSYCHOSCOPE_MODULES = window.PSYCHOSCOPE_MODULES || {};

  // TEST TREE only gives 1% luck per node taken.

  function getBonuses() {
    const tree = document.getElementById('psychoscope-tree')
      ? document.getElementById('psychoscope-tree').value
      : 'none';

    console.log(`Boilerplate tree: ${tree}`);

    if (tree !== 'boilerplate') {
      return { tree, luckPct: 0, luckyStrikeMultPct: 0, mainStatPct: 0 };
    }

    // Prefer collectSpiralNodes() from psychoscope-tree.js — it's already
    // loaded on the page (shared <script> scope) and gives labels alongside
    // ids, which is nicer for debugging than raw ids alone. Fall back to a
    // plain DOM query so this still works if that helper isn't around.
    let checkedNodes;
    if (typeof collectSpiralNodes === 'function' && typeof PSYCHOSCOPE_TREES !== 'undefined') {
      checkedNodes = collectSpiralNodes(PSYCHOSCOPE_TREES.boilerplate)
        .filter(node => document.getElementById(node.id)?.checked)
        .map(node => ({ id: node.id, label: String(node.label).replace(/\n/g, ' ') }));
    } else {
      checkedNodes = Array.from(
        document.querySelectorAll('input[id^="psychoscope-boilerplate-"]:checked')
      ).map(el => ({ id: el.id, label: null }));
    }
    const checkedCount = checkedNodes.length;

    console.log(`Boilerplate tree: ${checkedCount} nodes checked, +${checkedCount}% Luck`);
    console.log('Boilerplate tree: checked nodes ->', checkedNodes);

    return {
      tree,
      luckPct: checkedCount * 1.0,
      luckyStrikeMultPct: 0,
      mainStatPct: 0,
    };
  }

  function getSkillEffects() {
    // No boilerplate skill effects yet — real trees will populate this once
    // actual node content/effects are designed.
    return [
      ['damageType', 'no-crit luck-effect'],
    ];
  }

  function getHitsPerParse(){
    if (document.getElementById('class-select')?.value === 'dissonance') {
      return 33;
    }
    return 16;
  }

  function provideSkills(state) {
    return [
      [
        'psychoscope',
        1375,
        0,
        false,
        'Boilerplate Tree (Test)',
        getSkillEffects(),
        getHitsPerParse(),
        0
      ]
    ];
  }

  window.PSYCHOSCOPE_MODULES['boilerplate'] = { getBonuses, provideSkills, getSkillEffects };
})();