import * as THREE from './three.min.js';
import { initScene } from './core/scene.js';
import { initCemetery } from './cemetery/tombs.js';
import { initFpsCamera } from './controls/fps-camera.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализируем сцену, камеру и рендер
    const { container, scene, camera, renderer } = initScene();

    // 2. Спавним кладбище
    const { earthGroups } = initCemetery(scene);

    // 3. Подключаем управление камере
    const cameraControls = initFpsCamera(container, camera);

    // 4. Элементы интерфейса
    const fpsDisplay = document.getElementById('fpsDisplay');
    const btnReset = document.getElementById('btnReset');

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (cameraControls && cameraControls.resetCamera) {
                cameraControls.resetCamera();
            }
        });
    }

    // 5. Главный цикл рендера (Animation Loop)
    let lastTime = performance.now();
    let frameCount = 0;

    function animate(time) {
        requestAnimationFrame(animate);

        // Расчет FPS
        frameCount++;
        if (time - lastTime >= 1000) {
            if (fpsDisplay) {
                fpsDisplay.textContent = `${frameCount} FPS`;
            }
            frameCount = 0;
            lastTime = time;
        }

        // Рендерим 3D кадр
        renderer.render(scene, camera);
    }

    // Старт 3D!
    animate(performance.now());
});
