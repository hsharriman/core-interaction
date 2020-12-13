// ####################### CLASSES ############################
// defines bounding rectangle container for a graphic element in the poster
class BoundingBox {
    constructor(r, c, w, h) {
        this.r = r;
        this.c = c;
        this.w = w;
        this.h = h;
    }

    updateSize(ele) {
        // update bounding box so that it most closely encapsulates the dimensions
        // of the current text.
        let positionData = ele.getBoundingClientRect();

        let calcWidth = positionData.width / C_UNIT
        let w = (positionData.width % C_UNIT >= C_UNIT / 2) ? Math.ceil(calcWidth) : Math.ceil(calcWidth);

        let calcHeight = positionData.height / R_UNIT;
        let h = (positionData.height >= R_UNIT / 2) ? Math.ceil(calcHeight) : Math.ceil(calcHeight);
        
        // when updating, the width and height should be at least 1
        this.w = w == 0 ? 1 : w;
        this.h = h == 0 ? 1 : h;
    }

    updateCoords(r, c) {
        this.r = r;
        this.c = c;
    }

    print() {
        console.log(`{r: ${this.r}, c: ${this.c}, w: ${this.w}, h: ${this.h}}`);
    }

    plotBox() {
        //UTILITY FUNCTION, PLOTS BOUNDING BOX SURROUNDING AN OBJECT.
        // plot a box element at specific (x,y) coordinates on the screen
        let ele = document.createElement('div');
        Object.assign(ele.style, {
            "border": "2px solid purple",
            "position": "absolute",
            "background-color": "transparent",
            "left": `${(this.c * C_UNIT)}px`,
            "top": `${this.r * R_UNIT}px`,
            "width": `${this.w * C_UNIT}px`,
            "height": `${this.h * R_UNIT}px`
        });

        var container = document.getElementById('text-grid');
        container.appendChild(ele);
    }
}

// defines 2x2 grid used to track available spots for text
// the grid has dimensions of ROWS x COLS
// A free spot on the grid is indicated by a 0,
// a taken spot is indicated by a 1.
class BoxTracker {
    constructor() {
        this.grid = [];
        this.newGrid();
    }

    newGrid() {
        this.grid = [];
        for (let r=0; r<ROWS; r++) {
            this.grid.push([]);
            for (let c=0; c<COLS; c++) {
                this.grid[r].push(0);
            }
        }
    }

    isValid(box) {
        //if any cells within proposed bounding box 
        // are currently taken, then it's not valid
        for (let row=box.r; row<box.r + box.h; row++) {
            for (let col=box.c; col<box.c + box.w; col++) {
                if (this.grid[row][col] == 1) {
                    return false;
                }
            }
        }
        return true;
    }

    addBox(box) {
        //update grid, fill coordinates within bounding box with 1's
        for (let row=box.r; row<box.r + box.h; row++) {
            for (let col=box.c; col<box.c + box.w; col++) {
                this.grid[row][col] = 1;
            }
        }
    }

    print() {
        console.log("GRID:");
        for (let r=0; r<this.grid.length; r++) {
            console.log(this.grid[r]);
        }
        console.log("---------------");
    }

    emptySpots(box, rowStart = 0, rowEnd = ROWS) {
        //pick all empty spaces on the grid that could fit the text box
        // without going off of the grid.
        let spots = [];
        console.log("row start", rowStart, "row end", rowEnd);
        let rowMax = (ROWS - box.h < rowEnd) ? ROWS - box.h : rowEnd;
        let colMax = COLS - box.w;
        console.log("number of valid rows", rowMax);
        for (let r=rowStart; r<rowMax; r++) {
            for (let c=0; c<colMax; c++) {
                if (this.grid[r][c] == 0) {
                    spots.push([r, c]);
                }
            }
        }
        return spots;
    }
}

class TextObject {
    constructor(inTag, id, classType) {
        //initialize tracking box
        this.bounds = new BoundingBox(0,0,0,0);

        this.ele = {innerHTML: ""};
        this.inTag = inTag;         // the DOM ID of the text input field that updates this object.
        this.id = id;               //DOM ID of this object
        this.classType = classType; // i.e. "title", "subtitle", "text"
        this.isHorizontal = true;
    }

