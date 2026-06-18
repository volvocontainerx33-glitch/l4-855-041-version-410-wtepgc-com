(function(){
  var btn=document.querySelector('[data-menu]');
  var nav=document.querySelector('[data-mobile-nav]');
  if(btn&&nav){btn.addEventListener('click',function(){nav.classList.toggle('open');});}
  var slides=[].slice.call(document.querySelectorAll('.hero-slide'));
  var dots=[].slice.call(document.querySelectorAll('.hero-dots button'));
  if(slides.length){
    var at=0;
    var show=function(i){slides[at].classList.remove('active');if(dots[at])dots[at].classList.remove('active');at=(i+slides.length)%slides.length;slides[at].classList.add('active');if(dots[at])dots[at].classList.add('active');};
    dots.forEach(function(d,i){d.addEventListener('click',function(){show(i);});});
    setInterval(function(){show(at+1);},5200);
  }
  var search=document.querySelector('[data-search-input]');
  var cat=document.querySelector('[data-filter-category]');
  var year=document.querySelector('[data-filter-year]');
  var cards=[].slice.call(document.querySelectorAll('[data-movie-card]'));
  var empty=document.querySelector('[data-empty]');
  var apply=function(){
    var q=(search&&search.value||'').trim().toLowerCase();
    var c=cat&&cat.value||'';
    var y=year&&year.value||'';
    var n=0;
    cards.forEach(function(card){
      var t=(card.getAttribute('data-title')+' '+card.getAttribute('data-tags')+' '+card.getAttribute('data-region')+' '+card.getAttribute('data-genre')).toLowerCase();
      var ok=(!q||t.indexOf(q)>-1)&&(!c||card.getAttribute('data-category')===c)&&(!y||card.getAttribute('data-year')===y);
      card.classList.toggle('hide-card',!ok);
      if(ok)n++;
    });
    if(empty)empty.classList.toggle('show',n===0);
  };
  [search,cat,year].forEach(function(el){if(el)el.addEventListener('input',apply);});
})();