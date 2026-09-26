/* WoodMath engine - honest firewood math. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WoodMath = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  // Million BTU per full cord (seasoned), months to season, notes.
  var SPECIES = [
    { id: 'hickory', name: 'Hickory',       mbtu: 28.5, season: 12, note: 'Top heat, slow starter' },
    { id: 'oak',     name: 'Oak (red)',     mbtu: 24.6, season: 24, note: 'The benchmark cord' },
    { id: 'beech',   name: 'Beech',         mbtu: 27.5, season: 12, note: 'Burns clean, few sparks' },
    { id: 'ash',     name: 'Ash',           mbtu: 24.2, season: 6,  note: 'Burns even half-green' },
    { id: 'maple',   name: 'Maple (sugar)', mbtu: 24.0, season: 12, note: 'Steady, easy splitter' },
    { id: 'birch',   name: 'Birch',         mbtu: 20.8, season: 12, note: 'Bright flame, burns fast' },
    { id: 'fir',     name: 'Douglas fir',   mbtu: 18.0, season: 12, note: 'Good shoulder-season wood' },
    { id: 'pine',    name: 'Pine',          mbtu: 15.9, season: 6,  note: 'Kindling king, creosote if green' }
  ];

  var CORD_CUFT = 128; // 4ft x 4ft x 8ft stacked

  // How many real cubic feet the deal actually delivers.
  function cubicFeet(unit, count, logInches) {
    if (unit === 'cord') return CORD_CUFT * count;
    if (unit === 'face') return CORD_CUFT * (logInches / 48) * count; // 4x8 face x log length
    if (unit === 'bundle') return 0.75 * count; // the 0.75 cu ft store bundle
    return 0;
  }

  function cordsDelivered(unit, count, logInches) {
    return cubicFeet(unit, count, logInches) / CORD_CUFT;
  }

  // Effective cost per million BTU delivered to the room (stove efficiency applied).
  function costPerMbtu(price, species, unit, count, logInches, stoveEff) {
    var cords = cordsDelivered(unit, count, logInches);
    if (cords <= 0 || price <= 0) return Infinity;
    var delivered = cords * species.mbtu * stoveEff; // MBTU into the room
    return price / delivered;
  }

  // Comparison fuels: cost per MBTU into the room.
  function electricCostPerMbtu(pricePerKwh) {
    return pricePerKwh / 0.003412; // 1 kWh = 3412 BTU, ~100% efficient
  }
  function gasCostPerMbtu(pricePerTherm, furnaceEff) {
    return pricePerTherm * 10 / furnaceEff; // 1 therm = 100k BTU
  }

  // Bundle trap: how expensive a store bundle is per MBTU vs a cord price.
  function bundleMarkup(bundlePrice, species, cordPrice) {
    var perBundleMbtu = (0.75 / CORD_CUFT) * species.mbtu;
    var bundleCpm = bundlePrice / perBundleMbtu;
    var cordCpm = cordPrice / species.mbtu;
    return { bundleCpm: bundleCpm, cordCpm: cordCpm, multiple: Math.round(bundleCpm / cordCpm * 10) / 10 };
  }

  function verdict(woodCpm, elecCpm, gasCpm) {
    if (woodCpm <= gasCpm * 1.05) return { code: 'beats-gas', label: 'Beats the furnace' };
    if (woodCpm <= elecCpm * 0.9) return { code: 'beats-electric', label: 'Beats electric heat' };
    if (woodCpm <= elecCpm * 1.15) return { code: 'wash', label: 'Close to a wash' };
    return { code: 'labor-of-love', label: 'Burn it for the soul, not the math' };
  }

  function seasonVerdict(species, monthsSplit) {
    if (monthsSplit >= species.season) return { ready: true, label: 'Seasoned - burns now' };
    var left = species.season - monthsSplit;
    return { ready: false, label: 'Green - needs ' + left + ' more month' + (left === 1 ? '' : 's') };
  }

  function fmtMoney(x) { return '$' + x.toFixed(2); }

  return {
    SPECIES: SPECIES,
    CORD_CUFT: CORD_CUFT,
    cubicFeet: cubicFeet,
    cordsDelivered: cordsDelivered,
    costPerMbtu: costPerMbtu,
    electricCostPerMbtu: electricCostPerMbtu,
    gasCostPerMbtu: gasCostPerMbtu,
    bundleMarkup: bundleMarkup,
    verdict: verdict,
    seasonVerdict: seasonVerdict,
    fmtMoney: fmtMoney
  };
});