    setFontSize(frag) {
        // update font size based on length of input, and size/orientation of the canvas
        if (queryMode() == "portrait") {
            if (this.ele.id == "title") {
                let size = "25rem";
                if (frag.length > 7) {
                    size = "10rem";
                } else if (frag.length <=7 && frag.length > 3){
                    size = "15rem";
                }
                Object.assign(this.ele.style, {
                    "font-size": size,
                    "line-height": size
                });
            }
            if (this.classType == "subtitle") {
                Object.assign(this.ele.style, {
                    "font-size": "2rem",
                    "line-height": "2rem",
                    "opacity": "80%"
                });
            }
            if (this.classType == "text") {
                Object.assign(this.ele.style, {
                    "font-size" : "1.2rem",
                    "opacity" : "80%"
                });
            }
        } else {
            if (this.ele.id == "title") {
                let size = "55rem";
                if (frag.length > 7) {
                    size = "20rem";
                } else if (frag.length <=7 && frag.length > 3) {
                    size = "31rem";
                }
                Object.assign(this.ele.style, {
                    "font-size": size,
                    "line-height": size
                });
            }
            if (this.classType == "subtitle") {
                Object.assign(this.ele.style, {
                    "font-size": "5rem",
                    "line-height": "5rem",
                    "opacity": "90%"
                });
            }
            if (this.classType == "text") {
                Object.assign(this.ele.style, {
                    "font-size" : "1.4rem",
                    "opacity": "1",
                });
            }
        }
    }

    setColor() {
        if (this.ele.style != null) {
            Object.assign(this.ele.style, {
                "color": (BACKGROUND_COLOR == "black") ? "var(--white)" : "black"
            });
        }
    }

    setOrientation() {
         // ~30% chance for any one text item to be vertical
        if (randomNumber(100) <= TEXT_ORIENTATION_CHANCE) {
            this.isHorizontal = false;
            var style = {
                "writing-mode": "vertical-rl",
                "text-orientation": "mixed"
            }
        } else {
            this.isHorizontal = true;
            var style = {
                "writing-mode": "horizontal-tb"
            }
        }
        Object.assign(this.ele.style, style);
    }

    setSecondaryColor() {
        if (this.ele.style != null) {
            if (BACKGROUND_COLOR == "var(--white)") {
                var style = {
                    "color" : "var(--dark-red)",
                    "opacity" : "70%"
                }
            } else if (BACKGROUND_COLOR == "var(--yellow)") {
                var style = {
                    "color": "var(--gray)",
                    "opacity": "80%"
                }
            } else if (BACKGROUND_COLOR == "black") {
                var style = {
                    "color": "var(--light-gray)",
                    "opacity": "90%"
                }
            } else {
                var style = {
                    "color" : "var(--white)",
                    "opacity" : "80%"
                }
            }
            Object.assign(this.ele.style, style);
        }
    }

    update() {
        // grab text from the appropriate input field
        let newText = document.getElementById(this.inTag).value;

        // the correct div doesn't exist, create a new one
        if (document.getElementById(this.id) == null) {
            //create new div for this type of input
            this.ele = document.createElement('div');
            this.ele.id = this.id;
            this.ele.classList.add(this.classType);

            var container = document.getElementById("text-grid");
            container.appendChild(this.ele);
        }
        // update the text
        this.ele.innerHTML = newText;
        if (newText != "") {
            //update the appearance for the text object
            this.setColor();
            this.setFontSize(newText);
            this.setOrientation();

            // calculate new width and height after repositioning element
            this.bounds.updateSize(this.ele);

            if (this.classType == "title") {
                // on smaller screens the title text sometimes cannot find anywhere to fit because the bounding
                // box contains too much white space. To mitigate, set temporary bounds that are at most the 
                // width of the screen
                this.bounds.w = this.bounds.w >= COLS ? COLS - 2 : this.bounds.w;
                this.bounds.h = this.bounds.h >= ROWS ? ROWS - 2 : this.bounds.h;
            } 
        }
        return newText;
    }
}

// tracks all text elements
class TextGrid {
    constructor() {                
        this.title = new TextObject("titleinput", "title", "title");
        this.texts = [
                    new TextObject("titleinput", "title", "title"),        
                    new TextObject("subinput", "subtitle", "subtitle"),
                    new TextObject("subinput2", "subtitle2", "subtitle"),
                    new TextObject("subinput3", "subtitle3", "subtitle"),
                    new TextObject("txtinput", "text", "text"),
                    new TextObject("txtinput2", "text2", "text"),
                    new TextObject("txtinput3", "text3", "text")
                ];
        this.boxGrid = new BoxTracker();
        this.topToBottom;
    }

