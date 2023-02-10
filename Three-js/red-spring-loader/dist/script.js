import * as THREE from "https://cdn.skypack.dev/three@0.135.0";
import {OrbitControls} from "https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(-10, 10, 10).setLength(10);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
})

let contorls = new OrbitControls(camera, renderer.domElement);

//scene.add(new THREE.GridHelper())

let pts = [];

let mainR = 2;
let tubeR = 0.5;
let turns = 50;
let pointsPerTurn = 100;
let pointStep = (Math.PI * 2) / (pointsPerTurn);
let heightShift = 1 / (pointsPerTurn * turns);

let v3 = new THREE.Vector3();
let n = new THREE.Vector3(0, 0, 1);

for(let i = 0; i <= (pointsPerTurn * turns); i++){
  let v = new THREE.Vector3().setFromCylindricalCoords(tubeR, i * pointStep, i * heightShift);
  v3.set(mainR, 0, 0);
  v.add(v3);
  v.setY(0);
  v.applyAxisAngle(n, (pointStep / turns) * i);
  pts.push(v);
}

let uniforms = {
  time: {value: 0}
}

let g = new THREE.BufferGeometry().setFromPoints(pts);
let m = new THREE.LineDashedMaterial({
  color: "yellow",
  onBeforeCompile: shader => {
    shader.uniforms.time = uniforms.time;
    shader.fragmentShader = `
      uniform float time;
      ${shader.fragmentShader}
    `.replace(
      `mod( vLineDistance, totalSize )`,
      `mod( vLineDistance - time, totalSize )`
    );
    console.log(shader.fragmentShader)
  }
});
let l = new THREE.Line(g, m);
l.computeLineDistances();
//console.log(l);
let lds = g.attributes.lineDistance;
let ld = lds.getX(lds.count - 1);
let dash = ld / 6;
m.dashSize = dash * 1.25;
m.gapSize = dash * 0.75;
scene.add(l);

let clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  let t = clock.getElapsedTime();
  uniforms.time.value = t * 5 * Math.PI * 2;
  renderer.render(scene, camera);
})