/*Too tired to make a good interface for this. 
But you can still interact with it programmatically 
or use the temporary UI I made. To activite the UI 
call `showGUI()`. Otherwise, you may modify the three 
arrays `mainBeats`, `secondaryBeats`, and `offBeats` 
and watch as the visual changes. The variable `speed` 
controls tempo. And finally you may want to adjust 
`hitThreshold` if it is frequently dropping beats.*/


//todo make a better gui.

if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element) {
			window.setTimeout(callback, 1000 / 120); //120 fps (embrace the beautiful modernity)
		}
}

function time() {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function Point(x,y)
{
  return {x:x, y:y};
}

function LinearTransformation(p, i, j) {
  return Point(i.x*p.x + j.x*p.y, i.y*p.x + j.y*p.y);
  //x*i + y*j
}

function Interpolate(a,b,i)
{
  return Point(a.x*(1-i)+b.x*i, a.y*(1-i)+b.y*i)
}

function normalize(vect)
{
  var m = Math.pow(Math.pow(vect.x,2)+Math.pow(vect.y,2),.5);
  return Point(vect.x/m, vect.y/m);
}

function add(vect1, vect2)
{
  return Point(vect1.x+vect2.x, vect1.y+vect2.y);
}

function mul(vect, scale)
{
  return Point(vect.x*scale, vect.y*scale);
}

function shuffle(array) {
  var rand, index = -1,
    length = array.length,
    result = Array(length);
  while (++index < length) {
    rand = Math.floor(Math.random() * (index + 1));
    result[index] = result[rand];
    result[rand] = array[index];
  }
  return result;
}

function maxArray(a)
{
  var largest = -Infinity;
  for (var i in a)
  {
    if (a[i] > largest)
    {
      largest = a[i];
    }
  }
  return largest;
}

var mainBeats = [1];
var offBeats = [4/3, 1/2]; //unstressed
var secondaryBeats = [5/3]; //accented

var Time = 0;
var speed = 4;


var beatQueue = [[],[],[]];

//Too low you might skip beats
//Too high it'll be imprecise
var hitThreshold = .01;

var canvas;
var width;
var height;
var ctx;

var lastTime;
var deltaTime;

var mouseX;
var mouseY;
var lastMouse;
var deltaMouse;

var mouseClicked;
var mouseDown;
var mouseUp;

var keyPressed;

function resize() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
}

function showGUI()
{
  height = canvas.height = window.innerHeight-50;
}

function start() {
	canvas = document.getElementById('main');
	ctx = canvas.getContext('2d');
	resize();
	
	lastTime = time();
	lastMouse = {x: mouseX, y: mouseY};
	
	canvas.style.background = '#ffe2fd';

	requestAnimationFrame(update, canvas);
}
start();

function mod(x,n)
{
  return x-Math.floor(x/n)*n
}

//Many thanks to https://codepen.io/rauldronca who is hosting these files on their codepen account

var soundUrls = ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/SD0025.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/SD0010.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/SD0000.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/RS.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/OH25.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/MA.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/CY0010.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/CH.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/CB.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/BD0010.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/BD0000.mp3',
'https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/CP.mp3']

var sounds = soundUrls.map(function (x) {return new Audio(x)})

sounds.map(function(x) {x.load()});  //load all the sounds

function addBeatFromDocument()
{
  addBeat($('#beatType')[0].value, 
          $('#location')[0].value, 
          $('#ringNum')[0].value)
}

function addBeat(type, timing, ring)
{
  if (type=="Main")
    mainBeats.push(parseInt(ring, 10)-1+parseInt(timing, 10)/100);
  else if (type=="Secondary")
    secondaryBeats.push(parseInt(ring, 10)-1+parseInt(timing, 10)/100);
  else if (type=="Off")
    offBeats.push(parseInt(ring, 10)-1+parseInt(timing, 10)/100);
}

