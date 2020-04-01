//GLOBALS
var usrArr = [""];  //special case where user hits enter hits enter. do nothing
var countArr = [0];
var zIndex = 0;
var xMax = 16;
var yMax = 32;
var rotArr = ["rotate(0deg)", "rotate(0deg)", "rotate(0deg)", "rotate(-45deg)", "rotate(0deg)", "rotate(45deg)", "rotate(90deg)", "rotate(-90deg)"];

function onLoad() {
    const form = document.getElementById('form');
    form.addEventListener('submit', preventReload);
    const form2 = document.getElementById('form2');
    form2.addEventListener('submit', preventReload);
}

function listenInput() {
    var frag = document.getElementById("txtinput").value;
    handleInput(frag);
    console.log(usrArr);
    document.getElementById("txtinput").value = "";
    return false;
}

function preventReload(event) {
    event.preventDefault();
}

function listenTitle() {
    var frag = document.getElementById("titleinput").value;
    console.log(frag);
    return false;
}

function handleInput(frag) {
    //check if frag is in usrArr
    if (frag == "") {
        return;
    }
    frag = frag.toUpperCase();  // for now, case doesn't matter
    var isNew = isNewFrag(frag);
    var container = document.getElementById("body-container");
    if (isNew === true) {
        //calculate location, create html snippet (and orientation) and insert
        //track new frag
        usrArr.push(frag);

        //create empty div
        var ele = document.createElement('div');
        //add appropriate class
        ele.classList.add("phrase");

        //position
        calcPosition(frag, ele, "phrase");

        //weight
        calcWeight(frag, ele);

        calcRotation(frag, ele);

        drawRule(frag, ele);

        //add text
        ele.innerHTML = frag;

        //add to DOM
        container.appendChild(ele);
    } else {
        //scale font
        var phrase = getDiv(frag);
        var style = window.getComputedStyle(phrase, null).getPropertyValue('font-size');
        var fontSize = parseFloat(style)/10 + 5; 
        phrase.style.fontSize = fontSize.toString() + 'rem';
    }
    //draw the shape
    drawShape(frag);
    
}

function drawShape(frag) {
    var ele = document.createElement('div');
    if (frag == "CIRCLE") {
        ele.classList.add('circle');
        ele.style.width = Math.floor(Math.random() * Math.floor(500) + 50).toString() + "px";
        ele.style.height = ele.style.width;
    } else if (frag == "RECTANGLE") {
        ele.classList.add('rectangle');
        ele.style.width = Math.floor(Math.random() * Math.floor(500) + 50).toString() + "px";
        ele.style.height = ele.style.width;
    } else if (frag == "RULE") {
        ele.classList.add('line');
        ele.style.width = Math.floor(Math.random() * Math.floor(80) + 20).toString() + "%";
        ele.style.height = Math.floor(Math.random() * Math.floor(20) + 2).toString() + "px";
        ele.style.backgroundColor = (Math.floor(Math.random) * Math.floor(100)) % 2 ? "red" : "black";
        var rotFactor = Math.floor(Math.random() * Math.floor(rotArr.length));
        ele.style.transform = rotArr[rotFactor];
        ele.style.transform = "top left";
    }
    calcPosition(frag, ele, "shape");

    var container = document.getElementById("body-container");
    container.appendChild(ele);
}

function calcWeight(frag, ele) {
    if (frag.length <= 15) {
        //short titles
        ele.style.fontWeight = "900";
        ele.style.fontSize = "12rem";
        ele.style.color = "var(--head-color)";
    }
    else if (frag.length < 25 && frag.length > 15) {
        //subtitles
        ele.style.fontWeight = "900";
        ele.style.color = "var(--sub-color)";
    }
    else if (frag.length < 50 && frag.length >= 25) {
        //catchphrase
        ele.style.fontSize = "7rem";
        ele.style.fontWeight = "700";
        ele.style.lineHeight = "7rem";
        ele.style.color = "var(--catch-color)";
    } else if (frag.length >= 50) {
        //body text
        ele.style.fontFamily = "nimbus-sans-condensed";
        ele.style.fontWeight = "400";
        ele.style.fontSize = "3rem";
        ele.style.lineHeight = "3.2rem";
        ele.style.color = "var(--text-color)";
    }
}

