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
  window.IMAGINES['bloodthirsty-furball'] = { provideBonuses };
})();