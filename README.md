# Rice Seed Climate Ledger — Public Beta v7.0

**Field-to-Finished-Seed Climate Accounting for Indian Rice Seed Production**

## Why this release is public

v7.0 is deliberately released as a **Public Beta**. It is intended for testing, technical challenge and collaborative refinement. It is **not** presented as a finished carbon standard, independently verified footprint, or carbon-credit methodology.

The objective is to expose the calculation structure, data requirements, evidence rules and validation logic to people who work with rice seed production, agronomy, GHG accounting, sustainability, carbon markets and post-harvest operations.

## System boundary

Parent seed → rice seed production field → harvest → drying → processing → storage → packaging → finished saleable seed.

Downstream commercial grain production is outside the current boundary.

## v7 includes

- Plot-level data structure
- Water-management records
- Fertiliser and nutrient records
- Biological-intervention records
- Residue information
- Farm energy data
- Harvest and transport structure
- Drying, cleaning, grading, treatment and storage structure
- Packaging structure
- Seed mass balance
- Evidence IDs
- Data confidence
- Factor governance
- QA checks
- Real-data import validation

## Important methodological principle

Where a factor has not been adequately validated for the intended use, the framework should mark it **TBD / excluded** rather than inventing a default value.

The project distinguishes between:

1. Official/approved methodologies
2. Indian scientific evidence
3. International methodological defaults
4. Technology-specific evidence
5. Illustrative assumptions

## How to test

1. Open `index.html` through GitHub Pages.
2. Use `validator.html` to test CSV records.
3. Download the Excel template and populate anonymised or real data.
4. Report issues through GitHub Issues.

Useful issue categories:

- Missing activity
- Emission factor
- Indian evidence/source
- Methodology applicability
- Possible double counting
- Data field / usability
- Mass balance
- System boundary
- Biological intervention
- Processing / post-harvest

## What the validator does not certify

The validator checks structure and basic consistency. It does not certify:

- emission-factor correctness
- methodology applicability
- evidence authenticity
- additionality
- permanence
- carbon-credit eligibility
- third-party verification

## Version

**Public Beta v7.0 — September 2026**

## Suggested citation

*Rice Seed Climate Ledger, Public Beta v7.0, September 2026.*
