// УДАЛИ ЭТУ СТРОКУ: import * as THREE from './three.min.js';
import { initScene } from './core/scene.js';
import { initCemetery } from './cemetery/tombs.js';
import { initFpsCamera } from './controls/fps-camera.js';

document.addEventListener('DOMContentLoaded', () => {
    const { container, scene, camera, renderer } = initScene();
    const { earthGroups } = initCemetery(scene);
    const cameraControls = initFpsCamera(container, camera);

    const fpsDisplay = document.getElementById('fpsDisplay');
    const btnReset = document.getElementById('btnReset');

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (cameraControls && cameraControls.resetCamera) {
                cameraControls.resetCamera();
            }
        });
    }

    let lastTime = performance.now();
    let frameCount = 0;

    function animate(time) {
        requestAnimationFrame(animate);

        frameCount++;
        if (time - lastTime >= 1000) {
            if (fpsDisplay) {
                fpsDisplay.textContent = `${frameCount} FPS`;
            }
            frameCount = 0;
            lastTime = time;
        }

        renderer.render(scene, camera);
    }

    animate(performance.now());
});
