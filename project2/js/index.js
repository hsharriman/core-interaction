class TextObject {
    constructor(inTag, id, classType) {
        this.ele = {innerHTML: ""};
        this.inTag = inTag;
        this.id = id;
        this.classType = classType;
        this.isHorizontal = true;
    }

    updateText(rmin, rmax) {
        var newText = document.getElementById(this.inTag).value;
        console.log(newText);
        // if (this.ele.innerHTML != newText) {
        //     this.addText(newText);
        //     this.setPosition(rmin, rmax);
        // }
        //try changing on every generate
        this.addText(newText);
        this.setPosition(rmin, rmax);
    }

    addText(frag) {
        if (frag == "") { return; }

        if (document.getElementById(this.id) != null) {
            // this.ele = document.getElementById(this.id);
            this.ele.innerHTML = frag;
        } else {
            this.ele = document.createElement('div');
            this.ele.id = this.id;
            this.ele.classList.add(this.classType);

            this.ele.innerHTML = frag;
            var container = document.getElementById("text-grid");
            container.appendChild(this.ele);
        }
    }

    setCase(isUpper) {
        if (isUpper) {
            this.ele.innerHTML = this.ele.innerHTML.toUpperCase();
        } else {
            this.ele.innerHTML = this.ele.innerHTML.toLowerCase();
        }
    }

    setPosition(rmin, rmax) {
        //pick an orientation,
        if (this.ele.style != null) {
            this.setOrientation();

            //set position on grid
            this.ele.style.gridColumnStart = randomNumber(cols-2).toString();
    
            var row = randomNumber(rmax);
            if (row < rmin) { row = rmin; }
            this.ele.style.gridRowStart = row.toString();
        }
    }

    setColor(color) {
        if (this.ele.style != null) {
            this.ele.style.color = color;
        }
    }

    setOrientation() {
        if (randomNumber(100) <= 40) {
            this.ele.style.transform = "rotate(90deg)";
        } else {
            this.ele.style.transform = "rotate(0deg)";
        }
    }
}

class ArtObject {
    constructor() {        
        this.titleMin = 3;
        this.titleMax;
        this.subsMin;
        this.subsMax;
        this.textMin;
        this.textMax = rows - 2;
        this.calculateTextBounds();
        
        this.title = new TextObject("titleinput", "title", "title");
        this.subs = [new TextObject("subinput", "subtitle", "subtitle"),
                    new TextObject("subinput2", "subtitle2", "subtitle"),
                    new TextObject("subinput3", "subtitle3", "subtitle")];
        this.text = new TextObject("txtinput", "text", "text");
    }

    update() {
        this.calculateTextBounds();
        this.title.updateText(this.titleMin, this.titleMax);
        for (var i=0; i<this.subs.length; i++) {
            this.subs[i].updateText(this.subsMin, this.subsMax);
        }
        this.text.updateText(this.textMin, this.textMax);

        this.updateCaps();
        this.setColors();
    }

    calculateTextBounds() {
        this.titleMax = randomNumber(rows - 10);

        //subtitle min/max
        this.subsMin = this.titleMax + 5;
        this.subsMax = this.subsMin + randomNumber(rows - this.subsMin + 4);
        
        //text min/max
        this.textMin = this.subsMin + 2;
        this.textMax = rows - 2;
    }
    
    updateCaps() {
        var isUpper = randomNumber(100) >= 50 ? true : false;
        this.title.setCase(isUpper);
        this.subs.forEach(function(sub) {
            sub.setCase(isUpper);
        });
    }
    
