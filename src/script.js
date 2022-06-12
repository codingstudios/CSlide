const slide = document.getElementById("slide");
var pages = slide.childElementCount;
var page = 0;
var scrollAmount = 0;

const debounce = (cb) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args)
      }, 50)
    }
}

const updateURL = debounce((pg) => { window.location.hash = `${pg}`; });

slide.addEventListener('scroll', () => {
   page = Math.floor(slide.scrollLeft / 1440);
   scrollAmount = page * 1440; 
   updateURL(page);
});


slide.onclick = (e) => {
  var center = (slide.scrollLeft + 1440) / 2;
  console.log(center, slide.scrollLeft)
  if(e.layerX <= center) {
    console.log('left', e.layerX)
  }else {
    console.log('right', e.layerX)
  }
  scrollAmount += 1440;
  if((scrollAmount / 1440) == pages) scrollAmount = 0;
  //slide.scrollTo({ left: scrollAmount, behavior: 'smooth' });
};

// document.addEventListener("onclick").onclick = () => {
//   //console.log('left')
//   if(scrollAmount == 0)return;
//   slide.scrollTo({ left: scrollAmount -= 1440, behavior: 'smooth' });
// }
