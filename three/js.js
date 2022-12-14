var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var geometry = new THREE.BoxGeometry(2, 2, 2);

const texture = new THREE.TextureLoader().load("imgs/73896798.jpeg");
var material = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  map: texture,
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
renderer.render(scene, camera);

var animate = function () {
  requestAnimationFrame(animate);
  // requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
