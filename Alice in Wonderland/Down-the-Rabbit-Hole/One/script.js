let frag = `
vec4 abyssColor = vec4(0, 0, 0, 0);
vec4 tunnelColor = vec4(1.5, 1.2, 1.1, 1);

uniform float time;
uniform vec2 resolution;

void main() {

    vec2 uv = ( gl_FragCoord.xy - .5 * resolution.xy) / resolution.y * 0.6;
    
    float r = length(uv);
   	float y = fract( r / 0.005 / ( r - 0.01 ) + time * 1.);
	
    y = smoothstep( 0.01, 4., y );
   
   	float x = length(uv);
   	x = smoothstep( 0.5, .01, x );

    gl_FragColor = mix( tunnelColor, abyssColor, x ) * y;
}
`;

let scene, camera, renderer, animationId;
let uniforms, geometry, material, mesh;
let startTime = Date.now();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2);
  camera.position.z = 1;

  geometry = new THREE.PlaneGeometry(10, 10);
  material = new THREE.ShaderMaterial({
    uniforms: {
      time: { type: 'f', value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() } },

    fragmentShader: frag });


  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });

  material.uniforms.resolution.value.x = window.innerWidth;
  material.uniforms.resolution.value.y = window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  let elapsedMilliseconds = Date.now() - startTime;
  material.uniforms.time.value = elapsedMilliseconds / 1000.;
  renderer.render(scene, camera);
}

init();
animate();

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  material.uniforms.resolution.value.x = window.innerWidth;
  material.uniforms.resolution.value.y = window.innerHeight;
  renderer.setSize(innerWidth, innerHeight);
}

addEventListener('resize', resize);