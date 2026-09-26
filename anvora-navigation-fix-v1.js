/* ANVORA Navigation Fix v1
 * Keeps the navigation visible when moving between pages, including Remote Connectors.
 * The existing v4.5.2 POC UI hid the nav by adding body.poc-connectors-active.
 */
(function(){
  function clearPOCState(){
    document.body.classList.remove('poc-connectors-active');
    const nav=document.querySelector('nav');
    if(nav){
      nav.style.transform='';
      nav.style.boxShadow='';
    }
    const btn=document.querySelector('.anvora-sidebar-toggle');
    if(btn && !document.body.classList.contains('sidebar-collapsed')){
      btn.textContent='‹';
      btn.setAttribute('aria-label','Collapse ANVORA navigation');
    }
  }

  function install(){
    clearPOCState();

    // Keep the sidebar visible after every page navigation.
    const existingShowPage=window.showPage;
    if(typeof existingShowPage==='function' && !existingShowPage.__anvoraNavFix){
      const fixedShowPage=function(id){
        const result=existingShowPage.apply(this,arguments);
        clearPOCState();
        setTimeout(clearPOCState,0);
        setTimeout(clearPOCState,50);
        return result;
      };
      fixedShowPage.__anvoraNavFix=true;
      window.showPage=fixedShowPage;
    }

    // The old POC listener runs asynchronously after the Connectors click.
    // Clear its class after that listener has fired as well.
    document.querySelectorAll('.secondary-nav button[data-page]').forEach(button=>{
      if(button.__anvoraNavFixBound)return;
      button.__anvoraNavFixBound=true;
      button.addEventListener('click',function(){
        setTimeout(clearPOCState,0);
        setTimeout(clearPOCState,50);
        setTimeout(clearPOCState,150);
      });
    });

    // If another script changes the class later, restore the normal navigation state.
    const observer=new MutationObserver(function(){
      if(document.body.classList.contains('poc-connectors-active')){
        clearPOCState();
      }
    });
    observer.observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(install,100));
  }else{
    setTimeout(install,100);
  }
})();
