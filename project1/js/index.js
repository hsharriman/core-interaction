function loadContent() {
    console.log(ch.name);

    if (window.innerWidth > 600) {
        document.getElementById('controls').remove();
    }  
    if (window.innerWidth <= 600 || screen.width <= 600) {
        //THIS NEEDS TO BE UPDATED
        //add button to take to mobile version of site if no access to desktop.
        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode("I'm using my phone"));
        btn.classList.add('to-mobile');
        btn.onclick = toMobile;
        document.getElementById('popup').appendChild(btn);

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