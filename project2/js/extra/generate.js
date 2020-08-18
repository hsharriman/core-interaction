class GridBox {
    constructor(rs, re, cs, ce) {
        this.rs = rs;
        this.re = re;
        this.cs = cs;
        this.ce = ce;
    }

    rowOverlap(rs, re) {
        return (this.rs <= rs && this.re >= rs) ? (true) : (false);
    }

    colOverlap(cs, ce) {
        return (this.cs <= cs && this.ce >= cs) ? (true) : (false);
    }

    overlaps(rs, re, cs, ce) {
        return (this.rowOverlap(rs, re) && this.colOverlap(cs, ce)) ? (true) : (false);
    }
}

class GridTracker {
    constructor() {
        this.takenSpots = [];
    }

    reset() {
        this.takenSpots = [];
    }

    addPair(row, rowEnd, col, colEnd) {
        this.takenSpots.push(new GridBox(row, rowEnd, col, colEnd));
    }

    causesOverlap(row, rowEnd, col, colEnd) {
        for (var i=0; i<this.takenSpots.length; i++) {
            if (this.takenSpots[i].overlaps(row, rowEnd, col, colEnd)) {
                return true;
            }
        }
        return false;
    }

    pickEmptySpot() {
        var row = randomNumber(rows);
        var col = randomNumber(cols);
        if (this.causesOverlap(row, row + 3, col, col + 2)) {
            return this.pickEmptySpot();
        } else {
            this.addPair(row, row + 3, col, col + 2);
            var retval = [row, row + 3, col, col + 2];
            console.log(retval);
            return retval;
        }
    }
}

class TextObject {
    constructor(inTag, id, classType) {
        this.ele = {innerHTML: ""};
        this.inTag = inTag;
        this.id = id;
        this.classType = classType;
        this.isHorizontal = true;
        this.width;
        this.height;
    }

    updateText(rmin, rmax, gridTracker) {
        var newText = document.getElementById(this.inTag).value;
        //try changing on every generate
        this.addText(newText);
        this.setPosition(rmin, rmax);
        // this.pickPosition(gridTracker);
        return newText;
    }

    addText(frag) {
        if (frag == "") { return; }

        if (document.getElementById(this.id) != null) {
            // this.ele = document.getElementById(this.id);
            this.ele.innerHTML = frag;
            this.width = this.ele.offsetWidth;
            this.height = this.ele.offsetHeight;
        } else {
            this.ele = document.createElement('div');
            this.ele.id = this.id;
            this.ele.classList.add(this.classType);
            this.setColor();

            this.ele.innerHTML = frag;
            this.width = this.ele.offsetWidth;
            this.height = this.ele.offsetHeight;
            var container = document.getElementById("text-grid");
            container.appendChild(this.ele);
        }
    }

    pickPosition(gridTracker) {
        //pick an orientation,
        if (this.ele.style != null) {
            this.setOrientation();

            //pick possible position on grid
            var coords = gridTracker.pickEmptySpot();
            var row = coords[0];
            var rowEnd = coords[1];
            var col = coords[2];
            var colEnd = coords[3];

            this.ele.style.gridColumnStart = col.toString();
            this.ele.style.gridColumnEnd = colEnd.toString();
    
        
            this.ele.style.gridRowStart = row.toString();
            this.ele.style.gridRowEnd = rowEnd.toString();
        }
    }

    setPosition(rmin, rmax) {
        //pick an orientation,
        if (this.ele.style != null) {
            this.setOrientation();

            //pick possible position on grid
            var row = randomNumber(rmax);
            if (row < rmin) { row = rmin; }
            var col = randomNumber(cols);

            this.ele.style.gridColumnStart = col.toString();
            this.ele.style.gridColumnEnd = (col + 2).toString();
    
        
            this.ele.style.gridRowStart = row.toString();
            this.ele.style.gridRowEnd = (row).toString();
        }
    }