function update() {
	ctx.clearRect(0, 0, width, height);
  
	deltaTime = time() - lastTime;
	deltaMouse = {x:mouseX-lastMouse.x, y:mouseY-lastMouse.y}

  var radius = Math.min(200, width/2*.7);
  
  //big circle
  ctx.fillStyle = '#d8ca3e';
  ctx.translate(width/2, height/2);
  ctx.beginPath();
  ctx.arc(0,0,radius,0,2*Math.PI)
  ctx.fill();
  
  //rings
  var numberOfRings = Math.min(4, Math.max(2, Math.floor(maxArray(mainBeats.concat(secondaryBeats).concat(offBeats))+1)));
  
  for (var i=0; i<numberOfRings; i++)
  {
    var radialFactor = (.9-.2*i);
    ctx.strokeStyle = '#ffe2fd';
    ctx.lineWidth = 12*radialFactor;
    ctx.beginPath();
    ctx.arc(0,0,radialFactor*radius,0,2*Math.PI)
    ctx.stroke();
  }
  
  //dots
  
  var beatTypes = [mainBeats, secondaryBeats, offBeats];
  var beatColors = ["rgba(0, 126, 168, .6)", "white", "rgba(219, 61, 8, .7)"];
  
  for (var j in beatTypes)
  {
    if (beatQueue[0].length+beatQueue[1].length+beatQueue[2].length<2) beatQueue[j] = beatTypes[j].slice();
    for (var d in beatTypes[j])
    {
      if ((-1+numberOfRings-Math.floor(beatTypes[j][d])) >= 0)
      {
        var radialFactor = (.9-.2*(-1+numberOfRings-Math.floor(beatTypes[j][d])));
        ctx.rotate(2*Math.PI*beatTypes[j][d]);
        ctx.translate(0,-radialFactor*radius);

        var dotRadius = 18;

        var angularBeatPos = mod(beatTypes[j][d], 1);
        var angularTime = mod(Time, 2*Math.PI);

        var angularDifference = angularTime/(2*Math.PI)-angularBeatPos;

        angularDifference += .5
        angularDifference = mod(angularDifference, 1);
        angularDifference -= .5

        if (Math.abs(angularDifference) <= hitThreshold*speed)
          { 
            //play a beat ! (sorta, gotta only happen once)
            
            //console.log(j)
            
            beatQueue[j].splice(d, 1);
            
            if (j==0) //main beat
              sounds[10].play()
            if (j=="1") //secondary beat
              {
              sounds[1].play()
              }
            if (j==2) //off beat
              sounds[0].play()
            dotRadius += 5;
          }

        if (beatColors[j]=="white")
        {
          ctx.rotate(-2*Math.PI*beatTypes[j][d]);
          ctx.fillStyle = "rgba(22, 100, 81, .2)";
          ctx.beginPath();
          ctx.arc(3,5,dotRadius,0,2*Math.PI);
          ctx.fill();
          ctx.rotate(2*Math.PI*beatTypes[j][d]);
        }

        ctx.fillStyle = beatColors[j];
        ctx.beginPath();
        ctx.arc(0,0,dotRadius,0,2*Math.PI);
        ctx.fill();
        ctx.translate(0,radialFactor*radius);
        ctx.rotate(-2*Math.PI*beatTypes[j][d]);
    }
    else
    {
      //if this happens then there are some beats outside the span of the circle
    }
    }
  }
  
  //arrow
  ctx.rotate(Time);
  ctx.fillStyle = "#253470";
  ctx.beginPath();
  ctx.moveTo(0+10, 0);
  ctx.lineTo(0, -1.2*radius);
  ctx.lineTo(0-10, 0)
  ctx.fill();
  ctx.rotate(-Time);
  
  ctx.translate(-width/2, -height/2)
  
  Time += speed*deltaTime/1000;
  
	requestAnimationFrame(update, canvas);
	
	lastMouse = {x:mouseX, y:mouseY};
	lastTime = time();
	
	mouseDown = false;
	mouseUp = false;
	
}

function onKey(event, keycode, down) {
	keyPressed = down;
}

function onMouse(event, down) {
	mouseDown = down && !mouseClicked;
	mouseUp = !down && mouseClicked;
	mouseClicked = down;
}

document.addEventListener('keydown', function(ev) {
	return onKey(ev, ev.keyCode, true);
}, false);
document.addEventListener('keyup', function(ev) {
	return onKey(ev, ev.keyCode, false);
}, false);

document.addEventListener('mousedown', function(ev) {
	return onMouse(ev, true);
}, false);
document.addEventListener('mouseup', function(ev) {
	return onMouse(ev, false);
}, false);

document.addEventListener('mousemove', function(ev) {
	mouseX = ev.clientX;
	mouseY = ev.clientY;
})

window.onresize = resize;