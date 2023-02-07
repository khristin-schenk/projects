/*
* This is a hash of notes and their corresponding frequencies.
* Taken from this Gist: https://gist.github.com/sethbrasile/5438a4e2700837d6d0e0c3a134ba8ed4
*/
var NOTE = {
   "C0":   16.35,
  "C#0":   17.32,
  "Db0":   17.32,
   "D0":   18.35,
  "D#0":   19.45,
  "Eb0":   19.45,
   "E0":   20.60,
   "F0":   21.83,
  "F#0":   23.12,
  "Gb0":   23.12,
   "G0":   24.50,
  "G#0":   25.96,
  "Ab0":   25.96,
   "A0":   27.50,
  "A#0":   29.14,
  "Bb0":   29.14,
   "B0":   30.87,
   "C1":   32.70,
  "C#1":   34.65,
  "Db1":   34.65,
   "D1":   36.71,
  "D#1":   38.89,
  "Eb1":   38.89,
   "E1":   41.20,
   "F1":   43.65,
  "F#1":   46.25,
  "Gb1":   46.25,
   "G1":   49.00,
  "G#1":   51.91,
  "Ab1":   51.91,
   "A1":   55.00,
  "A#1":   58.27,
  "Bb1":   58.27,
   "B1":   61.74,
   "C2":   65.41,
  "C#2":   69.30,
  "Db2":   69.30,
   "D2":   73.42,
  "D#2":   77.78,
  "Eb2":   77.78,
   "E2":   82.41,
   "F2":   87.31,
  "F#2":   92.50,
  "Gb2":   92.50,
   "G2":   98.00,
  "G#2":  103.83,
  "Ab2":  103.83,
   "A2":  110.00,
  "A#2":  116.54,
  "Bb2":  116.54,
   "B2":  123.47,
   "C3":  130.81,
  "C#3":  138.59,
  "Db3":  138.59,
   "D3":  146.83,
  "D#3":  155.56,
  "Eb3":  155.56,
   "E3":  164.81,
   "F3":  174.61,
  "F#3":  185.00,
  "Gb3":  185.00,
   "G3":  196.00,
  "G#3":  207.65,
  "Ab3":  207.65,
   "A3":  220.00,
  "A#3":  233.08,
  "Bb3":  233.08,
   "B3":  246.94,
   "C4":  261.63,
  "C#4":  277.18,
  "Db4":  277.18,
   "D4":  293.66,
  "D#4":  311.13,
  "Eb4":  311.13,
   "E4":  329.63,
   "F4":  349.23,
  "F#4":  369.99,
  "Gb4":  369.99,
   "G4":  392.00,
  "G#4":  415.30,
  "Ab4":  415.30,
   "A4":  440.00,
  "A#4":  466.16,
  "Bb4":  466.16,
   "B4":  493.88,
   "C5":  523.25,
  "C#5":  554.37,
  "Db5":  554.37,
   "D5":  587.33,
  "D#5":  622.25,
  "Eb5":  622.25,
   "E5":  659.26,
   "F5":  698.46,
  "F#5":  739.99,
  "Gb5":  739.99,
   "G5":  783.99,
  "G#5":  830.61,
  "Ab5":  830.61,
   "A5":  880.00,
  "A#5":  932.33,
  "Bb5":  932.33,
   "B5":  987.77,
   "C6": 1046.50,
  "C#6": 1108.73,
  "Db6": 1108.73,
   "D6": 1174.66,
  "D#6": 1244.51,
  "Eb6": 1244.51,
   "E6": 1318.51,
   "F6": 1396.91,
  "F#6": 1479.98,
  "Gb6": 1479.98,
   "G6": 1567.98,
  "G#6": 1661.22,
  "Ab6": 1661.22,
   "A6": 1760.00,
  "A#6": 1864.66,
  "Bb6": 1864.66,
   "B6": 1975.53,
   "C7": 2093.00,
  "C#7": 2217.46,
  "Db7": 2217.46,
   "D7": 2349.32,
  "D#7": 2489.02,
  "Eb7": 2489.02,
   "E7": 2637.02,
   "F7": 2793.83,
  "F#7": 2959.96,
  "Gb7": 2959.96,
   "G7": 3135.96,
  "G#7": 3322.44,
  "Ab7": 3322.44,
   "A7": 3520.00,
  "A#7": 3729.31,
  "Bb7": 3729.31,
   "B7": 3951.07,
   "C8": 4186.01,
  "C#8": 4434.92,
  "Db8": 4434.92,
   "D8": 4698.64,
  "D#8": 4978.03,
  "Eb8": 4978.03
}

