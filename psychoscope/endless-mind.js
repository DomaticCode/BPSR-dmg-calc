(function(){
  window.PSYCHOSCOPE_MODULES = window.PSYCHOSCOPE_MODULES || {};

  // Note: did not add dropdowns for aegis not taken, it's annoying and you are trolling with the other option.
  function getBonuses() {
    const tree = document.getElementById('psychoscope-tree') 
      ? document.getElementById('psychoscope-tree').value 
      : 'none';

    const bond = tree === 'endless-mind' && !!document.getElementById('psychoscope-endless-bond-35')?.checked;
    const aegis = tree === 'endless-mind' && !!document.getElementById('psychoscope-endless-aegis')?.checked;

    const self_continuum = tree === 'endless-mind' && !!document.getElementById('psychoscope-endless-still-continuum')?.checked;
    const split_brilliance = tree === 'endless-mind' && !!document.getElementById('psychoscope-endless-split-brilliance')?.checked;
    const finale_chant = tree === 'endless-mind' && !!document.getElementById('psychoscope-endless-finale-chant')?.checked;

    const dropdown = document.getElementById('endless-mind');

    let mainStat = 0;
    if (bond) mainStat += 100;

    // Endless Mind dropdown logic
    if (tree === 'endless-mind' && dropdown) {

      let value = 'em-self'; // default (neither selected)

      // enforce mutual exclusivity (split vs self)
      if (split_brilliance && self_continuum) {
        // prioritize split
        document.getElementById('psychoscope-endless-still-continuum').checked = false;
      }

      const split = split_brilliance;
      const self = self_continuum;

      if (!split && !self) {
        value = 'em-self';
      } 
      else if (split) {
        value = finale_chant ? 'em-dbl' : 'em';
      } 
      else if (self) {
        value = finale_chant ? 'em-self-1-dbl' : 'em-self-1';
      }

      // finale cannot exist alone
      if (!split && !self && finale_chant) {
        document.getElementById('psychoscope-endless-finale-chant').checked = false;
      }

      dropdown.value = value;
    }

    return {
      tree: tree,
      mainStat
    };
  }

  window.PSYCHOSCOPE_MODULES['endless-mind'] = { getBonuses };
})();

const aegis = document.getElementById('psychoscope-endless-aegis');


aegis.addEventListener('click', (e) => {
  e.preventDefault();
});
