var tracker;
var numSections = 9;
var activeSection = "1";
var stateobj;
var sections = [];

class Section {
  constructor(idnum, offset) {
    this.id = idnum;
    this.start;
    this.end;
    this.update(offset);
  }

  isInView() {
    var scrollH = window.scrollY;
    return (this.start <= scrollH && this.end > scrollH);
  }

  update(offset) {
    var ele = this.getEle();
    this.start = offset;
    var h = parseInt(ele.scrollHeight);
    var bigImgH = document.getElementById('big-img').clientHeight;
    console.log(bigImgH, h);
    if (h < bigImgH) {
      ele.style.paddingBottom = (bigImgH - h).toString() + "px";
      h = bigImgH;
    }
    this.end = this.start + h;
    
    // ele.style.top = (this.start).toString() + "px";
  }

  getEle() {
    return document.getElementById(this.id.toString());
  }
}

class StateHandler {
  constructor() {
    sections.push(new Section(0,0));
    this.activeSection = 0;
    this.imgs = [];
    for (var i=1; i<numSections; i++) {
      var last = sections[i-1].end;
      sections.push(new Section(i, last));
    }
    console.log(sections);
  }

  updateBigImg() {
    var viewport = parseInt(window.innerHeight);
    var currHeight = parseInt(window.scrollY);

    for (var i=0; i<sections.length; i++) {
      var container = document.getElementById("big-img-container");

      //if current between start and end of section, replace img in src with one matching that section
      //also update text here
      if (sections[i].start <= currHeight && sections[i].end > currHeight) {
        var img = document.getElementById('big-img');
        img.src = "img/og/" + i.toString() + ".jpg";
        console.log(img.src);
        img.alt = info[i].url;

        updateSrcTxt(i);
      }
    }
  }
}

function updateSrcTxt(idNum) {
  var title = document.getElementById('src-title'); 
  title.innerHTML = info[idNum].title + ", <span class='year'>" + info[idNum].year + ".</span>";
  title.onclick = function() { window.location.href = info[idNum].url; }
  var designer = document.getElementById('src-author');
  designer.innerHTML = "Designer: " + info[idNum].author + ".";  

  var ul = document.getElementById('src-attrib');
  ul.innerHTML = "";
  for (var i=0; i<info[idNum].attributes.length; i++) {
    ul.innerHTML += "<li>" + info[idNum].attributes[i] + "</li>";
  }
}

function updateSections() {
  for (var i=0; i<sections.length; i++) {
    var offset = (i==0) ? 0 : sections[i-1].end;
    sections[i].update(offset);
  }
  console.log(sections);
}

function resizeGrid () {
  // if (window.innerWidth < 1875) {
    var rightBound = document.getElementById('scrollbar').offsetLeft;
    let root = document.documentElement;
    root.style.setProperty('--right-col', rightBound.toString() + "px");
  // }
}

function handleResize() {
  moveScrollBar();
  updateScrollBar();
  resizeGrid();
  updateSections();
}

function fullscreen(ele) {
  var container = document.getElementById('full-screen');
  var img = document.getElementById('full-img');

  var thumb = document.getElementById('thumb' + ele.id);
  img.src = thumb.src;
  container.style.display = "block";
}

function closeFullscreen() {
  var container = document.getElementById('full-screen');
  container.style.display = "none";
}

function updateInfo(ele) {
  var title = document.getElementById('gen-title'); 
  title.innerHTML = genInfo[ele.id].title + ", <span class='year'>" + genInfo[ele.id].year + ".</span>";

  var ul = document.getElementById('gen-attrib');
  ul.innerHTML = "";
  for (var i=0; i<genInfo[ele.id].attributes.length; i++) {
    ul.innerHTML += "<li>" + genInfo[ele.id].attributes[i] + "</li>";
  }
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function onLoad() {
    stateobj = new StateHandler();
    tracker = appear({
        init: function init(){
          console.log('dom is ready');
        },
        elements: function elements(){
          // work with all elements with the class "track"
          return document.getElementsByClassName('track');
        },
        appear: function appear(el){
          console.log('visible', el);
        },
        disappear: function disappear(el){
          console.log('no longer visible', el);
        },
        bounds: 200,
        reappear: true
      });
      window.addEventListener('scroll', updateScrollBar);
      window.addEventListener('scroll', stateobj.updateBigImg);
      window.addEventListener('resize', handleResize);
      stateobj.updateBigImg();
}

