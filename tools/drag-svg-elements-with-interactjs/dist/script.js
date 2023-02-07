const getPosXY = event => {
  let rect = event.target.getBoundingClientRect();
  let x = event.offsetX || event.pageX - rect.left - window.scrollX;
  let y = event.offsetY || event.pageY - rect.top - window.scrollY;
  return [x, y];
};
const getEl = id => document.getElementById(id);
const sns = "http://www.w3.org/2000/svg";
const xns = "http://www.w3.org/1999/xlink";
const root = getEl('mysvg');
const star = getEl('edit-star');
const coord = getEl('coord');
var rootMatrix;
var originalPoints = [];
var transformedPoints = [];
root.addEventListener('mousemove', event => {
  let [x, y] = getPosXY(event);
  coord.innerText = `x,y = ${x},${y}`;
});
// BEGIN SECTION CODE TO DRAG POINTS OF THE STAR POLYGON
for (let i = 0, len = star.points.numberOfItems; i < len; i++) {
  let handle = document.createElementNS(sns, 'use');
  let point = star.points.getItem(i);
  let newPoint = root.createSVGPoint();

  handle.setAttributeNS(xns, 'href', '#point-handle');
  handle.setAttribute('class', 'point-handle');

  handle.x.baseVal.value = newPoint.x = point.x;
  handle.y.baseVal.value = newPoint.y = point.y;

  handle.setAttribute('data-index', i);

  originalPoints.push(newPoint);
  root.appendChild(handle);
}

function applyTransforms(event) {
  rootMatrix = root.getScreenCTM();
  transformedPoints = originalPoints.map(point => point.matrixTransform(rootMatrix));

  interact('.point-handle').draggable({
    snap: {
      targets: transformedPoints,
      range: 20 * Math.max(rootMatrix.a, rootMatrix.d) } });


}

interact(root).
on('mousedown', applyTransforms).
on('touchstart', applyTransforms);

interact('.point-handle').
draggable({
  onstart: event => root.setAttribute('class', 'dragging'),
  onmove: function (event) {
    let i = event.target.getAttribute('data-index') | 0;
    let point = star.points.getItem(i);

    point.x += event.dx / rootMatrix.a;
    point.y += event.dy / rootMatrix.d;

    event.target.x.baseVal.value = point.x;
    event.target.y.baseVal.value = point.y;
  },
  onend: event => root.setAttribute('class', ''),
  snap: {
    targets: originalPoints,
    range: 10,
    relativePoints: [{ x: 0.5, y: 0.5 }] },

  restrict: { restriction: document.rootElement } }).

styleCursor(false);

document.addEventListener('dragstart', event => event.preventDefault());
// END SECTION CODE TO DRAG POINTS OF STAR  
interact('.godragit').
draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  restrict: {
    restriction: "parent",
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 } },

  // enable autoScroll
  autoScroll: true,

  // call this function on every dragmove event
  onmove: dragMoveListener,
  // call this function on every dragend event
  onend: event => {
    let info = getEl('infoMove');
    let distance = Math.sqrt(Math.pow(event.pageX - event.x0, 2) + Math.pow(event.pageY - event.y0, 2) | 0).toFixed(2);
    console.log(`moved a distance of ${distance} px`);
    info.innerText = `moved a distance of ${distance} px`;
  } });

function dragMoveListener(event) {
  var target = event.target,
  // keep the dragged position in the data-x/data-y attributes
  x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
  y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
  'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}