//Specifies beats per minute.
var bpm = 180;

//Length of a minute in milliseconds
var minute = 60000;

//Enum like object containing note lengths.
var LENGTH = {
  Full: minute / (bpm / 4),
  Half: minute / (bpm / 4) / 2,
  Quarter: minute / (bpm / 4) / 4,
}

/*
* @class
* Contains the logic to initialize and play a synthetized sound with the Web Audio API.
*/
class Sound {
  
  constructor(context) {
    this.context = context;
  }

  /*
  * @function 
  * initializes a new oscillator
  * and connects it to a gain note.
  * Note that this function makes use of the AudioContexts factory methods
  * in order to recycle oscillators and nodes.
  */
  init() {
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.oscillator.type = wave;
  }

  /*
  * @function
  * Plays a sound.
  * 
  * Internally calls this class's init method, 
  * in order to have a fresh oscillator available.
  *
  * @param value
  * The frequency the sound shall have.
  * 
  * @param duration
  * The duration the sound is played for in seconds,
  * before the stop method is called.
  */
  play(value, duration) {
    this.init();

    this.oscillator.frequency.value = value;
    this.gainNode.gain.setValueAtTime(1, this.context.currentTime);
            
    this.oscillator.start(this.context.currentTime);
    this.stop(context.currentTime + duration * 0.001);

  }

  /*
  * @function
  * Stops the sound.
  * Interpolates the gain node towards zero, 
  * before full stop, to reduce clicking noise.
  * 
  * @param  time
  * The time relative to the AudioContexts inner time, 
  * at which the sound is supposed to stop.
  */
  stop(time) {
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, time);
    this.oscillator.stop(time);
  }
}

var context = new AudioContext();
var sound = new Sound(context);

//The oscillators waveform.
var wave = "sine";

//Specifies the octave in which the notes hall be played by the oscillators.
var octave = "4";

//Specifies how long a note shall linger after it started playing.
var lingerLength = LENGTH.Half;

/*
* 1 based index of the active row.
* It is one based because we use querySelectorAll 
* and the nth-child pseudoclass to grab the necessary child elements of each row.
*/
var col = 1;

//An array containing the last cycles active row of buttons.
var prevBg;

//Specifies wether notes should be played or not.
var paused = true;

/*
* This is this sequencers main loop.
*/
setInterval(function() {
  
  if (!paused) {
    
    /*
    * Grabs the currently active row of sequencer buttons 
    * and darkens their background to indicate their active state.
    */
    var bg = document.querySelectorAll(".sequencerInner > *:nth-child(16n - " + (16 - col) +  ")");
    bg.forEach(function(elem) {
      elem.style.backgroundColor = "rgba(0,0,0, 0.125)";
    });

    /*
    * Remove the darkened background from the previous row
    * Then set the current row as the next previous row.
    */
    if (prevBg) {
      prevBg.forEach(function(elem) {
        elem.style.backgroundColor = "";
      });
    }
    prevBg = bg;

    /*
    * Play the activated notes of the currently activated row.
    * Also play their animation.
    */
    var elements = document.querySelectorAll(".sequencerInner > *:nth-child(16n - " + (16 - col) +  ") > *");
    elements.forEach(function(elem) {
      if (elem.checked) {
        sound.play(NOTE[elem.dataset.note + octave], lingerLength);
        var newone = elem.cloneNode(true);
        elem.parentNode.replaceChild(newone, elem);
      }
    });

    //Reset the 1 based index if necessary
    col++;
    if (col > 16) {
      col = 1;
    }
  }
}, LENGTH.Quarter);