    setTopToBottom() {
        //determine whether text in this update will try to fit
        // top to bottom or bottom to top

        // ~50% chance for text layout to move from top to bottom.
        this.topToBottom = randomNumber(100) > TOP_TO_BOTTOM_CHANCE;
        // console.log("top to bottom?", this.topToBottom); // DEBUGGING
    }

    update() {
        // update all text objects on the canvas without overlaps

        //reset box grid
        this.boxGrid.newGrid();
        this.setTopToBottom();
        
        //initialize cutoff at either top or bottom of the grid
        let cutoff = this.topToBottom ? 0 : ROWS;

        for (let text of this.texts) {
            let newText = text.update();
            let possiblePairs;
            if (newText != "") {
                if (text.classType == "title") {
                    var titleText = newText;
                    // title can be placed anywhere on canvas that it will fit
                    possiblePairs = this.boxGrid.emptySpots(text.bounds, 0, ROWS);
                } else if (text.classType != "title" && this.topToBottom) {
                    // each entry needs to go below the cutoff
                    possiblePairs = this.boxGrid.emptySpots(text.bounds, Math.abs(cutoff-1)); // subtract one to allow objects to be placed on the same row
                } else {
                    // each entry needs to go above the cutoff
                    possiblePairs = this.boxGrid.emptySpots(text.bounds, 0, cutoff+1); // add one to allow objects to be placed on the same row
                }
                console.log(newText);
    
                //set position of new element
                let height = this.setPosition(text, possiblePairs);
    
                if (height == -1) {
                    //ran out of valid spaces, pick any valid open space
                    // this.boxGrid.print(); // DEBUGGING
                    height = this.setPosition(text, this.boxGrid.emptySpots(text.bounds));
                }
    
                // if adding from top to bottom, we care about what the bottom border of the
                // bounding rectangle is placed at.
                if (this.topToBottom && height + text.bounds.h > cutoff) { // new biggest height becomes the cutoff
                    cutoff = height + text.bounds.h;
                }
                if (!this.topToBottom && height < cutoff) { // new smallest height becomes the cutoff
                    cutoff = height;
                }
            }
        }
        return titleText;
    }

    setPosition(text, possiblePairs) {
        //recursively iterate over pseudo-randomly selected pairs of possible coordinates.
        // place the text object on success, and return the uppermost row it was placed at.
        if (possiblePairs.length == 0) {
            console.log("no valid spots");
            text.setSecondaryColor();
            return -1;
        }
        let [r, c] = possiblePairs.splice(randomNumber(possiblePairs.length), 1)[0];
        text.bounds.updateCoords(r, c); // try setting coordinates at randomly selected possible pair

        if (this.boxGrid.isValid(text.bounds)) {
            this.boxGrid.addBox(text.bounds);
            Object.assign(text.ele.style, {
                "left": `${(c * C_UNIT)}px`,
                "top": `${r * R_UNIT}px`,
            });

            //FOR DEBUGGING:
            // text.bounds.plotBox();
            // this.boxGrid.print();
            
            // subtitles/text are not restricted if title is placed vertically.
            // return -2 to indicate that a title object was placed
            if (text.classType == "title" && !text.isHorizontal) {
                return this.topToBottom ? 0 : ROWS;
            }
            return r;
        }

        return this.setPosition(text, possiblePairs);    
    }
}

