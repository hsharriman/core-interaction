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

function showMenu(panelName, chevID) {
    var panel = document.getElementById(panelName);
    if (panel.style.maxHeight) {
        // panel.style.display = "block";
        panel.style.maxHeight = null;
        rotateChevron(chevID, "0deg");
    } else {
        var advPanel = document.getElementById("advanced-panel");
        panel.style.maxHeight = panel.scrollHeight + "px";
        rotateChevron(chevID, "-90deg");
    }
}

function adjustAdvancedMenu(subpanelID) {
    var panel = document.getElementById("advanced-panel");
    var addedHeight = document.getElementById(subpanelID).scrollHeight;
    panel.style.maxHeight = panel.scrollHeight + addedHeight + "px";
}

function rotateChevron(chevID, degrees) {
    chevron = document.getElementById(chevID);
    chevron.style.transform = 'rotate(' + degrees + ')';
}

function expandAdvanced() {
    showMenu("advanced-panel", "chev-adv");
    //TODO: ADD +/- SIGN
}

function expandReorg() {
    adjustAdvancedMenu("reorg-panel");
    showMenu("reorg-panel", "chev-reorg");
}

function expandPresets() {
    showMenu("preset-panel", "chev-pre");
}

function expandContent() {
    adjustAdvancedMenu("content-panel");
    showMenu("content-panel", "chev-content");
}