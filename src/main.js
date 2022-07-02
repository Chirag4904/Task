import "./style.css";

import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

const pointLight = new THREE.PointLight(0xffffff, 10.0);
pointLight.position.x = 0;
pointLight.position.y = 10;
pointLight.position.z = -10;
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 512;
pointLight.shadow.mapSize.height = 512;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 500;
scene.add(pointLight);

const sqLength = 4;

const squareShape = new THREE.Shape()
	.moveTo(0, 0)
	.lineTo(0, sqLength)
	.lineTo(sqLength, sqLength)
	.lineTo(sqLength, 0)
	.lineTo(0, 0);

const geometry = new THREE.ShapeGeometry(squareShape);
geometry.center();
geometry.rotateX(Math.PI * -0.5);
const material = new THREE.MeshStandardMaterial({
	color: 0x00ff00,
	side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.receiveShadow = true;

scene.add(mesh);

const patchGeometry = new THREE.PlaneGeometry(0.5, 0.5, 32, 32);
const patchMaterial = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 0,
});
const position = [
	{ x: 0.4, y: 1.3, z: -2 },
	{ x: 0.2, y: 0.5, z: -0.2 },
	{ x: -0.4, y: 2, z: -0.8 },
];

for (let i = 0; i < 3; i++) {
	const patchMesh = new THREE.Mesh(patchGeometry, patchMaterial);
	patchMesh.position.set(position[i].x, position[i].y, position[i].z);
	patchMesh.rotateX(Math.PI * -0.75);
	patchMesh.castShadow = true;

	scene.add(patchMesh);
}

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	1000
);
camera.position.x = 0;
camera.position.y = 10;
camera.position.z = -10;
scene.add(camera);
camera.lookAt(0, 0, 0);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
