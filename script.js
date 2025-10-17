import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// 1. காட்சி, கேமரா, ரெண்டரர்
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-10, 5, 15); // வீட்டுக்கு வெளியே நல்ல கோணத்தில் கேமரா

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true // காட்சியை மென்மையாக்க
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping; // அழகான நிறங்களுக்காக
renderer.toneMappingExposure = 1;

// 2. கண்ட்ரோல்கள்
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2, 0); // கேமரா வீட்டை மையமாக வைத்து சுற்றும்

// 3. சுற்றுச்சூழல் ஒளி (HDRI for realistic lighting)
new RGBELoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/venice_sunset_1k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
});

// 4. மிக முக்கியம்: முழுமையான வீட்டு மாடலை ஏற்றுதல்
const loader = new GLTFLoader();
// இதோ உங்களுக்கான முழுமையான, தளபாடங்களுடன் கூடிய வீட்டின் மாடல்
const modelURL = 'https://raw.githubusercontent.com/baronwatts/models/master/architecture-interior.glb';

loader.load(modelURL, (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 0, 0); // வீட்டின் நிலை
    model.scale.set(1, 1, 1); // வீட்டின் அளவு

    // வீட்டின் ஒவ்வொரு பகுதிக்கும் நிழலை இயக்குதல்
    model.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    scene.add(model);
}, 
// Loading progress (optional)
(xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
(error) => {
    console.error('An error happened while loading the model:', error);
});

// அனிமேஷன் லூப்
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// திரையின் அளவு மாறும்போது சரிசெய்தல்
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
