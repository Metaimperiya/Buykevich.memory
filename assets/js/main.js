import { initScene } from './core/scene.js';
import { initCemetery } from './cemetery/tombs.js';
import { initGalaxy, galaxyData } from './galaxy/galaxy-system.js';
import { initControls } from './controls/fps-camera.js';

const { container, scene, camera, renderer } = initScene();
const { earthGroups, candleLightMat } = initCemetery(scene);
const { galaxyCloud, galaxyGeo, galaxyBaseFinal, galaxyFlagsFinal, galaxyIdx } = initGalaxy(scene);
const controls = initControls(container, camera);

// --- СФЕРЫ ДЛЯ ХОВЕРА / РЕЙКАСТА ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const graveInfo = document.getElementById('graveInfo');
const graveName = document.getElementById('graveName');
const graveDates = document.getElementById('graveDates');
const graveLocation = document.getElementById('graveLocation');

const allSpheres = [];
earthGroups.forEach((g, idx) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 8, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    sphere.position.set(g.position.x, 2, g.position.z);
    sphere.userData = { type: 'earth', index: idx };
    scene.add(sphere);
    allSpheres.push(sphere);
});

galaxyData.forEach((g, idx) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(6, 8, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    sphere.position.set(g.x, g.y + 2, g.z);
    sphere.userData = { type: 'galaxy', index: idx };
    scene.add(sphere);
    allSpheres.push(sphere);
});

// Raycast Hover
container.addEventListener('mousemove', (e) => {
    if (controls.getIsLocked()) {
        // В режиме FPS наводимся строго по центру экрана
        mouse.x = 0;
        mouse.y = 0;
    } else {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(allSpheres);

    if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        let g, loc;
        if (data.type === 'earth') {
            g = earthGroups[data.index];
            loc = '✦ ЗЕМЛЯ ✦';
        } else {
            g = galaxyData[data.index];
            loc = '✦ ГАЛАКТИКА ✦';
        }
        if (g && g.userData) {
            graveName.textContent = g.userData.name || 'Имя';
            graveDates.textContent = g.userData.dates || '📅 —';
            graveLocation.textContent = loc;
            graveInfo.classList.add('visible');
            if (!controls.getIsLocked()) container.style.cursor = 'pointer';
        }
    } else {
        graveInfo.classList.remove('visible');
        if (!controls.getIsLocked()) container.style.cursor = 'grab';
    }
});

// --- КНОПКИ UI ---
let candlesOn = true, galaxyOn = true, fogOn = true;

document.getElementById('btnReset').addEventListener('click', () => controls.resetCamera());

document.getElementById('btnCandles').addEventListener('click', function() {
    candlesOn = !candlesOn;
    this.classList.toggle('active');
    this.textContent = candlesOn ? '🕯️' : '🕯️OFF';
    earthGroups.forEach((group) => {
        group.children.forEach((child) => {
            if (child.isPointLight) child.intensity = candlesOn ? 1.5 : 0;
            if (child.type === 'Mesh' && child.material === candleLightMat) child.visible = candlesOn;
        });
    });
});

document.getElementById('btnGalaxy').addEventListener('click', function() {
    galaxyOn = !galaxyOn;
    this.classList.toggle('active');
    this.textContent = galaxyOn ? '🌌' : '🌌OFF';
    galaxyCloud.visible = galaxyOn;
});

document.getElementById('btnFog').addEventListener('click', function() {
    fogOn = !fogOn;
    this.classList.toggle('active');
    this.textContent = fogOn ? '🌫️' : '🌫️OFF';
    scene.fog.density = fogOn ? 0.008 : 0.0001;
});

container.addEventListener('contextmenu', (e) => e.preventDefault());

// --- FPS СЧЕТЧИК ---
let fc = 0, lastFps = performance.now();
const fpsEl = document.getElementById('fpsDisplay');

// --- ГЛАВНЫЙ ЦИКЛ (ANIMATE) ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (candlesOn) {
        earthGroups.forEach((group) => {
            group.children.forEach((child) => {
                if (child.isPointLight) {
                    child.intensity = (0.7 + Math.sin(t * 5 + child.id * 0.5) * 0.3) * 1.5;
                }
            });
        });
    }

    if (galaxyOn) {
        const gp = galaxyGeo.attributes.position;
        for (let i = 0; i < galaxyIdx; i++) {
            if (galaxyFlagsFinal[i] >= 1 && galaxyFlagsFinal[i] <= 3) {
                const bx = galaxyBaseFinal[i * 3], by = galaxyBaseFinal[i * 3 + 1], bz = galaxyBaseFinal[i * 3 + 2];
                gp.setXYZ(i, bx, by + Math.sin(t * 0.3 + bx * 0.03 + bz * 0.03) * 0.3, bz);
            }
        }
        gp.needsUpdate = true;
    }

    controls.updateKeyboard();

    fc++;
    const now = performance.now();
    if (now - lastFps >= 1000) {
        fpsEl.textContent = Math.round(fc * 1000 / (now - lastFps)) + ' FPS';
        fc = 0;
        lastFps = now;
    }

    renderer.render(scene, camera);
}

animate();
