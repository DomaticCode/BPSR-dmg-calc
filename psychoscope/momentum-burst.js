(function(){
  window.PSYCHOSCOPE_MODULES = window.PSYCHOSCOPE_MODULES || {};


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

    if (tree !== 'momentum-burst') {
      return { tree, luckPct: 0, luckyStrikeMultPct: 0, mainStatPct: 0 };
    }

    // Prefer collectSpiralNodes() from psychoscope-tree.js — it's already
    // loaded on the page (shared <script> scope) and gives labels alongside
    // ids, which is nicer for debugging than raw ids alone. Fall back to a
    // plain DOM query so this still works if that helper isn't around.
    let checkedNodes;
    if (typeof collectSpiralNodes === 'function' && typeof PSYCHOSCOPE_TREES !== 'undefined') {
      checkedNodes = collectSpiralNodes(PSYCHOSCOPE_TREES.momentumBurst)
        .filter(node => document.getElementById(node.id)?.checked)
        .map(node => ({ id: node.id, label: String(node.label).replace(/\n/g, ' ') }));
    } else {
      checkedNodes = Array.from(
        document.querySelectorAll('input[id^="psy-burst-"]:checked')
      ).map(el => ({ id: el.id, label: null }));
    }
    const checkedCount = checkedNodes.length;

    let matk = 0;
    let matkPct = 0;
    let refinePct = 0;
    let seasonDmgPct = 0;

    let chargeStacks = getOptionalInputNumber('psy-charge-stacks');
    let stacksForBurst = document.getElementById('psy-burst-slot5-b')?.checked ? 7 : 5;
    const inBurst = chargeStacks >= stacksForBurst;

    if (isNodeSelected('psy-burst-center')){
      if (inBurst && isNodeSelected('psy-burst-slot5-b')){
        matk += 360 * (getOptionalInputNumber('psy-season-lvl') / 100) + 480;
      }else if(inBurst){
        matk += 300 * (getOptionalInputNumber('psy-season-lvl') / 100) + 400;
      } else{
        matk += (38 * (getOptionalInputNumber('psy-season-lvl') / 100) + 74) * chargeStacks;
      }
    }

    if (isNodeSelected('psy-burst-slot1-c')){
      if(inBurst){
        matkPct += 8;
      }
    }

    if(isNodeSelected('psy-burst-slot3')){
      refinePct += 15;
    }

    if(isNodeSelected('psy-burst-final')){
      if(inBurst){
        seasonDmgPct += 10;
      }
      else{
        seasonDmgPct += 1.6 * chargeStacks;
      }
    }

    // These nodes affect ALL bonuses granted by the Charge/Burst, including optional nodes.
    if(isNodeSelected('psy-burst-slot4-a')){
      if(inBurst){
        matk *= 1.5;
        matkPct *= 1.5;
        seasonDmgPct *= 1.5;
      }
    }
    else if(isNodeSelected('psy-burst-slot4-b')){
        matk *= 1.35;
        seasonDmgPct *= 1.35;
      if(inBurst){
        matkPct *= 1.35;
      }
    }



    matk = Math.floor(matk);

    // Missing a floor in some main calc MATK calculation. Flooring this in one setup results in: 6793, not flooring this results in 6795, in game: 6794.

    return {
      tree,
      matk,
      matkPct,
      refinePct,
      seasonDmgPct,
    };
  }

  // Momentum burst does not have a skill.
  function getSkillEffects() {
    // No Stat Symphony skill effects yet — populate this once the tree's
    // real content/effects are designed.
    return [];
  }
  function getHitsPerParse(){
    if (document.getElementById('class-select')?.value === 'dissonance') {
      return 33;
    }
    return 16;
  }

  function getOptionalInputs() {
    const tree = document.getElementById('psychoscope-tree')?.value || 'none';
    if (tree !== 'momentum-burst') return [];

    const centerSelected = document.getElementById('psy-burst-center')?.checked;
    const modulationSelected = document.getElementById('psy-burst-slot5-b')?.checked;

    if (!centerSelected) return [];


    return [
      {
        key: 'season-lvl',
        id: 'psy-season-lvl',
        label: 'Season Level',
        min: 0,
        defaultValue: 1000,
        max: 100,
        showWhen: () => !!document.getElementById('psy-burst-center')?.checked,
      },
      {
        key: 'charge-stacks',
        id: 'psy-charge-stacks',
        label: 'Charge Stacks',
        min: 0,
        defaultValue: 0,
        max: modulationSelected ? 7 : 5,
        getMax: () => (document.getElementById('psy-burst-slot5-b')?.checked ? 7 : 5),
        showWhen: () => !!document.getElementById('psy-burst-center')?.checked,
    }];
  }

  // Momentum burst does not have a skill.
  function provideSkills(state) {
    return [];
    /*
      [
        'psychoscope',
        1375,
        0,
        false,
        'Momentum Burst (Test)',
        getSkillEffects(),
        getHitsPerParse(),
        0
      ]
    ];*/
  }

  window.PSYCHOSCOPE_MODULES['momentum-burst'] = {
    getBonuses,
    provideSkills,
    getSkillEffects,
    getOptionalInputs,
  };
})();