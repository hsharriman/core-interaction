class BoundingBox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.x2 = x+w;
        this.y2 = y+h;
    }

    ptWithin(x, y) {
        if (this.ptBetweenX(x) && this.ptBetweenY(y)) {
            return true;
        }
        return false;
    }

    plotBox() {
        var ele = document.createElement('div');
        ele.classList.add('square');
        ele.style.border = "2px solid purple";
        ele.style.backgroundColor = "transparent";
        ele.style.zIndex = -7;
        ele.style.left = (this.x * xunit).toString() + "px";
        ele.style.top = (this.y * yunit).toString() + "px";
        ele.style.width = (this.w * xunit).toString() + "px";
        ele.style.height = (this.h * yunit).toString() + "px";
        var container = document.getElementById('text-grid');
        container.appendChild(ele);
    }

    ptBetweenX(x) {
        return (this.x <= x && this.x2 > x);
    }

    ptBetweenY(y) {
        return (this.y <= y && this.y2 > y);
    }

    causesOverlap(box2) {
        if (this.ptWithin(box2.x, box2.y) || this.ptWithin(box2.x2, box2.y2)) {
            //box starts or ends inside other box
            return true;
        } else if (box2.ptWithin(this.x, this.y) || box2.ptWithin(this.x2, this.y2)) {
            return true;
        } else if (this.ptBetweenX(box2.x2) && this.ptBetweenY(box2.y)) {
            return true;
        } else if (this.ptBetweenY(box2.y2) && this.ptBetweenX(box2.x)) {
            return true;
        } else if (this.ptBetweenX(box2.x) && this.ptBetweenX(box2.x2) && this.y2 >= box2.y2|| this.ptBetweenY(box2.y) && this.ptBetweenY(box2.y2) && this.x2 >= box2.x2) {
            return true;
        } else if (this.ptBetweenX(box2.x) && this.ptBetweenX(box2.x2) && box2.ptBetweenY(this.y) && box2.ptBetweenY(this.y2)) {
            return true;
        } else if (this.ptBetweenY(box2.y) && this.ptBetweenY(box2.y2) && box2.ptBetweenX(this.x) && box2.ptBetweenX(this.x2)) {
            return true;
        }
        return false;
    }
}

class BoxTracker {
    constructor() {
        this.boxes = [];
    }

    reset() {
        this.boxes = [];
    }

    isValid(x, y, w, h) {
        var temp = new BoundingBox(x, y, w, h);
        for (var i=0; i<this.boxes.length; i++) {
            if (this.boxes[i].causesOverlap(temp)) {
                return false;
            }
        }
        return true;
    }

    addBox(x, y, w, h) {
        var box = new BoundingBox(x, y, w+1, h+1);
        this.boxes.push(box);
    }
}

class TextObject {
    constructor(inTag, id, classType) {
        this.ele = {innerHTML: ""};
        this.inTag = inTag;
        this.id = id;
        this.classType = classType;
        this.isHorizontal = true;
        this.w;
        this.h;
    }

    updateText(boxes, titleHeight) {
        var newText = document.getElementById(this.inTag).value;

        this.addText(newText);
        if (this.classType == "title") {
            var possiblePairs = this.makePairs(0, cols - this.w, -1, rows - 1);
            titleHeight = this.setPosition(boxes, possiblePairs);
        } else {
            if (titleHeight > rows / 4) {
                var possiblePairs = this.makePairs(0, cols, 0, titleHeight);
                this.setPosition(boxes, possiblePairs);
            } else {
                var possiblePairs = this.makePairs(0, cols, titleHeight, rows - this.h);
                this.setPosition(boxes, possiblePairs);
            }
        }
        return [newText, titleHeight];
    }

    makePairs(xmin, xmax, ymin, ymax) {
        var possibleXs = range(xmin, xmax);
        var possibleYs = range(ymin, ymax);
        var pairs = [];
        for (var i=0; i<possibleXs.length; i++) {
            for (var n=0; n<possibleYs.length; n++) {
                pairs.push([possibleXs[i], possibleYs[n]]);
            }
        }
        return pairs;
    }

    addText(frag) {
        if (document.getElementById(this.id) != null) {
            this.ele.innerHTML = frag;
        } else {
            this.ele = document.createElement('div');
            this.ele.id = this.id;
            this.ele.classList.add(this.classType);

            this.ele.innerHTML = frag;
            var container = document.getElementById("text-grid");
            container.appendChild(this.ele);
        }
        if (frag == "") { return; }
        this.setColor();
        this.setSize(frag);
        this.setOrientation();
        this.setWidthHeight();
    }

