import { initScene } from './core/scene.js';
import { createCemetery } from './cemetery/tombs.js';
import { createGalaxy } from './galaxy/galaxy-system.js';
import { initFPSCamera } from './controls/fps-camera.js';
import { initKeyboard } from './controls/keyboard.js';

console.log('🚀 Memorial Park starting...');

const { scene, camera, renderer } = initScene();

createCemetery(scene);
const galaxyData = createGalaxy(scene);

initFPSCamera(camera);
const updateKeyboard = initKeyboard(camera);

// Анимационный цикл
function animate() {
    requestAnimationFrame(animate);
    updateKeyboard();
    renderer.render(scene, camera);
}

animate();

console.log('✅ Memorial Park ready!');