function calcPosition(frag, ele, objType) {
    //calculate internal coordinates of x and y
    if (objType == "phrase") {
        var hashed = murmur(frag, Math.floor(Math.random() * Math.floor(99)) + 1);
        var x = hashed % xMax;
        var y = hashed % yMax;
    } else if (objType == "shape") {
        var hashed = Math.floor(Math.random() * Math.floor(10000) + 1);
        var x = hashed % xMax;
        var y = hashed % yMax;
    }
    //correct for offscreen placement
    var ycoord = y * Math.floor(window.innerHeight / yMax);
    ycoord =  (ycoord > window.innerHeight - 200) ? (window.innerHeight - 200) : (ycoord);
    ycoord =  (ycoord < 200) ? (200) : (ycoord);
    var xcoord = x * Math.floor(window.innerWidth / xMax);
    xcoord =  (xcoord > window.innerWidth - 200) ? (window.innerWidth - 200) : (xcoord);
    xcoord =  (xcoord < 200) ? (200) : (xcoord);

    //position new element using absolute px
    ele.style.top = ycoord.toString() + "px";
    ele.style.left = xcoord.toString() + "px";
    ele.style.zIndex = zIndex.toString();
    zIndex++;
}

function drawRule(frag, ele) {
    if (frag[0] == "-" || frag[0] == "_" || frag[0] == "=" || frag[0] == "+" || frag[0] == "|" || frag[0] == "/" || frag[0] ==">" || frag[0] == "<" || frag[0] == "*") {
        var rotFactor = Math.floor(Math.random() * Math.floor(rotArr.length));
        ele.style.transform = rotArr[rotFactor];
        ele.style.transform = "top left";
    }
}

function calcRotation(frag, ele) {
    //count vowels in word
    var count = 0;
    for (var i=0; i<frag.length; i++) {
        if (frag[i] == "A" || frag[i] == "E" || frag[i] == "I" || frag[i] == "O" || frag[i] == "U") {
            count++;
        }
    }
    
    var rotFactor = count % rotArr.length;
    ele.style.transform = rotArr[rotFactor];
    ele.style.transform = "top left";
}

function parseFontSize(sizeStr) {
    var nums = "";
    console.log(sizeStr);
    for (var i=0; i<sizeStr.length; i++) {
        if (typeof(parseInt(sizeStr[i], 10))) {
            nums = nums + sizeStr[i];
        }
    }
    return parseInt(nums, 10);
}

function getDiv(frag) {
    var found;
    phraseDivs = document.getElementsByClassName("phrase");
    console.log(phraseDivs);
    for (var i = 0; i < phraseDivs.length; i++) {
        if (phraseDivs[i].textContent == frag) {
          found = phraseDivs[i];
          break;
        }
    }
    return found;
}

function isNewFrag(frag) {
    var isNew = true;
    console.log(frag);
    for (var i=0; i<usrArr.length; i++) {
        if (usrArr[i] === frag) {
            isNew = false;
            break;
        }
    }
    return isNew;
}

//THIS FUNCTION IS USED TO GENERATE A HASH CODE FOR A STRING WITH MINIMAL COLLISIONS.
// I found this function online, the link to the author's github is provided in the following comment:
/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash 
 */
function murmur(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
	
	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;
	
	while (i < bytes) {
	  	k1 = 
	  	  ((key.charCodeAt(i) & 0xff)) |
	  	  ((key.charCodeAt(++i) & 0xff) << 8) |
	  	  ((key.charCodeAt(++i) & 0xff) << 16) |
	  	  ((key.charCodeAt(++i) & 0xff) << 24);
		++i;
		
		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}
	
	k1 = 0;
	
	switch (remainder) {
		case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1: k1 ^= (key.charCodeAt(i) & 0xff);
		
		k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= k1;
	}
	
	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}