    setWidthHeight() {
        var positionData = this.ele.getBoundingClientRect();
        var remW = positionData.width % xunit;
        var remH = positionData.height % yunit;
        if (remW >= xunit / 2) {
            this.w = Math.ceil(positionData.width / xunit);
        } else if (remW < xunit /2) {
            this.w = Math.floor(positionData.width / xunit);
        }
        if (remH >= yunit / 2) {
            this.h = Math.ceil(positionData.height / yunit);
        } else if (remH < yunit / 2) {
            this.h = Math.floor(positionData.height / yunit);
        }
    }

    setSize(frag) {
        if (this.ele.id == "title") {
            if (frag.length > 7) {
                this.ele.style.fontSize = "20rem";
                this.ele.style.lineHeight = "20rem";
            } else if (frag.length <=7 && frag.length > 3){
                this.ele.style.fontSize = "30rem";
                this.ele.style.lineHeight = "31rem";
            } else {
                this.ele.style.fontSize = "55rem";
                this.ele.style.lineHeight = "56rem";
            }
        }
        if (queryMode() == "portrait") {
            if (this.ele.id == "title") {
                if (frag.length > 7) {
                    this.ele.style.fontSize = "10rem";
                    this.ele.style.lineHeight = "10rem";
                } else if (frag.length <=7 && frag.length > 3){
                    this.ele.style.fontSize = "15rem";
                    this.ele.style.lineHeight = "16rem";
                } else {
                    this.ele.style.fontSize = "25rem";
                    this.ele.style.lineHeight = "25rem";
            }
        }
            if (this.classType == "subtitle") {
                this.ele.style.fontSize = "2rem";
                this.ele.style.lineHeight = "2rem";
                this.ele.style.opacity = "80%";
            }
            if (this.classType == "text") {
                this.ele.style.opacity = "80%";
            }
        } else {
            if (this.classType == "subtitle") {
                this.ele.style.fontSize = "5rem";
                this.ele.style.lineHeight = "5rem";
                this.ele.style.opacity = "90%";
            }
            if (this.classType == "text") {
                this.ele.style.opacity = "100%";
            }
        }
    }

    setColor() {
        if (this.ele.style != null) {
            if (backgroundColor == "black") {
                var color = "var(--white)";
            } else {
                var color = "black";
            }
            this.ele.style.color = color;
        }
    }

    setOrientation() {
        if (randomNumber(100) <= 40) {
            this.isHorizontal = false;
            this.ele.style.writingMode = "vertical-rl";
            this.ele.style.textOrientation = "mixed";
        } else {
            this.isHorizontal = true;
            this.ele.style.writingMode = "horizontal-tb";
        }
    }

    setPosition(boxes, possiblePairs) { 
        if (possiblePairs.length > 0) {
            var coord = possiblePairs.splice(randomNumber(possiblePairs.length), 1)[0];
            var x = coord[0];
            var y = coord[1];
            var isValid = boxes.isValid(x, y, this.w, this.h);
            if (isValid) {
                boxes.addBox(x, y, this.w, this.h);
                this.ele.style.left = (x * xunit).toString() + "px";
                this.ele.style.top = (y * yunit).toString() + "px";
                if (this.classType == "title" && !this.isHorizontal) { return 0;}
                return y;
            } else {
                return this.setPosition(boxes, possiblePairs);
            }    
        } else {
            //if cannot find good spot for the phrase
            this.ele.style.left = (randomNumber(cols - 1) * xunit).toString() + "px";
            this.ele.style.top = (randomNumber(rows - 1) * yunit).toString() + "px";
            this.fitText();
            this.setSecondaryColor();
            return 0;
        }
    }
    
    fitText() {
        if (this.classType != "title") {
            this.ele.style.fontSize = "1.2rem";
            this.ele.style.lineHeight = "1.4rem";
            this.ele.style.letterSpacing = "0";
        }
    }

    setSecondaryColor() {
        if (this.ele.style != null) {
            if (backgroundColor == "var(--white)") {
                this.ele.style.color = "var(--dark-red)";
                this.ele.style.opacity = "60%";
            } else if (backgroundColor == "var(--yellow)" || backgroundColor == "black") {
                this.ele.style.color = "var(--light-gray)";
                this.ele.style.opacity = "80%;"
            } else {
                this.ele.style.color = "var(--white)";
                this.ele.style.opacity = "80%";
            }
        }
    }
}

