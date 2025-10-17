import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. காட்சி, கேமரா, ரெண்டரர்
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // அழகான நீல வானம்

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 8, 15); // வீட்டை முழுமையாகக் காட்டும் கோணம்

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// 2. ஒளிகள்
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(15, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 3. கண்ட்ரோல்கள்
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//---------------------------------------------------------
// ★ நாமே உருவாக்கும் 2 மாடி வீடு ★
//---------------------------------------------------------

// ஒரு பொருளை உருவாக்கும் செயல்பாடு
function createBox(width, height, depth, color, x, y, z) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z);
    box.castShadow = true;
    box.receiveShadow = true;
    return box;
}

// 1. தரைத் தளம் (Ground Floor)
const groundFloor = createBox(10, 5, 7, 0xf0e68c, 0, 2.5, 0); // சுவரின் நிறம்
scene.add(groundFloor);

// 2. முதல் தளம் (First Floor)
const firstFloor = createBox(8, 5, 7, 0xffffff, 1, 7.5, 0); // வெள்ளை நிறத்தில்
scene.add(firstFloor);

// 3. கூரை (Roof)
const roof = createBox(10, 0.5, 8, 0x8B4513, 0, 10.25, 0); // கூரையின் நிறம்
scene.add(roof);

// 4. பிரதான கதவு (Main Door)
const mainDoor = createBox(2, 3, 0.2, 0x8B4513, 0, 1.5, 3.6);
scene.add(mainDoor);

// 5. ஜன்னல்கள் (Windows)
const window1 = createBox(2.5, 2, 0.2, 0x5f9ea0, -3, 6.5, 3.6);
const window2 = createBox(2.5, 2, 0.2, 0x5f9ea0, 3, 6.5, 3.6);
scene.add(window1);
scene.add(window2);

// 6. பால்கனி (Balcony)
const balconyFloor = createBox(8.2, 0.2, 3, 0xcccccc, 1, 5, 5);
const balconyRail = createBox(8.2, 1, 0.2, 0x333333, 1, 5.6, 6.4);
scene.add(balconyFloor);
scene.add(balconyRail);


// 7. பச்சை நிற தரை (Green Ground)
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);


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
