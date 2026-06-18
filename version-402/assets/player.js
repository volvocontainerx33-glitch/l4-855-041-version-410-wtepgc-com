function initMoviePlayer(u){
  var v=document.getElementById('movieVideo');
  var layer=document.querySelector('.play-layer');
  var btn=document.querySelector('[data-play-button]');
  var ready=false;
  function load(){
    if(ready||!v)return;
    ready=true;
    if(v.canPlayType('application/vnd.apple.mpegurl')){v.src=u;}
    else if(window.Hls&&window.Hls.isSupported()){var h=new window.Hls();h.loadSource(u);h.attachMedia(v);}
    else{v.src=u;}
  }
  function go(){
    load();
    if(layer)layer.classList.add('is-hidden');
    v.setAttribute('controls','controls');
    var p=v.play();
    if(p&&p.catch)p.catch(function(){});
  }
  if(btn)btn.addEventListener('click',go);
  if(layer)layer.addEventListener('click',go);
  if(v)v.addEventListener('click',function(){if(!ready||v.paused)go();else v.pause();});
}