//defines a single graphic element
class ShapeObject {
    constructor(letterSelected, titleStr) {
        this.options = ["square", "rectangle", "circle", "donut", "frame"];
        this.rotations = ["rotate(0deg)", "rotate(90deg)"];
        this.letterSelected = letterSelected;
        this.bounds = new BoundingBox(0,0,2,1); // give bounding box a smaller size to allow for more overlaps
        this.ele = this.makeRandomObject(titleStr);
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

    setOrientation(ele) {
        if (randomNumber(100) <= 40) {
            ele.style.transform = "rotate(90deg)";
        } else {
            ele.style.transform = "rotate(0deg)";
        }
    }

    setColor(ele) {
        let color = COLORS[randomNumber(COLORS.length)];
        if (color == BACKGROUND_COLOR) {
            return this.setColor(ele);
        }
        if (BACKGROUND_COLOR == "black" && color == "var(--white)") {
            return this.setColor(ele);
        }
        if (color == "black") {
            ele.style.opacity = "80%";
        }
        ele.style.backgroundColor = color;
        return;
    }

    setFontColor(ele) {
        let color = COLORS[randomNumber(COLORS.length)];
        ele.style.color = color;
        if (color == BACKGROUND_COLOR || color == "black") {
            this.setFontColor(ele);
        }
    }

    makeSquare() {
        //build element
        let ele = document.createElement('div');
        ele.classList.add('square');
        this.setColor(ele);

        return ele;
    }

    makeCircle() {
        //build element
        let ele = document.createElement('div');
        ele.classList.add('circle');
        this.setColor(ele);

        return ele;
    }
    
    makeDonut() {
        let container = document.createElement('div');
        container.classList.add('shape-container');
        let radius = 20 + randomNumber(60);
        Object.assign(container.style, {
            "width": `${radius}rem`,
            "height": `${radius}rem`
        });

        let big = this.makeCircle();
        Object.assign(big.style, {
            "width": `${radius}rem`,
            "height": `${radius}rem`,
            "z-index": "-50"
        });
        
        let little = this.makeCircle();
        let litteRadius = radius - randomNumber(radius-10) + 1;
        Object.assign(little.style, {
            "width": `${litteRadius}rem`,
            "height": `${litteRadius}rem`,
            "background-color": BACKGROUND_COLOR,
            "z-index": "-10"
        });

        container.appendChild(big);
        container.appendChild(little);

        return container;
    }

    makeFrame() {
        let container = document.createElement('div');
        container.classList.add('shape-container');
        let width = 20 + randomNumber(60);
        let len = `${width}rem`;
        Object.assign(container.style, {
            "width": len,
            "height": len
        });

        let big = this.makeSquare();
        Object.assign(big.style, {
            "width": len,
            "height": len,
            "z-index": "-50"
        });

        let little = this.makeSquare();
        let littleLen = (width - randomNumber(width-10) + 1);
        Object.assign(little.style, {
            "width": `${littleLen}rem`,
            "height": `${littleLen}rem`,
            "background-color": BACKGROUND_COLOR,
            "z-index": "-10"
        });

        this.setOrientation(container);

        container.appendChild(big);
        container.appendChild(little);

        return container;
    }

    makeRectangle() {
        let ele = document.createElement('div');
        ele.classList.add('square');
        Object.assign(ele.style, {
            "width": `${20 + randomNumber(50)}rem`,
            "height": `${20 + randomNumber(50)}rem`
        });
        this.setColor(ele);
        this.setOrientation(ele);

        return ele;
    }

    makeLetter(frag) {
        let ele = document.createElement('div');
        ele.classList.add('letter');
        let size = `${50 + randomNumber(50)}rem`;
        Object.assign(ele.style, {
            "width": size,
            "height": size,
            "font-size": size,
            "opacity": "80%"
        });
        this.setFontColor(ele);
        this.setOrientation(ele);
        
        let cleaned = removeArticles(frag);
        ele.innerHTML = cleaned[0];

        return ele;
    }
}

// tracks all graphic elements
class ShapeGrid {
    constructor() {
        this.boxGrid = new BoxTracker();
        this.letterSelected;
    }

    lettersAllowed() {
        this.letterSelected = randomNumber(100) <= LETTER_ELEMENT_CHANCE;
    }

    update(titleStr) {
        // create new randomly generated graphic elements
        this.boxGrid.newGrid();
        this.lettersAllowed();

        let node = document.getElementById('dec-grid');
        //randomize opacity
        node.style.opacity = (randomRange(70, 100)).toString() + "%";
    
        //empty canvas
        node.querySelectorAll('*').forEach(n => n.remove());

        //add new objects to canvas
        let numObjs = randomNumber(MAX_RANDOM_ELES) + 1;
        for (let i=0; i<numObjs; i++) {
            let shape = new ShapeObject(this.letterSelected, titleStr);
            let possiblePairs = this.boxGrid.emptySpots(shape.bounds);
            this.setPosition(shape, possiblePairs);
            node.appendChild(shape.ele);
        }
    }

