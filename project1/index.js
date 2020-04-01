function loadContent() {
    console.log(ch.name);
    makeSwappable();
    if (window.innerWidth > 600) {
        document.getElementById('controls').remove();
    }  
    if (window.innerWidth <= 600 || screen.width <= 600) {
        //THIS NEEDS TO BE UPDATED
        //add button to take to mobile version of site if no access to desktop.
        document.getElementById('doc').remove();

        expandPresets(document.getElementById("presets"));
        expandReorg(document.getElementById("structure"));
        // expandContent(document.getElementById("content"));

        //tell large window to reload
        ch.postMessage('continue');
    }
}

function closePopup() {
    document.getElementById('editing-div').style.display = "none";
    document.getElementById('html').style.overflow = "auto";
}

function openPopup() {
    document.getElementById('editing-div').style.display = "flex";
    document.getElementById('html').style.overflow = "hidden";
}

function toMobile() {
    //TODO: FIX MOBILE WEBSITE FORMATTING ITS NOT CUTE
    document.getElementById('popup').remove();
}

function addText() {
    ch.postMessage('add text');
}

function toggleMarkup() {
    //change state
    markupState = !markupState;
    if (markupState) {
        //markup turned on
        ch.postMessage("markup on");
    } else {
        //markup turned off
        ch.postMessage("markup off");
    }
}

function toggleSections() {
    sectionState = !sectionState;
    if (sectionState) {
        console.log("sections on");
        ch.postMessage("sections on");
    } else {
        console.log("sections off");
        ch.postMessage("sections off");
    }
}

function showMenu(self, panelName, chevID) {
    var panel = document.getElementById(panelName);
    chevron = document.getElementById(chevID);
    if (panel.style.maxHeight) {
        // panel.style.display = "block";
        panel.style.maxHeight = null;
        rotateChevron(chevID, "0deg");
        self.style.color = "var(--header-color)";
        chevron.style.color = "var(--header-color)";
        self.style.background = "var(--hover)";
        self.style.borderBottom = "2px solid var(--border-color)";
    } else {
        // self.style.borderBottom = "none";
        self.style.color = "var(--text-color)";
        chevron.style.color = "var(--text-color)";
        self.style.background = "rgb(238, 238, 238);";

        panel.style.maxHeight = panel.scrollHeight + "px";
        rotateChevron(chevID, "-90deg");
    }
}

function rotateChevron(chevID, degrees) {
    chevron = document.getElementById(chevID);
    chevron.style.transform = 'rotate(' + degrees + ')';
}

function expandReorg(self) {
    showMenu(self, "reorg-panel", "chev-reorg");
}

function expandPresets(self) {
    showMenu(self, "preset-panel", "chev-pre");
}

function expandContent(self) {
    showMenu(self, "content-panel", "chev-content");
}

function resetButtons(presetType) {
    for (var i=1; i<5; i++) {
        var btn = document.getElementById("btn-" + i.toString());
        console.log("change color"); 
        if (i==presetType) {
            btn.style.background = "white";
            btn.style.color = "var(--active-text-color)";
            btn.style.fontWeight = "700";
        } else {
            btn.style.background = "white";
            btn.style.color = "var(--text-color)";
            btn.style.fontWeight = "500";
        }
    }
}
function preset(presetType) {
    resetButtons(presetType);
    var arr = [];
    if (presetType == 1) {
        arr = [["2",0], ["4",1], ["6",2], ["7",3], ["5",4], ["1",5], ["0",6], ["3",7], ["8",8]];
    }
    if (presetType == 2) {
        arr = [["6",0], ["5",1], ["7",2], ["0",3], ["2",4], ["3",5], ["4",6], ["1",7], ["8",8]];
    }
    if (presetType == 3) {
        arr = [["0",0], ["3",1], ["2",2], ["4",3], ["6",4], ["5",5], ["1",6], ["7",7], ["8",8]];
    }
    if (presetType == 4) {
        arr = [["6",0], ["8",1], ["5",2], ["2",3], ["0",4], ["3",5], ["4",6], ["7",7], ["1",8]];
    }
    ch.postMessage(["section update", arr]);
}

function reset() {
    ch.postMessage("refresh");
    window.location.reload();
}