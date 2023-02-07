function setupLogo(){
	sW = $(window).width();
	sH = $(window).height();
	var Engine = Matter.Engine,
	    Composites = Matter.Composites,
	    Runner = Matter.Runner,
	    MouseConstraint = Matter.MouseConstraint,
	    Mouse = Matter.Mouse,
	    Events = Matter.Events,
	    World = Matter.World,
	    Common = Matter.Common,
			Composite = Matter.Composite,
	    Constraint = Matter.Constraint,
	    Render = Matter.Render,
	    Body = Matter.Body,
	    Bodies = Matter.Bodies;
	var engine = Engine.create($('#engine'));
	var render = Render.create({
	    element: $('#engine')[0],
	    engine: engine,
	    options: {
	        width: sW,
	        height: sH,
			showAngleIndicator: true,
			showCollisions: true,
			showVelocity: true
		}
	});	
	Render.run(render);
	var top = Bodies.rectangle(sW, -50, sW*2, 100, { isStatic: true, density: 1 });
	var right = Bodies.rectangle(sW + 50, sH/2, 100, sH*3, { isStatic: true, density: 1});
	var bottom = Bodies.rectangle(sW, sH + 50, sW*2, 100, { isStatic: true, density: 1});
	var left = Bodies.rectangle(-50, sH/2, 100, sH*3, { isStatic: true, density: 1 });
	var shape = Bodies.circle(sW/2, sH/2,$('#logo').width()/2, {
		restitution: 1,
		friction: 0,
		frictionAir: 0,
		density: 0.001,
		inertia: Infinity,
	});
	engine.world.gravity.x = 0;
	engine.world.gravity.y = 0;
	World.add(engine.world, [
	    top,
	    right,
	    left,
	    bottom,
	    shape
	]);
	runner = Engine.run(engine)
	updateLogo();
	function updateLogo() {
		TweenMax.set($('#logo'), {top:shape.position.y, left:shape.position.x, x:'-50%', y: '-50%', transformOrigin:'50% 50%'});								
		$logoMove = requestAnimationFrame(updateLogo);
	} 	
	
	var resetBounds = function(){
		Runner.stop(runner);
		Runner.stop(engine);
		TweenMax.killAll();
		$('#engine canvas').remove();
		cancelAnimationFrame($logoMove);
		setupLogo();
	};
var rtime;
var timeout = false;
var delta = 200;
$(window).resize(function() {
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
});

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
				resetBounds();
    }               
}
	Events.on(engine, 'afterUpdate', function(event) {
		engine.timing.timeScale += (.25 - engine.timing.timeScale) * 0.05;

	});
	var $shakeTimeout;
	Events.on(engine, 'collisionStart', function(event) {
		//clearTimeout($shakeTimeout);
		shakeScene();
    });
	Events.on(engine, 'collisionEnd', function(event) {
		//clearTimeout($shakeTimeout);
		//$shakeTimeout = setTimeout(shakeScene, 1600);		
    });
    var shakeScene = function() {
	    var forceMagnitude = .007 * shape.mass;
		Body.applyForce(shape, shape.position, { 
            x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]), 
            y: -forceMagnitude + Common.random() * -forceMagnitude
        });
    };
	shakeScene();
}
setupLogo();