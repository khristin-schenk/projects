// Global Variable Declarations
let c = {
  width: 400,
  height: 400,
};

let cx = c.width / 2,
  cy = c.height / 2,
  img,
  spacing = 10,
  weight = 9,
  speed = 0;

function preload() {
 img = loadImage('https://i0.wp.com/makezine.com/wp-content/uploads/2011/12/john-leungs-moire-magic-carpet.jpg?resize=1200%2C670&strip=all&ssl=1');
  img = loadImage(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Spinning_cube_moving_optical_illusion.jpg/220px-Spinning_cube_moving_optical_illusion.jpg"
  );
}

// Setting up the Canvas
function setup() {
  let canvas = createCanvas(c.width, c.height);
  canvas.parent("sketch-holder");
}

// Where the Magic Happens (It draws)
function draw() {
  background(0);
  image(img, cx - 250, cy - 160, 500, 320);
  stroke(0);
  strokeWeight(weight);
  for (i = 0; i <= 42; i++) {
    line(spacing * i + speed, 0, spacing * i + speed, height);
  }
  speed += 0.2;
  if (speed >= 10) speed = 0;
}