    setColor(color) {
        if (this.ele.style != null) {
            if (backgroundColor == "black") {
                color = "var(--white)";
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
}

class ArtObject {
    constructor() {        
        this.titleMin = 3;
        this.titleMax;
        this.subsMin;
        this.subsMax;
        this.textMin;
        this.textMax = rows - 2;
        this.gridTracker = new GridTracker();
        this.fromTop = true;
        this.subLeft = true;
        
        this.title = new TextObject("titleinput", "title", "title");
        this.calculateTextBounds();
        this.subs = [new TextObject("subinput", "subtitle", "subtitle"),
                    new TextObject("subinput2", "subtitle2", "subtitle"),
                    new TextObject("subinput3", "subtitle3", "subtitle")];
        this.text = [new TextObject("txtinput", "text", "text"),
                    new TextObject("txtinput2", "text2", "text"),
                    new TextObject("txtinput3", "text3", "text")];
    }

    update() {
        this.gridTracker.reset();
        this.titleMax =randomNumber(5) + this.titleMin + 1;
        var titleStr = this.title.updateText(this.titleMin, this.titleMax, this.gridTracker);
        this.calculateTextBounds();
        console.log(this.gridTracker.takenSpots);
        for (var i=0; i<this.subs.length; i++) {
            this.subs[i].updateText(this.subsMin, this.subsMax, this.gridTracker);
        }
        for (var i=0; i<this.text.length; i++) {
            this.text[i].updateText(this.textMin, this.textMax, this.gridTracker);
        }
        return titleStr;
    }

    calculateTextBounds() {
        // this.titleMax = randomNumber(5) + this.titleMin + 1;
        if (!this.title.isHorizontal) {
            this.subsMin = this.titleMin;
        } else {
            this.subsMin = this.subsMin = this.titleMax + 1;
        }
        //subtitle min/max
        this.subsMax = this.subsMin + randomNumber(rows - this.subsMin + 1);
        
        //text min/max
        this.textMin = this.subsMin + 1;
        this.textMax = rows - 2;
    }
}

class ShapeObject {
    constructor() {
        this.options = ["square", "rectangle", "circle", "donut", "frame"];
        this.rotations = ["rotate(0deg)", "rotate(90deg)"];
        this.letterSelected = false;
    }

    update(titleStr) {
        console.log(titleStr);
        var node = document.getElementById('dec-grid');
        //randomize opacity
        node.style.opacity = (randomNumber(45) + 40).toString();
    
        node.querySelectorAll('*').forEach(n => n.remove());
        var numObjs = randomNumber(5);
        this.lettersAllowed();
        for (var i=0; i<numObjs; i++) {
            var ele = this.makeRandomObject(titleStr);
            // this.setScale(ele, classType);
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

    setColor(ele) {
        var color = colors[randomNumber(colors.length)];
        ele.style.backgroundColor = color;
        if (color == backgroundColor || color == "black") {
            this.setColor(ele);
        }
        if (backgroundColor == "black" && color == "var(--white)") {
            this.setColor(ele);
        }
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
        var size = (40 + randomNumber(50)).toString() + "rem";
        ele.style.width = size;
        ele.style.fontSize = size;
        ele.style.opacity = "90%";
        this.setFontColor(ele);
        
        var cleaned = removeArticles(frag);
        ele.innerHTML = cleaned[0];
        return ele;
    }
}

function removeArticles(frag) {
    const regex = '/(?:(the|a|an) +)/g'; 
    const subst = "";
    
    // The substituted value will be contained in the result variable
    return frag.replace(regex, subst);
}

class PageHandler {
    constructor() {
        this.textCanvas = new ArtObject();
        this.shapeCanvas = new ShapeObject();
        this.rotArr = ["rotate(-15deg)", "rotate(-30deg)", "rotate(-60deg)"];
    }

    listenInput() {
        this.updateBackground();
        var titleStr = this.textCanvas.update();
        this.shapeCanvas.update(titleStr);
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

    updateBackground() {
        backgroundColor = colors[randomNumber(colors.length)];
        document.getElementById('main-content').style.backgroundColor = backgroundColor;
    }
}
//GLOBALS
const cols = 16;
const rows = 32;
var bBlue = false;
var bRed = false;
var backgroundColor;
var colors = ["var(--white)", "black", "var(--red)", "var(--orange)", "var(--yellow)", "var(--green)", "var(--blue)", "var(--white)"];
var controller = new PageHandler();

function onLoad() {
    const form = document.getElementById('form');
    form.addEventListener('submit', preventReload);
    controller.listenInput();
}

function preventReload(event) {
    event.preventDefault();
}

function randomNumber(max) {
    //return a random number between 0 and max
    var number = Math.floor(Math.random() * Math.floor(max));
    return number;
}