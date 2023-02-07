//https://github.com/0xfe/vexflow



var Note = function(options) {
  console.log(window);
  this.StaveNote = new Vex.Flow.StaveNote(options);
  this.removed = false;
  /**
   * moves the note right from its ORIGINAL position by x pixels
   * (sets the trasform: translate(x) value to x)
   */
  this.setOffsetX = x => {
    if (this.removed) {
      return this;
    }
    $.each(this.getElem(true), (index, node) => {
      var x_y = this.getTransformXY(node);
      x_y.x = x;
      node.setAttribute("transform", `translate(${x_y.x},${x_y.y})`);
    });

    return this;
  };
  /**
   * removes the SVG elements
   */
  this.remove = () => {
    if (this.removed) {
      return this;
    }
    var note = this.getElem(true);
    var nodeEl = note[0];

    var x_y = this.getTransformXY(nodeEl);

    var frames = [
      {
        opacity: 1.0,
        transform: "translate3D(" + x_y.x + "px," + x_y.y + "px,0)"
      },
      { opacity: 0, transform: "translate3D(" + x_y.x + "px,30px,0)" }
    ];

    var timing = {
      duration: 500,
      iterations: 1
    };

    var animation = nodeEl.animate(frames, timing);
    animation.onfinish = function(e) {
      // remove line that go though the stave
      bar.remove();
      note.remove();
    };

    var bar = this.getBar();

    this.removed = true;
    return this;
  };

  /**
   * moves the note right from its CURRENT position by x pixels
   * (adjusts the trasform: translate(x) value by x)
   */
  this.moveXPixels = x => {
    if (this.removed) {
      return this;
    }
    
    $.each(this.getElem(true), (index, node) => {
      var x_y = this.getTransformXY(node);
      x_y.x += x;
      node.setAttribute("transform", `translate(${x_y.x},${x_y.y})`);
    });
   
    return this;
  };

  /**
   * returns the <svg>
   */
  this.getSvg = () => {
    return $(this.StaveNote.attrs.el).closest("svg");
  };
  /**
   * Gets the StaveNote.attrs.el as a jQuery object
   * @param {boolean} include_bar - whether to include the <rect> bar with it
   */
  this.getElem = include_bar => {
   
    var return_jquery = $(this.StaveNote.attrs.el);

    if (include_bar) {
      var bar = this.getBar();
      if (bar.length) {
        return_jquery = return_jquery.add(bar);
      }
    }

    return return_jquery;
  };
  /**
   * returns the <rect> before the StaveNote.attrs.el
   * if it exists
   */
  this.getBar = () => {
    return $(this.StaveNote.attrs.el).prev("rect");
  };

  /**
   * gets the {x, y} of transform=translate(x,y)
   * @param {HTMLElement} html_element
   */
  this.getTransformXY = (html_element) => {

    var xforms = html_element.getAttribute("transform");
    if (xforms === null) {
      return { x: 0, y: 0 };
    }
    var parts = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(xforms);
    return {
      x: parseInt(parts[1]),
      y: parseInt(parts[2])
    };
  };

  /**
   * Checks if the StaveNote.attrs.el is x or less pixels from the
   * edge of the SVG - this requires that the viewbox be the same as the
   * actually width of the svg
   * @param {integer} x - number of pixels to test against
   */
  this.isXOrLessFromLeft = x => {
    if (isNaN(x)) {
      x = 0;
    }
    let node = this.getElem();
    let svg = this.getSvg();
    let pixels_from_left = node.offset().left - svg.offset().left;
    if (pixels_from_left < x) {
      return true;
    }
    return false;
  };
};

var Sheet = function(selector) {
  this.context = null;
  this.stave = null;
  this.width = 600;
  this.height = 200;
  this.drawn_notes = [];
  this.remove_point = 100;
  this.selector = selector;
  this.speed = 75;

  this.createSheet = () => {
    var sheet_elem = $("#" + this.selector);

    var renderer = new Vex.Flow.Renderer(
      sheet_elem[0],
      Vex.Flow.Renderer.Backends.SVG
    );

    // Configure the rendering context.
    renderer.resize(this.width, this.height);
    this.context = renderer.getContext();
    this.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    // Create a stave of width this.width at position 0, 0 on the canvas.
    this.stave = new Vex.Flow.Stave(0, 0, this.width);

    // Add a clef and time signature.
    this.stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    this.stave.setContext(this.context).draw();

    sheet_elem.find("svg")[0].setAttribute("width", "100%");
    sheet_elem
      .find("svg")[0]
      .setAttribute("viewBox", "0 0 " + this.width + " " + this.height);
  };

  this.addNotes = num_notes => {
    if (isNaN(num_notes)) {
      num_notes = 4;
    }
    var notes = [];
    while (num_notes > notes.length) {
      notes.push(this.getRandomNote());
    }

    var voice = new Vex.Flow.Voice({ num_beats: num_notes, beat_value: 4 });
    voice.addTickables(notes.map(note => note.StaveNote));

    var formatter = new Vex.Flow.Formatter()
      .joinVoices([voice])
      .format([voice], this.width);
    voice.draw(this.context, this.stave);

    for (var i = 0, l = notes.length; i < l; i++) {
      this.drawn_notes.push(notes[i]);
    }
    return notes;
  };
  this.clearNotes = () => {
    for (let note of this.drawn_notes) {
      if (note.removed) {
        continue;
      }
      note.remove();
    }
  };
  this.stopFlow = () => {
    this.speed = 0;
  };
  this.flowLeft = speed => {
    this.speed = speed;
  };

  this.last_step_time = null;
  this.step = timestamp => {
    var time_diff = timestamp - this.last_step_time;

    this.last_step_time = timestamp;

    for (let note of this.drawn_notes) {
      if (note.removed) {
        continue;
      }
      var x = time_diff * this.speed / 750;

      note.moveXPixels(-x);

      if (note.isXOrLessFromLeft(this.remove_point)) {
        note.remove();
      }
    }

    window.requestAnimationFrame(this.step.bind(this));
  };

  /**
   * Returns a random quarter note in the x/4 range
   */
  this.getRandomNote = () => {
    var _keys = [
      "c/4",
      // 'c#/4',
      "d/4",
      // 'd#/4',
      "e/4",
      "f/4",
      // 'f#/4',
      "g/4",
      // 'g#/4',
      "a/4",
      // 'a#/4',
      "b/4"
    ];
    var _durations = ["q"];
    var _clefs = ["treble"];

    var key = _keys[_.random(0, _keys.length - 1)];
    var duration = _durations[_.random(0, _durations.length - 1)];
    var clef = _clefs[_.random(0, _clefs.length - 1)];

    return new Note({
      keys: [key],
      clef: clef,
      duration: duration
    });
  };

  window.requestAnimationFrame(this.step.bind(this));
};

var sheet = new Sheet("sheet");
console.log(sheet);
sheet.createSheet();

var startFlowExample = function() {
  //sheet.clearNotes();
  //sheet.addNotes(4);
  sheet.flowLeft(parseFloat(75));
};

var addNote = function() {
  console.log("add note");
  var notes = sheet.addNotes(1);

  for (var i in notes) {
    notes[i].setOffsetX(400);
  }
};

// buttons
var stopBtn = document.getElementById("stop");
stopBtn.addEventListener("click", e => {
  sheet.stopFlow();
});
var startBtn = document.getElementById("start");
startBtn.addEventListener("click", startFlowExample);

var addNoteButton = document.getElementById("add-note");
addNoteButton.addEventListener("click", addNote);

// start it
startFlowExample();
addNote();