    setColors() {
        var incRed = document.getElementById("include-red").checked;
        var incBlue = document.getElementById("include-blue").checked;

        if (!incRed && !incBlue) {
            this.title.setColor("black");
            this.subs.forEach(function(sub) {
                sub.setColor("black");
            });
            this.text.setColor("black");
        } else if (incRed && !incBlue) {
            this.colorHelper("red");
        } else if (incBlue && !incRed) {
            this.colorHelper("var(--blue-color)");
        } else if (incRed && incBlue) {
            var maxRed = 1;
            var maxBlue = 1;
            for (var i=0; i<3; i++) {
                var activeColor = (randomNumber(10) < 6 && maxRed > 0) ? "red" : "var(--blue-color)";
                if (i==0) {
                    if (randomNumber(10) > 8) {
                        this.title.setColor(activeColor);
                        if (activeColor == "red") {maxRed--;}
                        else { maxBlue--;}
                    } else {
                        this.title.setColor('black');
                    }
                } else if (i==1) {
                    if (randomNumber(10) > 5) {
                        this.subs.forEach(function (sub) {
                            sub.setColor(activeColor);
                        });
                        if (activeColor == "red") {maxRed--;}
                        else { maxBlue--;} 
                    } else {
                        this.subs.forEach(function (sub) {
                            sub.setColor('black');
                        });
                    } 
                } else if (i==2) {
                    if (randomNumber(10) < 3) {
                        this.text.setColor(activeColor);
                        if (activeColor == "red") {maxRed--;}
                        else { maxBlue--;}
                    } else {
                        this.text.setColor('black');
                    }
                }
            }
        }
    } 
    
    colorHelper(color) {
        var max = 2;
        for (var i=0; i<3; i++) {
            if (i==0) {
                if (randomNumber(10) > 8 && max > 0) {
                    this.title.setColor(color);
                } else {
                    this.title.setColor('black');
                }
            } else if (i==1) {
                if (randomNumber(10) > 5 && max > 0) {
                    this.subs.forEach(function(sub) {
                        sub.setColor(color);
                    });
                } else {
                    this.subs.forEach(function(sub) {
                        sub.setColor('black');
                    });
                }
            } else if (i==0) {
                if (randomNumber(10) > 3 && max > 0) {
                    this.text.setColor(color);
                } else {
                    this.text.setColor('black');
                }
            }
            max--;
        }
    }
}

class ShapeObject {
    constructor() {
        this.options = ["line", "square", "line", "rectangle", "line", "circle", "line"];
        this.shapes = [];
        this.rotations = ["rotate(0deg)", "rotate(90deg)"];
    }

    update() {
        var node = document.getElementById('dec-grid');
        node.querySelectorAll('*').forEach(n => n.remove());
        var numObjs = randomNumber(10);
        for (var i=0; i<numObjs; i++) {
            var ele = document.createElement('div');
            var classType = this.options[randomNumber(this.options.length)]
            ele.classList.add(classType);

            this.setPosition(ele);
            this.setScale(ele, classType);
            this.setOrientation(ele);
            node.appendChild(ele);
        }
    }

    setPosition(ele) {
        ele.style.gridColumnStart = randomNumber(cols).toString();
        var row = randomNumber(rows);
        ele.style.gridRowStart = row.toString();
    }

    setOrientation(ele) {
        if (randomNumber(100) <= 40) {
            ele.style.transform = "rotate(90deg)";
        } else {
            ele.style.transform = "rotate(0deg)";
        }
    }

    setScale(ele, classType) {
        if (classType == "line") {
            ele.style.width = (40 + randomNumber(60)).toString() + "vw";
            ele.style.height = (2 + randomNumber(20)).toString() + "px";
        } else if (classType == "rectangle") {
            ele.style.width = (6 + randomNumber(20)).toString() + "rem";
            ele.style.height = (6 + randomNumber(20)).toString() + "rem";
        } else {
            ele.style.width = (10 + randomNumber(40)).toString() + "rem";
            ele.style.height = ele.style.width;
        }
    }
}

class PageHandler {
    constructor() {
        this.textCanvas = new ArtObject();
        this.shapeCanvas = new ShapeObject();
        this.rotArr = ["rotate(-15deg)", "rotate(-30deg)", "rotate(-60deg)"];
    }

    listenInput() {
        this.textCanvas.update();
        this.shapeCanvas.update();
        this.skewDocument();
        return false;
    }

