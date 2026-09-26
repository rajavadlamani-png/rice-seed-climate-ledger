/* ANVORA Observation Evidence Layer v1
 * Plain-language interpretation + evidence/provenance contract.
 * It does not claim an event from satellite metrics alone.
 */
window.ANVORA_OBSERVATION_EVIDENCE_V1 = {
  version:'ANVORA-EO-EVIDENCE-1.1',
  eventTypes:{
    drainage:{label:'Possible drainage event',observed:'Radar response changed materially between the comparison observations.',interpretation:'The change is consistent with a change in surface-water or moisture conditions.',limitation:'Satellite evidence alone does not prove that a drainage action was performed.'},
    moisture:{label:'Moisture condition change',observed:'The field shows a measurable change in radar response between observations.',interpretation:'The change is consistent with a change in surface moisture conditions.',limitation:'Remote sensing alone does not establish the exact field operation that caused the change.'},
    fertilizer:{label:'Possible crop-response signal',observed:'A change in the observed crop/field signal was detected.',interpretation:'The response may be consistent with a change in crop condition.',limitation:'Satellite evidence alone does not prove fertilizer application.'}
  },
  evidenceStrength:function(metrics){
    if(!metrics)return 'Not assessed';
    const n=Number(metrics.sampleCount||0);
    if(n>=500)return 'Strong measurement support';
    if(n>=100)return 'Moderate measurement support';
    return 'Limited measurement support';
  },
  build:function(type,metrics,provenance,imageUrl){
    const spec=this.eventTypes[type]||this.eventTypes.moisture;
    return {eventType:type,plainLanguage:spec.label,observed:spec.observed,interpretation:spec.interpretation,limitation:spec.limitation,evidenceStrength:this.evidenceStrength(metrics),visualEvidence:{required:true,type:'satellite-observation',imageUrl:imageUrl||null,acquisitionDateTime:provenance?.acquisitionDateTime||null,source:provenance?.source||'Copernicus Data Space',stacItemUrl:provenance?.stacItemUrl||null,displayRequirements:['field boundary','observation date','before/after where available','processing footprint']},audit:{algorithmVersion:this.version,provenance:provenance||null}};
  }
};

(function(){
  function esc(v){return String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));}
  function currentObservation(){return window.ANVORA_EO_OBSERVATION||window.ANVORA_CURRENT_OBSERVATION||null;}
  function render(){
    if(document.getElementById('anvoraObservationEvidence'))return;
    const host=document.querySelector('#remoteEvidence, [data-page="remote-evidence"], .page.active');
    if(!host)return;
    const box=document.createElement('div');box.id='anvoraObservationEvidence';box.className='card';box.style.marginTop='16px';
    box.innerHTML='<div class="kicker">ANVORA Evidence Interpretation</div><h2>Observation finding</h2><p class="muted">Convert processed remote evidence into a plain-language finding without overstating what the data proves.</p><div class="grid g2"><div><label>Observation type</label><select id="anvEvidenceType"><option value="moisture">Moisture condition change</option><option value="drainage">Possible drainage event</option><option value="fertilizer">Possible crop-response signal</option></select></div><div><label>Evidence strength</label><div id="anvEvidenceStrength" class="pill warn">Not assessed</div></div></div><div id="anvEvidenceResult" class="notice" style="margin-top:14px">Run Sentinel-1 processing first. This panel will use the measured result and provenance; it will not infer a field operation from metadata alone.</div><div class="grid g2" style="margin-top:14px"><div class="card"><h3>Visual evidence</h3><div id="anvEvidenceImage" class="notice warning">No processed imagery is attached yet. A catalogue URL is not treated as a picture.</div></div><div class="card"><h3>Evidence boundary</h3><div id="anvEvidenceLimit" class="muted">The final finding will explicitly state what is observed, what the signal is consistent with, and what is not established.</div></div></div>';
    host.appendChild(box);
    document.getElementById('anvEvidenceType').addEventListener('change',update);
    update();
  }
  function update(){
    const o=currentObservation();const type=document.getElementById('anvEvidenceType')?.value||'moisture';
    const spec=window.ANVORA_OBSERVATION_EVIDENCE_V1.eventTypes[type];
    const metrics=o?.derivedMetrics?.[0]||o?.metrics||null;
    const strength=window.ANVORA_OBSERVATION_EVIDENCE_V1.evidenceStrength(metrics);
    const s=document.getElementById('anvEvidenceStrength');if(s){s.textContent=strength;s.className='pill '+(strength==='Strong measurement support'?'':'warn');}
    const r=document.getElementById('anvEvidenceResult');if(r)r.innerHTML='<strong>'+esc(spec.label)+'</strong><br><b>Observed:</b> '+esc(spec.observed)+'<br><b>Interpretation:</b> '+esc(spec.interpretation)+'<br><b>Not established:</b> '+esc(spec.limitation);
    const im=document.getElementById('anvEvidenceImage');const url=o?.visualEvidence?.imageUrl||o?.imageUrl||null;
    if(im&&url)im.innerHTML='<img src="'+esc(url)+'" alt="Satellite evidence for the selected observation" style="width:100%;max-height:360px;object-fit:contain;border-radius:8px"><div class="muted" style="margin-top:6px">Source: '+esc(o?.source||'Copernicus Data Space')+' · '+esc(o?.acquisitionDateTime||'Acquisition date not available')+'</div>';
  }
  function boot(){setTimeout(render,500);setTimeout(render,1800);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.ANVORA_REFRESH_OBSERVATION_EVIDENCE=update;
})();
