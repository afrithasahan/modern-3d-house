import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. காட்சி (Scene), கேமரா, ரெண்டரர் உருவாக்குதல்
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // பின்னணி நிறம்

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5); // கேமராவின் ஆரம்ப நிலை

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // நிழல்களை இயக்குதல்

// 2. ஒளிகள் (Lights)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 15, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 3. கண்ட்ரோல்கள் (Controls)
// சுட்டியை/விரலைப் பயன்படுத்தி சுற்றிப் பார்க்க
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // மென்மையான அசைவுக்காக

// 4. 3D மாடலை ஏற்றுதல் (Loading 3D Model)
const loader = new GLTFLoader();
// இது ஒரு மாதிரி 3D மாடல். இதை நாம் பின்னர் வீட்டு மாடலாக மாற்றலாம்.
const modelURL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/PrimaryIonDrive.glb';

loader.load(modelURL, (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 1, 0);
    model.scale.set(0.5, 0.5, 0.5);

    model.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });

    scene.add(model);
}, undefined, (error) => {
    console.error(error);
});

// 5. தரை (Floor)
const floorGeometry = new THREE.PlaneGeometry(30, 30);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);


// அனிமேஷன் லூப்
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// திரையின் அளவு மாறும்போது கேமராவையும் சரிசெய்தல்
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate(); // அனிமேஷனைத் தொடங்கு
