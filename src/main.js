import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// const pointLight = new THREE.PointLight(0xffffff, 10.0);
// pointLight.position.x = 0;
// pointLight.position.y = 10;
// pointLight.position.z = -10;
// pointLight.castShadow = true;
// pointLight.shadow.mapSize.width = 512;
// pointLight.shadow.mapSize.height = 512;
// pointLight.shadow.camera.near = 0.5;
// pointLight.shadow.camera.far = 500;
// scene.add(pointLight);

const sqLength = 4;

const squareShape = new THREE.Shape()
	.moveTo(0, 0)
	.lineTo(0, sqLength)
	.lineTo(sqLength, sqLength)
	.lineTo(sqLength, 0)
	.lineTo(0, 0);

const clonegeo = new THREE.ShapeGeometry(squareShape);
clonegeo.center();

const clonemat = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	side: THREE.DoubleSide,
});

const cloneMesh = new THREE.Mesh(clonegeo, clonemat);

const patchGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 32, 32);

const patchMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 1,
});
const position = [
	{ x: 0.8, y: -0.6, z: -1 },
	{ x: 0.1, y: 0.5, z: -0.2 },
	{ x: -0.9, y: 0.1, z: -0.8 },
	{ x: -0.5, y: -0.5, z: -0.8 },
];
const raycaster = new THREE.Raycaster();
const rayDirection = new THREE.Vector3(0, 0, 1);
const patchLength = 0.5;
const holes = [];
for (let i = 0; i < position.length; i++) {
	const patchMesh = new THREE.Mesh(patchGeometry, patchMaterial);

	patchMesh.position.set(position[i].x, position[i].y, position[i].z);

	const rayOrigin = new THREE.Vector3(
		position[i].x,
		position[i].y,
		position[i].z
	);
	raycaster.set(rayOrigin, rayDirection);
	const intersect = raycaster.intersectObject(cloneMesh);

	console.log(intersect);
	const patchOrigin = {
		x: 2 + intersect[0].point.x,
		y: 2 + intersect[0].point.y,
	};
	const hole = new THREE.Path()
		.moveTo(patchOrigin.x, patchOrigin.y)
		.lineTo(patchOrigin.x, patchOrigin.y + patchLength / 2.0)
		.lineTo(
			patchOrigin.x - patchLength / 2.0,
			patchOrigin.y + patchLength / 2.0
		)
		.lineTo(
			patchOrigin.x - patchLength / 2.0,
			patchOrigin.y - patchLength / 2.0
		)
		.lineTo(
			patchOrigin.x + patchLength / 2.0,
			patchOrigin.y - patchLength / 2.0
		)
		.lineTo(
			patchOrigin.x + patchLength / 2.0,
			patchOrigin.y + patchLength / 2.0
		)
		.lineTo(patchOrigin.x, patchOrigin.y + patchLength / 2.0);
	holes.push(hole);
	patchMesh.rotateX(Math.PI * 0.5);
}

for (let i = 0; i < holes.length; i++) {
	squareShape.holes.push(holes[i]);
}
//raycaster

const geometry = new THREE.ShapeGeometry(squareShape);
geometry.center();
geometry.rotateX(Math.PI * 0.5);
const material = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	side: THREE.DoubleSide,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
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
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	controls.update();
	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