    skewDocument() {
        var textGrid = document.getElementById('text-grid');
        var shapeGrid = document.getElementById('dec-grid');
        if (randomNumber(10) >= 7) {
            var rotInd = randomNumber(this.rotArr.length);
            textGrid.style.transform = this.rotArr[rotInd];
            shapeGrid.style.transform = this.rotArr[rotInd];
        } else {
            textGrid.style.transform = "rotate(0deg)";
            shapeGrid.style.transform = "rotate(0deg)";
        }
    }
}
//GLOBALS
// var usrArr = [""];  //special case where user hits enter hits enter. do nothing
// var zIndex = 0;
const cols = 9;
const rows = 16;
// var rotArr = ["rotate(-15deg)", "rotate(-30deg)", "rotate(-60deg)"];
// var titleMax = randomNumber(yMax - 10);
// var subsMin = titleMax + 2;
// var subsMax = subsMin + randomNumber(yMax - subsMin + 4);
// var title = new TextObject("titleinput", "title", "title");
// var subs = [new TextObject("subinput", "subtitle", "subtitle"),
//             new TextObject("subinput2", "subtitle2", "subtitle"),
//             new TextObject("subinput3", "subtitle3", "subtitle")];
// var text = new TextObject("txtinput", "text", "text");
// var incRed = false;
// var incBlue = false;
var controller = new PageHandler();

function onLoad() {
    const form = document.getElementById('form');
    form.addEventListener('submit', preventReload);
}

function preventReload(event) {
    event.preventDefault();
}

function listenInput() {
    title.updateText();
    title.setPosition()
    subs.forEach(function(sub) {
        sub.updateText();
    })
    text.updateText();


    updateCaps();
    setColors();
    skewDocument();
    return false;
}

function calculateTextBounds() {
    this.titleMax = randomNumber(rows - 10);

    //subtitle min/max
    this.subsMin = this.titleMax + 2;
    this.subsMax = this.subsMin + randomNumber(rows - this.subsMin + 4);
    
    //text min/max
    this.textMin = this.subsMin + 2;
    this.textMax = rows - 2;

    //update objects

}

function skewDocument() {
    var grid1= document.getElementById('text-grid');
    var grid2 = document.getElementById('dec-grid');
    if (randomNumber(10) >= 7) {
        var rotInd = randomNumber(rotArr.length);
        grid1.style.transform = rotArr[rotInd];
        grid2.style.transform = rotArr[rotInd];
    } else {
        grid1.style.transform = "rotate(0deg)";
        grid2.style.transform = "rotate(0deg)";
    }
}

function updateCaps() {
    var isUpper = randomNumber(100) >= 50 ? true : false;
    title.setCase(isUpper);
    subs.forEach(function(sub) {
        sub.setCase(isUpper);
    });
}

function setColors() {
    var incRed = document.getElementById("include-red").checked;
    var incBlue = document.getElementById("include-blue").checked;
    console.log(incRed, incBlue);
    if (!incRed && !incBlue) {
        title.setColor("black");
        subs.forEach(function(sub) {
            sub.setColor("black");
        });
        text.setColor("black");
    } else if (incRed && !incBlue) {
        colorHelper("red");
    } else if (incBlue && !incRed) {
        colorHelper("blue");
    } else if (incRed && incBlue) {
        var maxRed = 1;
        var maxBlue = 1;
        for (var i=0; i<3; i++) {
            var activeColor = (randomNumber(10) < 6 && maxRed > 0) ? "red" : "blue";
            if (i==0) {
                if (randomNumber(10) > 8) {
                    title.setColor(activeColor);
                } else {
                    title.setColor('black');
                }
            } else if (i==1) {
                if (randomNumber(10) > 5) {
                    subs.forEach(function (sub) {
                        sub.setColor(activeColor);
                    }); 
                } else {
                    subs.forEach(function (sub) {
                        sub.setColor('black');
                    });
                } 
            } else if (i==2) {
                if (randomNumber(10) < 3) {
                    text.setColor(activeColor);
                } else {
                    text.setColor('black');
                }
            }
        }
    }
} 

