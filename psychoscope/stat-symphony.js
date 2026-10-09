(function(){
  window.PSYCHOSCOPE_MODULES = window.PSYCHOSCOPE_MODULES || {};

  // Stat Symphony — new real tree. Set up identically to boilerplate.js for
  // now (flat +1% test Luck per checked node) just to confirm everything
  // wires up correctly end to end. Replace the math in getBonuses() below
  // node by node as the tree's real content gets designed.

  function isNodeSelected(nodeId) {
    return !!document.getElementById(nodeId)?.checked;
  }

  function getOptionalInputNumber(inputId) {
    const value = Number(document.getElementById(inputId)?.value);
    return Number.isFinite(value) ? value : 0;
  }

  function getBonuses() {
    const tree = document.getElementById('psychoscope-tree')
      ? document.getElementById('psychoscope-tree').value
      : 'none';

    if (tree !== 'stat-symphony') {
      return { tree, luckPct: 0, luckyStrikeMultPct: 0, mainStatPct: 0 };
    }

    // Prefer collectSpiralNodes() from psychoscope-tree.js — it's already
    // loaded on the page (shared <script> scope) and gives labels alongside
    // ids, which is nicer for debugging than raw ids alone. Fall back to a
    // plain DOM query so this still works if that helper isn't around.
    let checkedNodes;
    if (typeof collectSpiralNodes === 'function' && typeof PSYCHOSCOPE_TREES !== 'undefined') {
      checkedNodes = collectSpiralNodes(PSYCHOSCOPE_TREES.statSymphony)
        .filter(node => document.getElementById(node.id)?.checked)
        .map(node => ({ id: node.id, label: String(node.label).replace(/\n/g, ' ') }));
    } else {
      checkedNodes = Array.from(
        document.querySelectorAll('input[id^="psy-symphony-"]:checked')
      ).map(el => ({ id: el.id, label: null }));
    }
    const checkedCount = checkedNodes.length;

    if (isNodeSelected('psy-symphony-slot5-b') && document.getElementById('psy-symphony-perfect-checkbox')?.checked) {
      console.log('checked');
    }

    let highestSubstatPctBonus = 0;
    let matkPct = 0;
    let refinePct = 0;
    let seasonDmgPct = 0;

    let stacks = getOptionalInputNumber('psy-symphony-stacks');

    if (isNodeSelected('psy-symphony-slot1-b')){
      matkPct += 1.12 * getOptionalInputNumber('psy-symphony-stacks');
    }

    if(isNodeSelected('psy-symphony-final') && stacks >= 3){
      seasonDmgPct += 20;
    }


    if (isNodeSelected('psy-symphony-center')) {
      if (stacks > 0 && isNodeSelected('psy-symphony-slot4-a')) {
        highestSubstatPctBonus += 2.4;
        matkPct += 0.672; //matk also increased by 1.6x
        stacks -= 1;
      } else if (stacks > 3 && isNodeSelected('psy-symphony-slot4-b')) {
        highestSubstatPctBonus += 3.0;
        matkPct += 1.12; //matk also increased by 2x
        stacks -= 1;
      }
      highestSubstatPctBonus += 1.5 * stacks;
    }

    if(isNodeSelected('psy-symphony-slot3')){
      refinePct += 15;
    }

    if(isNodeSelected('psy-symphony-slot5-b') && document.getElementById('psy-symphony-perfect-checkbox')?.checked){
      highestSubstatPctBonus *= 2;
      matkPct *= 2;
    }

    return {
      tree,
      highestSubstatPctBonus: highestSubstatPctBonus,
      matkPct: matkPct,
      refinePct: refinePct,
      luckyStrikeMultPct: 0,
      mainStatPct: 0,
      luckPct: 0,
      seasonDmgPct: seasonDmgPct,
    };
  }

  function getSkillEffects() {
    // No Stat Symphony skill effects yet — populate this once the tree's
    // real content/effects are designed.
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

  function getOptionalInputs() {
    const tree = document.getElementById('psychoscope-tree')?.value || 'none';
    if (tree !== 'stat-symphony') return [];

    const definitions = [];
    const centerSelected = document.getElementById('psy-symphony-center')?.checked;
    const modulationSelected = document.getElementById('psy-symphony-slot5-a')?.checked;

    if (centerSelected) {
      definitions.push({
        key: 'stat-symphony-stacks',
        id: 'psy-symphony-stacks',
        label: 'Stat Symphony Stacks',
        min: 0,
        defaultValue: 3,
        max: modulationSelected ? 5 : 4,
        getMax: () => (document.getElementById('psy-symphony-slot5-a')?.checked ? 5 : 4),
        showWhen: () => !!document.getElementById('psy-symphony-center')?.checked,
      });
    }

    if (isNodeSelected('psy-symphony-slot5-b')) {
      definitions.push({
        key: 'stat-symphony-perfect-checkbox',
        id: 'psy-symphony-perfect-checkbox',
        label: 'Perfect Symphony',
        type: 'checkbox',
        defaultChecked: true,
      });
    }

    return definitions;
  }

  function provideSkills(state) {
    return [];
    /*
      [
        'psychoscope',
        1375,
        0,
        false,
        'Stat Symphony (Test)',
        getSkillEffects(),
        getHitsPerParse(),
        0
      ]
    ];*/
  }

  window.PSYCHOSCOPE_MODULES['stat-symphony'] = {
    getBonuses,
    provideSkills,
    getSkillEffects,
    getOptionalInputs,
  };
})();