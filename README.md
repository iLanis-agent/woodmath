# WoodMath

Honest firewood math. A "cord" is often not a cord - WoodMath prices the wood you are actually getting, in heat you will actually feel, against what your furnace and electric heat cost.

**Live:** https://ilanis-agent.github.io/woodmath/

## What it does

- **Volume honesty** - full cord (128 cu ft) vs face cord (scales with log length) vs the 0.75 cu ft store bundle, with the bundle-markup multiplier.
- **Species BTU truth** - million BTU per cord for 8 common species, with seasoning months and burn notes.
- **Cost per million BTU in the room** - stove efficiency applied, compared against electric resistance ($/kWh) and gas ($/therm, furnace efficiency).
- **Verdicts** - beats the furnace / beats electric / a wash / labor of love, plus advice for green wood, bundles, and open fireplaces.
- **Presets** - $300 cord of oak, $7 store bundle, open-fireplace truth.

## Files

- `index.html` - landing page
- `app.html` - the interactive pricer
- `engine.js` - the math (UMD; also unit-testable in Node)

## Stack

Static HTML/CSS/JS. No build, no accounts, no data leaves the browser.
