const rad = d => d * Math.PI / 180;
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 400;
canvas.height = 400;
canvas.style.border = "2px solid #000";
const ctx = canvas.getContext("2d");

const engine = Matter.Engine.create();
const mouseConstraint = Matter.MouseConstraint.create(
  engine, {element: canvas}
  //engine, {mouse: Matter.Mouse.create(document.body)}
);

//Matter.Events.on(mouseConstraint, "mousedown", e => console.log(e));
//const setMouseOffset = e => {
//  const rect = canvas.getBoundingClientRect();
//  Matter.Mouse.setOffset(mouseConstraint.mouse, {
//    x: -rect.x, y: -rect.y
//  });
//};
//document.addEventListener("mousemove", setMouseOffset);
Matter.Composite.add(engine.world, mouseConstraint);

// Create body arrays
const boxes = [];
const ledges = [
  Matter.Bodies.rectangle(
    -100, canvas.height - 50, 
    canvas.width, 300, 
    {isStatic: true}
  ),
  Matter.Bodies.rectangle(
    canvas.width / 2 + 250, 
    canvas.height + 40, 
    canvas.width, 300, 
    {isStatic: true}
  )
];
Matter.Body.rotate(ledges[0], rad(25));
Matter.Body.rotate(ledges[1], rad(-25));

// Add bodies to the world
Matter.Composite.add(engine.world, ledges);
//Engine.run(engine); 

const draw = (body, ctx) => {
  ctx.fillStyle = body.color || "#fff";
  ctx.beginPath();
  body.vertices.forEach(e => ctx.lineTo(e.x, e.y));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

const inBounds = (body, canvas) =>
  body.vertices.some(({x, y}) => 
    x < canvas.width && x > 0 && y < canvas.height
  )
;
(function update() {
  if (boxes.length < 50 || Math.random() < 0.0001) {
    const box = Matter.Bodies.rectangle(
      50, -130, Math.random() * 50 + 5, 
      Math.random() * 50 + 5,
      {frictionAir: 0.01, friction: 0.1, restitution: 0.6}
    );
    boxes.push(box);
    box.color = `hsl(${Math.random() * 200 + 160}, 90%, 50%)`;
    Matter.Composite.add(engine.world, box);
    Matter.Body.rotate(box, rad(Math.random() * 360));
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = boxes.length - 1; i >= 0; i--) {
    draw(boxes[i], ctx);

    if (!inBounds(boxes[i], canvas)) {
      Matter.Composite.remove(engine.world, boxes[i]);
      boxes.splice(i, 1);
    }
  }

  ledges.forEach(e => draw(e, ctx));
  Matter.Engine.update(engine); // instead of a single call to Engine.run(engine)
  requestAnimationFrame(update);
})();