(function(){
  function by(id){ return document.getElementById(id); }
  function enableButton(){
    document.querySelectorAll('button[onclick="createEOObservation()"]')
      .forEach(function(b){
        b.disabled=false;
        b.removeAttribute('aria-disabled');
        b.style.pointerEvents='auto';
        b.style.opacity='1';
      });
  }

  window.createEOObservation=function(){
    try{
      var live=window.ANVORA_LIVE_ACQUISITIONS;
      var items=live && live.response && Array.isArray(live.response.items) ? live.response.items : [];
      if(!items.length){
        var status=by('acqStatus');
        if(status) status.innerHTML='<div class="control-row"><div><b>No live acquisition is loaded</b><small>Run “Discover live acquisitions” first.</small></div><span class="pill warn">Needs acquisition</span></div>';
        alert('Please run “Discover live acquisitions” first.');
        return false;
      }

      var radios=Array.prototype.slice.call(document.querySelectorAll('input[name="eoAcqSelect"]'));
      var idx=radios.findIndex(function(r){return r.checked;});
      if(idx<0 || !items[idx]) idx=0;
      if(radios[idx]) radios[idx].checked=true;

      var item=items[idx];
      var p=typeof acqPayload==='function' ? acqPayload() : {plotId:'UNASSIGNED',bbox:null,collection:'sentinel-1-grd'};
      var bbox=item.bbox || null;
      var spatial=(typeof bboxIntersects==='function' && bbox && p.bbox) ? bboxIntersects(bbox,p.bbox) : null;

      var observation={
        observationId:'EO-'+Date.now().toString(36).toUpperCase(),
        plotId:p.plotId || 'UNASSIGNED',
        source:'Copernicus Data Space',
        mission:(p.collection||'sentinel-1-grd').indexOf('sentinel-1')>=0 ? 'Sentinel-1' : 'Sentinel-2',
        productCollection:p.collection || 'sentinel-1-grd',
        acquisitionId:item.id || null,
        acquisitionDateTime:item.datetime || null,
        stacItemUrl:item.self || item.href || null,
        requestedBbox:p.bbox || null,
        catalogueBbox:bbox,
        spatialMatch:spatial===null ? 'Not assessed' : (spatial ? 'Consistent' : 'Review'),
        temporalMatch:item.datetime ? 'Confirmed' : 'Not assessed',
        practiceSignal:'Not assessed',
        derivedMetrics:[],
        processingStatus:'METADATA_ONLY',
        algorithmVersion:'ANVORA-EO-META-0.2',
        createdAt:new Date().toISOString(),
        provenance:{
          catalogueEndpoint:'https://stac.dataspace.copernicus.eu/v1/search',
          request:live.request || null,
          sourceRecord:'Live STAC acquisition metadata'
        },
        assuranceNote:'Catalogue metadata confirms an acquisition context; it does not by itself prove wet/dry conditions, AWD events, irrigation practice or farmer action.'
      };

      window.ANVORA_EO_OBSERVATION=observation;
      if(by('eoAcqId')) by('eoAcqId').textContent=(item.id||'—').slice(0,24)+(item.id&&item.id.length>24?'…':'');
      if(by('eoSpatial')) by('eoSpatial').textContent=observation.spatialMatch;
      if(by('eoTemporal')) by('eoTemporal').textContent=observation.temporalMatch;
      if(by('eoPractice')) by('eoPractice').textContent='Not assessed';

      if(by('eoRecord')) by('eoRecord').innerHTML=[
        ['Observation ID',observation.observationId],
        ['Plot',observation.plotId],
        ['Acquisition',observation.acquisitionId],
        ['Acquired',typeof fmtDate==='function' ? fmtDate(observation.acquisitionDateTime) : observation.acquisitionDateTime],
        ['Processing',observation.processingStatus],
        ['Algorithm',observation.algorithmVersion]
      ].map(function(x){
        return '<div class="control-row"><div><b>'+esc(x[0])+'</b><small>'+esc(x[1]||'—')+'</small></div><span class="pill">Recorded</span></div>';
      }).join('');

      if(by('eoQuality')) by('eoQuality').innerHTML=
        '<div class="control-row"><div><b>Spatial catalogue match</b><small>'+esc(observation.spatialMatch)+' · returned STAC footprint/bbox compared with the requested plot.</small></div><span class="pill">'+esc(observation.spatialMatch)+'</span></div>'+ 
        '<div class="control-row"><div><b>Practice inference</b><small>Wet/dry, AWD and drainage remain unassessed until authenticated imagery processing and validation.</small></div><span class="pill">Not assessed</span></div>'+ 
        '<div class="control-row"><div><b>Evidence class</b><small>Live acquisition metadata; not independent practice verification.</small></div><span class="pill">Metadata</span></div>';

      if(by('eoJson')) by('eoJson').textContent=JSON.stringify(observation,null,2);
      enableButton();
      return false;
    }catch(err){
      console.error('ANVORA observation record error',err);
      alert('Observation record could not be created: '+(err&&err.message?err.message:String(err)));
      return false;
    }
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enableButton);
  else enableButton();
})();