function colorHelper(color) {
    var max = 2;
    for (var i=0; i<3; i++) {
        if (i==0) {
            if (randomNumber(10) > 8 && max > 0) {
                title.setColor(color);
            } else {
                title.setColor('black');
            }
        } else if (i==1) {
            if (randomNumber(10) > 5 && max > 0) {
                subs.forEach(function(sub) {
                    sub.setColor(color);
                });
            } else {
                subs.forEach(function(sub) {
                    sub.setColor('black');
                });
            }
        } else if (i==0) {
            if (randomNumber(10) > 3 && max > 0) {
                text.setColor(color);
            } else {
                text.setColor('black');
            }
        }
        max--;
    }
}

function randomNumber(max) {
    //return a random number between 0 and max
    var number = Math.floor(Math.random() * Math.floor(max));
    console.log(number);
    return number;
}

// function handleInput(frag) {
//     //check if frag is in usrArr
//     if (frag == "") {
//         return;
//     }
//     frag = frag.toUpperCase();  // for now, case doesn't matter
//     var isNew = isNewFrag(frag);
//     var container = document.getElementById("body-container");
//     if (isNew === true) {
//         //calculate location, create html snippet (and orientation) and insert
//         //track new frag
//         usrArr.push(frag);

//         //create empty div
//         var ele = document.createElement('div');
//         //add appropriate class
//         ele.classList.add("phrase");

//         //position
//         calcPosition(frag, ele, "phrase");

//         //weight
//         calcWeight(frag, ele);

//         calcRotation(frag, ele);

//         drawRule(frag, ele);

//         //add text
//         ele.innerHTML = frag;

//         //add to DOM
//         container.appendChild(ele);
//     } else {
//         //scale font
//         var phrase = getDiv(frag);
//         var style = window.getComputedStyle(phrase, null).getPropertyValue('font-size');
//         var fontSize = parseFloat(style)/10 + 5; 
//         phrase.style.fontSize = fontSize.toString() + 'rem';
//     }
//     //draw the shape
//     drawShape(frag);
    
// }

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
    //todo
}

function calcPosition(frag, ele, objType) {
    //calculate internal coordinates of x and y
    if (objType == "phrase") {
        var hashed = murmur(frag, Math.floor(Math.random() * Math.floor(99)) + 1);
        var x = hashed % cols;
        var y = hashed % rows;
    } else if (objType == "shape") {
        var hashed = Math.floor(Math.random() * Math.floor(10000) + 1);
        var x = hashed % cols;
        var y = hashed % rows;
    }
    //correct for offscreen placement
    var ycoord = y * Math.floor((window.innerHeight - 200) / rows);
    ycoord =  (ycoord < 200) ? (200) : (ycoord);
    var xcoord = x * Math.floor((window.innerWidth - 200)/ cols);
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

// function parseFontSize(sizeStr) {
//     var nums = "";
//     console.log(sizeStr);
//     for (var i=0; i<sizeStr.length; i++) {
//         if (typeof(parseInt(sizeStr[i], 10))) {
//             nums = nums + sizeStr[i];
//         }
//     }
//     return parseInt(nums, 10);
// }

// function getDiv(frag) {
//     var found;
//     phraseDivs = document.getElementsByClassName("phrase");
//     console.log(phraseDivs);
//     for (var i = 0; i < phraseDivs.length; i++) {
//         if (phraseDivs[i].textContent == frag) {
//           found = phraseDivs[i];
//           break;
//         }
//     }
//     return found;
// }

// function isNewFrag(frag) {
//     var isNew = true;
//     console.log(frag);
//     for (var i=0; i<usrArr.length; i++) {
//         if (usrArr[i] === frag) {
//             isNew = false;
//             break;
//         }
//     }
//     return isNew;
// }

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