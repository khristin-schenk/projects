var renderer, scene, camera, group;
var mouseX = 0;
var mouseY= 0;
   
var drawCount;
var wave;
var mesh;
var positionx ;

var h = 200;
var amplitude = h;
var frequency = .03;
var phi = 0;
var frames = 0; 
  
init();
animate();  

function init() {

	// renderer
	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);
  
	// camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(0, 100, 500);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
       
            
	// scene
	scene = new THREE.Scene();
	scene.updateMatrixWorld();
  
	var light = new THREE.AmbientLight( 0x999999, .8 ); 
	scene.add( light );
	var hemilight = new THREE.HemisphereLight( "#D66D75", "#26688F", 1.7 ); 
	scene.add( hemilight ); 
	var dirLight = new THREE.DirectionalLight( 0xffffff, .6 );
		dirLight.color.setHSL( 0.1, 1, 0.95 );
		dirLight.position.set( -1, 1.75, 1 );
		dirLight.position.multiplyScalar( 50 ); 
		scene.add( dirLight );

	// sine wave geometry 
	var geometry = new THREE.BufferGeometry();
	var vertices = new Float32Array( 3000 );

	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	var material = new THREE.LineBasicMaterial( { color: "#000", linewidth: 3 } );
  

	// draw range
	drawCount = 0; // draw the first 2 points, only
	geometry.setDrawRange( 0, drawCount );


	// sine wave
	wave = new THREE.Line(geometry, material);
	wave.rotation.x = -Math.PI / 2;
	
	updatePositions();

	// load json file
	var loader = new THREE.JSONLoader();
	loader.load('https://raw.githubusercontent.com/ellenprobst/3d-sine-wave/master/handandpencil.json', generateMesh );

	group = new THREE.Group();
	group.add(wave);

	group.position.y = -100;
	group.position.x = -20;
	group.position.z = -100;

	scene.add(group);

	window.addEventListener( 'resize', onWindowResize, false );
 
  //plane(); 
  
};

// generate plane
function plane(){
	var geometry = new THREE.BoxGeometry( 1000, 1, 1000 );
	var material = new THREE.MeshBasicMaterial( {color: 'beige'} );
	var plane = new THREE.Mesh( geometry, material );
	plane.receiveShadow = true;
	plane.position.y = -100;
	
	group.add( plane );
}; 
 
// load pencil 
function generateMesh(geometry, material){
	geometry.computeVertexNormals();
	mesh = new THREE.Mesh(geometry, material);
	mesh.scale.y = mesh.scale.z = mesh.scale.x = 85;
	
	mesh.position.y = -15;
	mesh.position.z = 72;
	
	mesh.rotation.x = -.10;
	group.add(mesh);
}; 

// set up sine wave
function updatePositions(){
	var positions = wave.geometry.attributes.position.array; 
	var y = z =index = 0;
	frames++;
	phi = frames / 13; 

	for ( var i = 0, l = 630; i < l; i ++ ) {

		positions[ index ++ ] = x;
		positions[ index ++ ] = y;
		positions[ index ++ ] = z;
		
		y ++;
		var x = Math.sin(-y * frequency + phi) * amplitude / 2 ;
		positionx = x - 90 ; // add offset to match pencil position
	}
};

document.addEventListener('mousemove', onMouseMove, false);

// Follows the mouse event
function onMouseMove(event) {
  event.preventDefault();
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = - (event.clientY / window.innerHeight) * 2 + 1;
};

// on resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// render
function render() {
  	renderer.render( scene, camera );
};

// animate
function animate() {
	
	requestAnimationFrame( animate );
 // position pencil on sine wave
    mesh ? mesh.position.x = positionx : null;
 	
  //draw sine
	wave.geometry.setDrawRange( 0, 630 );
	updatePositions();
	wave.geometry.attributes.position.needsUpdate = true; 
 
	group.rotation.y = mouseX * 1.5;
	group.rotation.x = mouseY * 1 ;

	render();
};