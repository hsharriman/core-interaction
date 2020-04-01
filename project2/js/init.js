var entryCount = 0;
var displayCount = 0;

//capture key presses
document.addEventListener("keypress", function(e) {
  e.preventDefault();
  entryCount ++;
  displayCount ++;

  //translate unicode to characters
  //https://unicodelookup.com/
  var char = String.fromCharCode(e.which);
  console.log("entry #" + entryCount + " : " + e.which + " | " + char + ". Showing " + displayCount);
  createElement(char);
});

//capture function keys
document.addEventListener("keydown", function(e) {
  //if pressed key is a backspace
  if (e.which == 8 && document.querySelectorAll('.inner').length){
    e.preventDefault();
    entryCount ++;
    displayCount --;
    console.log("entry #" + entryCount + " : " + e.which + " | BKSP. Showing " + displayCount);
    deleteElement();
  }
});


function createElement(k) {
  var elem = document.querySelector('#cursor');

  // create a new span to add
  var newElem = document.createElement('span');
  newElem.className = 'inner';

  if (k == "a" || k == "A") { newElem.innerHTML = 'A'; }
  if (k == "b" || k == "B") { newElem.innerHTML = 'A'; }
  if (k == "c" || k == "C") { newElem.innerHTML = '<img src="http://a.deviantart.net/avatars/i/n/infinitenyancatplz.gif">'; }
  if (k == "d" || k == "D") { newElem.innerHTML = 'D'; }
  if (k == "e" || k == "E") { newElem.innerHTML = 'E'; }
  if (k == "f" || k == "F") { newElem.innerHTML = 'F'; }
  if (k == "g" || k == "G") { newElem.innerHTML = 'G'; }
  if (k == "h" || k == "H") { newElem.innerHTML = 'H'; }
  if (k == "i" || k == "I") { newElem.innerHTML = 'I'; }
  if (k == "j" || k == "J") { newElem.innerHTML = 'J'; }
  if (k == "k" || k == "K") { newElem.innerHTML = 'K'; }
  if (k == "l" || k == "L") { newElem.innerHTML = 'L'; }
  if (k == "m" || k == "M") { newElem.innerHTML = 'M'; }
  if (k == "n" || k == "N") { newElem.innerHTML = 'N'; }
  if (k == "o" || k == "O") { newElem.innerHTML = 'O'; }
  if (k == "p" || k == "P") { newElem.innerHTML = 'P'; }
  if (k == "q" || k == "Q") { newElem.innerHTML = 'Q'; }
  if (k == "r" || k == "R") { newElem.innerHTML = 'R'; }
  if (k == "s" || k == "S") { newElem.innerHTML = 'S'; }
  if (k == "t" || k == "T") { newElem.innerHTML = 'T'; }
  if (k == "u" || k == "U") { newElem.innerHTML = 'U'; }
  if (k == "v" || k == "V") { newElem.innerHTML = 'V'; }
  if (k == "w" || k == "W") { newElem.innerHTML = 'W'; }
  if (k == "x" || k == "X") { newElem.innerHTML = 'X'; }
  if (k == "y" || k == "Y") { newElem.innerHTML = 'Y'; }
  if (k == "z" || k == "Z") { newElem.innerHTML = 'Z'; }
  if (k == " " ) { newElem.innerHTML = '&nbsp;' };

  // add span before cursor
  elem.before(newElem);
}

function deleteElement() {
  let last = document.querySelectorAll(".inner");
  if (last.length){
    last[last.length - 1].remove();
  }
}
