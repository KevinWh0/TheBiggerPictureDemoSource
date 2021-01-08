import { setState, states } from "../index.js";
import { levelOn, mapData } from "./assetManager.js";
import { game, height, offline, setOffline, width } from "./toolbox.js";

function testImage(URL) {
  var tester = new Image();
  tester.onload = found;
  tester.onerror = notfound;
  tester.src = URL + "?v=" + (Math.random() + Math.random()) * 900000;
}
function notfound() {
  //console.log("Offline");
  setOffline(true);
}
function found() {
  //console.log("Online");
  setOffline(false);
}

let originalW = undefined;
let originalH = undefined;
let originalx;
let originaly;

let unfocusTime;
let totalTime;
$(window).focus(function () {
  //do something
  if (levelOn == 4) totalTime = Date.now() - unfocusTime;
});

$(window).blur(function () {
  //do something
  unfocusTime = Date.now();
});

//Start of speach rec
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let keyword = "pineapple";
let correctVoiceGuess = false;

recognition.onresult = function (event) {
  var result = event.results[0][0].transcript;
  console.log(result + " Confidence: " + event.results[0][0].confidence);
  console.log(
    event.results[0][1].transcript +
      " Confidence: " +
      event.results[0][1].confidence
  );
  if (result.includes(keyword)) {
    correctVoiceGuess = true;
  } else {
    recognition.start();
  }
};

recognition.onerror = function (event) {
  console.error(event.error);
  correctVoiceGuess = true;
};

//end of speach rec

export let doorConditions = {
  0: function () {
    if (game.frameNo % 50 == 0) testImage("./assets/tiles/Transparent.png");
    return offline;
  },
  1: function () {
    if (originalH == undefined) {
      originalH = height;
      originalW = width;
    }
    let w = width;
    let h = height;
    return w != originalW && h != originalH;
  },
  2: function () {
    let x = window.screenX || window.screenLeft;
    let y = window.screenY || window.screenTop;
    // /console.log(x, y);
    if (originalx == undefined) {
      originalx = window.screenX || window.screenLeft;
      originaly = window.screenY || window.screenTop;
      return false;
    }
    return x != originalx || y != originaly;
  },

  3: function () {
    let min = new Date().getMinutes();
    //console.log(min);

    let minutesCorrect =
      parseInt(mapData[10][3]) == parseInt(min.toString().charAt(0)) &&
      parseInt(mapData[11][3]) == parseInt(min.toString().charAt(1));
    if (min.toString().length == 1) {
      minutesCorrect = parseInt(mapData[11][3]) == parseInt(min.toString());
      //console.log(mapData[11][3], parseInt(min.toString()));
    }
    let hour = new Date().getHours() % 12;
    if (hour == 0) hour = 12;

    /*console.log(
      mapData[9][3] == hour,
      parseInt(mapData[10][3]),
      parseInt(min.toString().charAt(0)),
      parseInt(mapData[11][3]) == parseInt(min.toString().charAt(1))
    );*/
    //console.log(hour, min.toString().charAt(0), min.toString().charAt(1));
    /*console.log(
      parseInt(mapData[9][3]) + 1 + " " + parseInt(min.toString().charAt(0)),
      parseInt(mapData[10][3]) + 1 + " " + parseInt(min.toString().charAt(1)),
      parseInt(mapData[11][3]) + 1 + " " + hour
    );*/
    return parseInt(mapData[9][3]) == hour && minutesCorrect;
  },

  4: function () {
    //This is in milliseconds
    //console.log(totalTime);
    return totalTime > 2000;
  },
  5: function () {
    setState(states.win);
    //recognition.start();

    //return correctVoiceGuess;
  },
  6: function () {
    //CHECK THE CONSOLE
  },
};

export function getDoorCondition(lvl) {
  try {
    if (Object.keys(doorConditions).includes(lvl.toString()))
      return doorConditions[lvl]();
    else throw Error();
  } catch (err) {
    return (function () {
      return false;
    })();
  }
}
