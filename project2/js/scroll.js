function updateScrollBar () {
    var totHeight = parseFloat(document.body.clientHeight);
    var viewport = parseFloat(window.innerHeight);
    var currHeight = parseFloat(window.scrollY) + viewport;

    currHeight = (viewport == currHeight) ? (0) : (currHeight);
    var scroll = document.getElementById('scrollbar');
    var fracHeight = (parseInt((currHeight / totHeight) * 100)).toString();
    scroll.style.height = fracHeight + "%";
}

function moveScrollBar () {
    var scroll = document.getElementById('scrollbar');
    var metawidth = document.getElementById('metatxt').offsetLeft;
    scroll.style.left = "calc(" + metawidth.toString() + "px - 3rem)";
    return metawidth;
}