/**
 * @author Andreea Matei
 */
// Showing the HangTheBrowsers game
document.write('<div style="background-color:#EFEFEF;position:relative; top:0px; left:0px; border:2px ridge #BBBBBB; width:700px; height:780px; font-family:Verdana; font-weight:normal; font-style:normal; text-decoration:none;">');
document.write(' <form action="" method="post" onsubmit="return false;"> ');
document.write('  <div id="HangTitle" style="font-size:16px; position:absolute; top:5px; width:200px; text-align:center;">');
document.write('   Hang the Browsers');
document.write('  </div>');
document.write('  <div id="HangConsole" style="font-size:12px; position:absolute; top:34px; text-align:center; width:200px;">');
document.write('   Enter a letter: <input type="text" maxlength="1" size="1" id="HangInput" /><input type="button" value="Go" onclick="processLetter()" /><br />');
document.write('   The word: <span id="HangGuessWord">........</span><br />');
document.write('  </div>');
document.write('  <div id="HangImage" style="position:absolute; top:85px; right:22px;">');
document.write('   <img src="style/icons/favicon0.png" id="HangIMG" style="border:1px ridge #BBBBBB;" />');
document.write('  </div>');
document.write('  <div id="HangMessage" style="font-size:16px; position:absolute; top:250px; width:200px; text-align:center;">');
document.write('  </div>');
document.write(' </form>');
document.write('</div>');

// Setting global variables
var theWord = "";
var guessWord = "";
var error_amount = 0;

function showMessage(message) {
  document.getElementById("HangMessage").innerHTML = message;
}

function updateWord(word) {
  document.getElementById("HangGuessWord").innerHTML = word;
}

function getLetter() {
  var letter = document.getElementById("HangInput").value;
  return letter;
}
function showHang() {
  document.getElementById("HangIMG").src = "style/icons/favicon" + error_amount + ".png";
}

function initGame() {
  // Resetting all variables
  theWord = "";
  guessWord = "";
  error_amount = 0;
  showHang();
  showMessage("");
  updateWord("");
  var ajax = false;

  // Choose the objecttype, depending on what is supported:
  if (window.XMLHttpRequest) {
      // IE 7, Mozilla, Safari, Firefox, Opera, most browsers:
      ajax = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // Old IE-browsers
      // Make the type Msxml2.XMLHTTP, if possible:
      try {
          ajax = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e1) { // Else use the other type:
          try {
              ajax = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e2) { }
      }
  }
  if (ajax) {
    // Here you can change the words file into whatever you'd like, as long as it is local:
    var url = "js/words.txt";
    // Starting the communication
    ajax.open('get', url, true);
    // Sends request
    ajax.send(null);
    // Function that handles response
    ajax.onreadystatechange=function() {
    // If everything is OK:
     if ( (ajax.readyState == 4) && (ajax.status == 200) ) {
        // Returns the value to the word
        var wordsText = ajax.responseText;
        // Splitting the text
        var words = wordsText.split("|");
        // Retrieving a random number
        var randomNumber = Math.floor(Math.random() * (words.length));
        // Setting theWord
        theWord = words[randomNumber];
        // Creating guessWord, consisting out of dots
        for (i = 0; i < theWord.length; i++) {
          guessWord += '.';
        }
        updateWord(guessWord);
      } else if (ajax.status == 204 || ajax.status == 400 || ajax.status == 401 || ajax.status == 403 || ajax.status == 404 || ajax.status == 408 || ajax.status == 500) {
         showMessage("Can't open words file - " + ajax.status);
        }
    }
  } else { // AJAX is not useable
      alert('It is not possible to connect, please update your browser.');
    }
} // End of function initGame();

function isAlphaNumeric(str){
  var regExp = /[^a-zA-Z]/g
  if (regExp.test(str)) {
  return false;
  } else {
  return true;
  }
}

function processLetter() {
  // Retrieving the letter
  var letter = document.getElementById("HangInput").value;
  if (isAlphaNumeric(letter)) {
    // Saving the guessWord for later comparison
    var prevGuessWord = guessWord;
    // Declaring character arrays
    var wordLetters = new Array;
    var guessWordLetters = new Array;
    // Filling the wordLetters array with the characters of the word
    // that needs to be guessed
    for (i = 0; i < theWord.length; i++) {
      wordLetters[i] = theWord.substr(i, 1);
    }
    // Filling the guessWordLetters array with the character of the guessWord
    for (d = 0; d < guessWord.length; d++) {
      guessWordLetters[d] = guessWord.substr(d, 1);
    }

    // Checking wether the guess letter is in theWord, and if it is
    // replace the dot in the guessWord
    for (x = 0; x < theWord.length; x++) {
      if (wordLetters[x] == letter) {
        guessWordLetters[x] = letter;
      }
    }

    // Replacing the guessWord with the character array guessWOrdLetters
    // It gets replaced and it's different (a letter was guess) the word will be updated
    // else it will not be changed and the error amount will be raised
    guessWord = "";
    for (c = 0; c < prevGuessWord.length; c++) {
      guessWord += guessWordLetters[c];
    }
    if (guessWord == prevGuessWord && error_amount < 9 && guessWord != theWord) {
      error_amount++;
      showHang();
    } else {
      updateWord(guessWord);
    }
    if ((guessWord == theWord) || error_amount >= 9) {
      if (error_amount >= 9) {
        showMessage("You lost! <span style='cursor:pointer; text-decoration:underline;' onclick='initGame()'>Try again?</span>");
        updateWord(theWord);
      }
      if (guessWord == theWord) {
        showMessage("You won! <span style='cursor:pointer; text-decoration:underline;' onclick='initGame()'>Try again?</span>");
      }
    }
    document.getElementById("HangInput").value = "";
    document.getElementById("HangInput").focus();
    } else {
      if ((guessWord != theWord) && error_amount < 9) {
        showMessage("Only letters are allowed!");
      }
    document.getElementById("HangInput").value = "";
    document.getElementById("HangInput").focus();
    }
} // End of checkLetter(letter) function

window.onload = initGame();