class TextGrid {
    constructor() {                
        this.title = new TextObject("titleinput", "title", "title");
        this.texts = [new TextObject("subinput", "subtitle", "subtitle"),
                    new TextObject("subinput2", "subtitle2", "subtitle"),
                    new TextObject("subinput3", "subtitle3", "subtitle"),
                    new TextObject("txtinput", "text", "text"),
                    new TextObject("txtinput2", "text2", "text"),
                    new TextObject("txtinput3", "text3", "text")];
        this.boxes = new BoxTracker();
        this.titleHeight = 0;
    }

    update() {
        this.boxes.reset();
        var titleData = this.title.updateText(this.boxes, this.titleHeight);
        this.titleHeight = titleData[1];
        for (var i=0; i<this.texts.length; i++) {
            this.texts[i].updateText(this.boxes, this.titleHeight);
        }
        return titleData[0];
    }
}

class ShapeObject {
    constructor() {
        this.options = ["square", "rectangle", "circle", "donut", "frame"];
        this.rotations = ["rotate(0deg)", "rotate(90deg)"];
        this.letterSelected = false;
    }

    update(titleStr) {
        var node = document.getElementById('dec-grid');
        //randomize opacity
        node.style.opacity = (randomRange(70, 100)).toString() + "%";
    
        node.querySelectorAll('*').forEach(n => n.remove());
        var numObjs = randomNumber(6) + 1;
        //TEMP: CHANGE BACK
        // var numObjs = 1;
        this.lettersAllowed();
        for (var i=0; i<numObjs; i++) {
            var ele = this.makeRandomObject(titleStr);
            // var ele = this.makeCircle();
            this.setOrientation(ele);
            this.setPosition(ele);
            node.appendChild(ele);
        }
    }

    lettersAllowed() {
        this.letterSelected = randomNumber(10) >= 5 ? true: false;
    }

    makeRandomObject(titleStr) {
        if (this.letterSelected) {
            return this.makeLetter(titleStr);
        } else {
            switch (this.options[randomNumber(this.options.length)]) {
                case "square":
                    return this.makeSquare();
                case "rectangle":
                    return this.makeRectangle();
                case "circle":
                    return this.makeCircle();
                case "donut":
                    return this.makeDonut();
                case "frame":
                    return this.makeFrame();
                default: return;
            }
        }
    }

    setPosition(ele) {
        // var x = randomNumber(cols - 4) * xunit;
        // var y = randomNumber(rows - 4) * yunit;

        //UNCOMMENT LATER
        var x = randomNumber(cols / 2) * 2 * xunit;
        var y = randomNumber(rows / 2) * 2 * yunit;
        ele.style.top = y.toString() + "px";
        ele.style.left = x.toString() + "px";
    }

    setOrientation(ele) {
        if (randomNumber(100) <= 40) {
            ele.style.transform = "rotate(90deg)";
        } else {
            ele.style.transform = "rotate(0deg)";
        }
    }

    setColor(ele) {
        var color = colors[randomNumber(colors.length)];
        ele.style.backgroundColor = color;
        if (color == backgroundColor) {
            return this.setColor(ele);
        }
        if (backgroundColor == "black" && color == "var(--white)") {
            return this.setColor(ele);
        }

        return color;
    }

    setFontColor(ele) {
        var color = colors[randomNumber(colors.length)];
        ele.style.color = color;
        if (color == backgroundColor || color == "black") {
            this.setFontColor(ele);
        }
    }

    makeSquare() {
        var ele = document.createElement('div');
        ele.classList.add('square');
        this.setColor(ele);
        return ele;
    }

    makeCircle() {
        var ele = document.createElement('div');
        ele.classList.add('circle');

        this.setColor(ele);
        return ele;
    }
    
    makeDonut() {
        var container = document.createElement('div');
        container.classList.add('shape-container');
        var width = 20 + randomNumber(60);
        container.style.width = width.toString() + "rem";
        container.style.height = container.style.width;

        var big = this.makeCircle();
        big.style.width = container.style.width;
        big.style.height = container.style.width;
        big.style.zIndex = "-50";
        
        var little = this.makeCircle();
        little.style.width = (width - randomNumber(width-10) + 1).toString() + "rem";
        little.style.height = little.style.width;
        little.style.backgroundColor = backgroundColor;
        little.style.zIndex = "-10";

        container.appendChild(big);
        container.appendChild(little);
        return container;
    }

    makeFrame() {
        var container = document.createElement('div');
        container.classList.add('shape-container');
        var width = 20 + randomNumber(60);
        container.style.width = width.toString() + "rem";
        container.style.height = container.style.width;

        var big = this.makeSquare();
        big.style.width = container.style.width;
        big.style.height = container.style.width;
        big.style.zIndex = "-50";
        
        var little = this.makeSquare();
        little.style.width = (width - randomNumber(width-10) + 1).toString() + "rem";
        little.style.height = little.style.width;
        little.style.backgroundColor = backgroundColor;
        little.style.zIndex = "-10";

        container.appendChild(big);
        container.appendChild(little);
        return container;
    }