/*
* @function
* Makes the passed element pulse once.
* 
* @param elem
* An Object of type DOMElement, which shall be animated.
*/
function pulse(elem) {
  elem.style.animation = "pulse 500ms 1";
  setTimeout(function() {
    elem.style.animation = "";
  }, 500);
}

/*
* @function 
* Toggles the play state.
*/
function play() {
  paused = false;
  var play = document.getElementsByClassName("fa-play")[0];
  pulse(play);
}

/*
* @function 
* Toggles the pause state.
*/
function pause() {
  paused = true;
  var pause = document.getElementsByClassName("fa-pause")[0];
  pulse(pause);
}

/*
* @function 
* Saves the users current creation as a JSON object
* Stringifies it encodes it then appends it to copyable link
* shown to the user.
*/
function save() {
  var save = document.getElementsByClassName("fa-floppy-o")[0];
  pulse(save);
  
  var notes = [];
  var btns = document.querySelectorAll(".sequencerInner > * > *");
  btns.forEach(function(btn) {
    notes.push(btn.checked);
  });
  
  var obj = {
    octave: octave,
    length: lingerLength,
    wave: wave,
    notes: notes
  }
  
  document.getElementById("overlay").style.display = "flex";
  var urlEncoded = encodeURIComponent(JSON.stringify(obj));
  document.getElementById("shareLink").value = "https://codepen.io/Viket/pen/QOKOZg?editors=0010&m=" + urlEncoded;
}

/*
* @function 
* Closes the save overlay.
*/
function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
}

/*
* @function 
* Loads a previous state if available.
* Expects the state in the form of a queryParameter named "m".
* Usually only called once on page load.
*/
function load() {
  var queries = new URLSearchParams(window.location.search);
  var settings = queries.has("m");
  if (settings) {
    var query = queries.get("m");
    var decoded = decodeURIComponent(query);
    var obj = JSON.parse(decoded);
    
    octave = obj.octave;
    document.getElementById("dlOctave1").value = octave;
    
    var dlLength = document.getElementById("dlLength1");
    lingerLength = obj.length;
    
    switch (lingerLength) {
      case LENGTH.Full:
        dlLength.value = "Long";
        break;
      case LENGTH.Half:
        dlLength.value = "Medium";
        break;
      case LENGTH.Quarter:
        dlLength.value = "Short";
        break;
    }
    
    wave = obj.wave;
    var val = wave.charAt(0).toUpperCase() + wave.slice(1);
    document.getElementById("dlWave1").value = val;
    
    var btns = document.querySelectorAll(".sequencerInner > * > *");
    index = 0;
    btns.forEach(function(btn) {
      btn.checked = obj.notes[index];
      index++;
    });
  }
}

/*
* @function 
* Changes the oscillators octave.
* Called upon interaction with the Octave dropdownlist.
*/
function changeOctave(e) {
  octave = e.target.value;
}

/*
* @function 
* Changes the time notes linger.
* Called upon interaction with the Length dropdownlist.
*/
function changeLength(e) {
  switch (e.target.value) {
    case "Short":
      lingerLength = LENGTH.Quarter;
      break;
    case "Medium":
      lingerLength = LENGTH.Half;
      break;
    case "Long":
      lingerLength = LENGTH.Full;
      break;
  }
}

/*
* @function 
* Changes the oscillators waveform.
* Called upon interaction with the Wave dropdownlist.
*/
function changeWave(e) {
  wave = e.target.value.toLowerCase();
}

load();