    setPosition(shape, possiblePairs) {
        // place a shape in a valid spot on the canvas.
        if (possiblePairs.length == 0) {
            console.log("no space for shape, skipping");
            return;
        }
        let [r, c] = possiblePairs.splice(randomNumber(possiblePairs.length), 1)[0];
        shape.bounds.updateCoords(r, c); // try setting coordinates at randomly selected possible pair

        if (this.boxGrid.isValid(shape.bounds)) {
            this.boxGrid.addBox(shape.bounds);
            Object.assign(shape.ele.style, {
                "left": `${(c * C_UNIT)}px`,
                "top": `${r * R_UNIT}px`,
            });

            //FOR DEBUGGING:
            // shape.bounds.plotBox();
            // boxGrid.print();
            
            return;
        }

        return this.setPosition(shape, possiblePairs); 
    }
}


class PageHandler {
    constructor() {
        // the canvas includes 2 layers, a text layer and an object layer. Each one gets its own grid.
        this.textCanvas = new TextGrid();
        this.shapeCanvas = new ShapeGrid();
        this.rotArr = ["rotate(-15deg)", "rotate(-30deg)", "rotate(-5deg)"];
    }

    listenInput() {
        this.updateBackground();
        this.updateUnits();
        // this.updateCoords(); // DEBUGGING: uncomment to visualize grid coordinates
        
        //update canvas content
        var titleStr = this.textCanvas.update();
        
        this.shapeCanvas.update(titleStr);
        this.skewDocument();
        return false;
    }

    skewDocument() {
        // ~30% chance of document skewing
        if (randomNumber(100) <= DOC_SKEW_CHANCE) {
            var rotation = this.rotArr[randomNumber(this.rotArr.length)];
            var style = {
                "transform": rotation,
                "transform-origin": "center center"
            };
        } else {
            var style = {
                "transform" : "rotate(0deg)"
            }
        }
        Object.assign(document.getElementById('text-grid').style, style);
        Object.assign(document.getElementById('dec-grid').style, style);
    }

    updateCoords() {
        //UTILITY FUNCTION: plots all coordinates of grid as dots on the canvas.
        var textGrid = document.getElementById('text-grid');
        for (var r=0; r<ROWS; r++) {
           for (var c=0; c<COLS; c++) {
                var ele = document.createElement('div');
                ele.classList.add('coord');
                ele.style.top =`${r * R_UNIT}px`;
                ele.style.left = `${(c * C_UNIT)}px`;

                textGrid.appendChild(ele);
            }
        }
    }

    updateUnits() {
        // units are used to dynamically create a grid that determine
        // where an object is free to be placed. It updates based on the current
        // width + height of the user's screen.
        CANVAS_WIDTH = document.getElementById('text-grid').offsetWidth;
        CANVAS_HEIGHT = document.getElementById('text-grid').offsetHeight;
        C_UNIT = Math.ceil(CANVAS_WIDTH / COLS);
        R_UNIT = Math.ceil(CANVAS_HEIGHT / ROWS);
    }

    updateBackground() {
        BACKGROUND_COLOR = COLORS[randomNumber(COLORS.length)];
        document.getElementById('main-content').style.backgroundColor = BACKGROUND_COLOR;
    }
}

// ############################# FUNCTIONS ####################################

//GLOBALS
const COLS = 8;
const ROWS = 12;
var BACKGROUND_COLOR;
var COLORS = ["var(--white)", "black", "var(--red)", "var(--orange)", "var(--yellow)", "var(--green)", "var(--blue)", "var(--white)"];
var CONTROLLER = new PageHandler();
var C_UNIT;
var R_UNIT;
var CANVAS_WIDTH;
var CANVAS_HEIGHT;


// PERCENT CHANCE CONFIG GLOBALS
var TEXT_ORIENTATION_CHANCE = 30;
var DOC_SKEW_CHANCE = 30;
var TOP_TO_BOTTOM_CHANCE = 50;
var LETTER_ELEMENT_CHANCE = 40;
var MAX_RANDOM_ELES = 6;
var SHAPE_OVERLAP_CHANCE = 60;


function onLoad() {
    const form = document.getElementById('form');
    form.addEventListener('submit', preventReload);
    C_UNIT = Math.round(document.getElementById('text-grid').offsetWidth / COLS);
    R_UNIT = Math.round(document.getElementById('text-grid').offsetHeight / ROWS);
    CONTROLLER.listenInput();
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