    makeRectangle() {
        var ele = document.createElement('div');
        ele.classList.add('square');
        ele.style.width = (20 + randomNumber(50)).toString() + "rem";
        ele.style.height = (20 + randomNumber(50)).toString() + "rem";
        this.setColor(ele);
        return ele;
    }

    makeLetter(frag) {
        var ele = document.createElement('div');
        ele.classList.add('letter');
        var size = (50 + randomNumber(50)).toString() + "rem";
        ele.style.width = size;
        ele.style.fontSize = size;
        ele.style.opacity = "90%";
        this.setFontColor(ele);
        
        var cleaned = removeArticles(frag);
        ele.innerHTML = cleaned[0];
        return ele;
    }
}

class PageHandler {
    constructor() {
        this.textCanvas = new TextGrid();
        this.shapeCanvas = new ShapeObject();
        this.rotArr = ["rotate(-15deg)", "rotate(-30deg)", "rotate(-5deg)"];
    }

    listenInput() {
        this.updateBackground();
        this.updateUnits();
        // this.updateCoords();
        var titleStr = this.textCanvas.update();
        
        this.shapeCanvas.update(titleStr);
        this.skewDocument();
        return false;
    }

    skewDocument() {
        var textGrid = document.getElementById('text-grid');
        var shapeGrid = document.getElementById('dec-grid');
        if (randomNumber(10) >= 7) {
            var rotation = this.rotArr[randomNumber(this.rotArr.length)];
            textGrid.style.transformOrigin = "center center";
            textGrid.style.transform = rotation;
            shapeGrid.style.transformOrigin = "center center";
            shapeGrid.style.transform = rotation;
        } else {
            textGrid.style.transform = "rotate(0deg)";
            shapeGrid.style.transform = "rotate(0deg)";
        }
    }

    updateCoords() {
        var textGrid = document.getElementById('text-grid');
        for (var i=0; i<rows; i++) {
           for (var n=0; n<cols; n++) {
                var ele = document.createElement('div');
                ele.classList.add('coord');
                ele.style.top = (i * yunit).toString() + "px";
                ele.style.left = (n * xunit).toString() + "px";

                textGrid.appendChild(ele);
            }
        }
    }

    updateUnits() {
        canvasWidth = document.getElementById('text-grid').offsetWidth;
        canvasHeight = document.getElementById('text-grid').offsetHeight;
        xunit = Math.floor(canvasWidth / cols);
        yunit = Math.floor(canvasHeight / rows);
    }

    updateBackground() {
        backgroundColor = colors[randomNumber(colors.length)];
        document.getElementById('main-content').style.backgroundColor = backgroundColor;
    }
}
//GLOBALS
const cols = 8;
const rows = 8;
var backgroundColor;
var colors = ["var(--white)", "black", "var(--red)", "var(--orange)", "var(--yellow)", "var(--green)", "var(--blue)", "var(--white)"];
var controller = new PageHandler();
var xunit;
var yunit;
var canvasWidth;
var canvasHeight;

function onLoad() {
    const form = document.getElementById('form');
    form.addEventListener('submit', preventReload);
    xunit = Math.floor(document.getElementById('text-grid').offsetWidth / cols);
    yunit = Math.floor(document.getElementById('text-grid').offsetHeight / rows);
    controller.listenInput();
    document.getElementById('html').scrollTop = 0;
}

function revealMenu() {
    if (window.pageYOffset > 500) {
    document.getElementById('menu').style.display = "block";
    }
}

function preventReload(event) {
    event.preventDefault();
}

function randomNumber(max) {
    //return a random number between 0 and max
    var number = Math.floor(Math.random() * Math.floor(max));
    return number;
}

function randomRange(min, max) {
    return min + randomNumber(max - min);
}

function range(min, max) {
    var li = [];
    for (var i=min; i<max; i++) {
        li.push(i);
    }
    return li;
}

function removeArticles(frag) {
    const regex = '/(?:(the|a|an) +)/g'; 
    const subst = "";
    
    // The substituted value will be contained in the result variable
    return frag.replace(regex, subst);
}

function queryMode() {
    var canvas = document.getElementById('main-content');
    var dims = canvas.getBoundingClientRect();
    if (dims.width < dims.height) {
        return "portrait";
    } else {
        return "landscape";
    }
}

function download() {
    window.print();
}
