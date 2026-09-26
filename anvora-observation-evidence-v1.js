/* ANVORA Observation Evidence Layer v1
 * UI/data contract for plain-language EO findings and visual evidence.
 * This module does not claim an event from satellite metrics alone.
 */
window.ANVORA_OBSERVATION_EVIDENCE_V1 = {
  version: 'ANVORA-EO-EVIDENCE-1.0',
  eventTypes: {
    drainage: {
      label: 'Possible drainage event',
      observed: 'Radar response changed materially between the comparison observations.',
      interpretation: 'The change is consistent with a change in surface-water or moisture conditions.',
      limitation: 'Satellite evidence alone does not prove that a drainage action was performed.'
    },
    moisture: {
      label: 'Moisture condition change',
      observed: 'The field shows a measurable change in radar response between observations.',
      interpretation: 'The change is consistent with a change in surface moisture conditions.',
      limitation: 'Remote sensing alone does not establish the exact field operation that caused the change.'
    },
    fertilizer: {
      label: 'Possible crop-response signal',
      observed: 'A change in the observed crop/field signal was detected.',
      interpretation: 'The response may be consistent with a change in crop condition.',
      limitation: 'Satellite evidence alone does not prove fertilizer application.'
    }
  },
  evidenceStrength: function(metrics) {
    if (!metrics) return 'Not assessed';
    const n = Number(metrics.sampleCount || 0);
    if (n >= 500) return 'Strong measurement support';
    if (n >= 100) return 'Moderate measurement support';
    return 'Limited measurement support';
  },
  build: function(type, metrics, provenance) {
    const spec = this.eventTypes[type] || this.eventTypes.moisture;
    return {
      eventType: type,
      plainLanguage: spec.label,
      observed: spec.observed,
      interpretation: spec.interpretation,
      limitation: spec.limitation,
      evidenceStrength: this.evidenceStrength(metrics),
      visualEvidence: {
        required: true,
        type: 'satellite-observation',
        acquisitionDateTime: provenance?.acquisitionDateTime || null,
        source: provenance?.source || 'Copernicus Data Space',
        stacItemUrl: provenance?.stacItemUrl || null,
        displayRequirements: ['field boundary', 'observation date', 'before/after where available', 'processing footprint']
      },
      audit: {
        algorithmVersion: this.version,
        provenance: provenance || null
      }
    };
  }
};
