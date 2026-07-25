/*
  ОСНОВНОЙ СКРИПТ ПРОЕКТА
  Подключает модули и запускает 3D движок.
  Three.js уже загружен глобально через index.html.
*/

import { initScene } from './core/scene.js';
import { initCemetery } from './cemetery/tombs.js';
import { initGalaxy, galaxyData } from './galaxy/galaxy-system.js';
import { initFpsCamera } from './controls/fps-camera.js';
import { updateKeyboard } from './controls/keyboard.js';

// --- ИНИЦИАЛИЗАЦИЯ СЦЕНЫ И МОДУЛЕЙ ---
const { container, scene, camera, renderer } = initScene();
const { earthGroups, candleLightMat } = initCemetery(scene);
const { galaxyCloud, galaxyGeo, galaxyBaseFinal, galaxyFlagsFinal, galaxyIdx } = initGalaxy(scene);

// Запускаем контроллер камеры
const fpsCamera = initFpsCamera(container, camera);

// Обновляем счетчик частиц на интерфейсе
const particleCountEl = document.getElementById('particleCount');
if (particleCountEl) {
    particleCountEl.textContent = `${galaxyIdx} particles`;
}

// --- СФЕРЫ ДЛЯ ДЕТЕКЦИИ НАВЕДЕНИЯ (RAYCASTING) ---
// Мы не проверяем наведение на сложные объекты, мы проверяем наведение на невидимые сферы вокруг них.
// Это гораздо быстрее для производительности.

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const graveInfo = document.getElementById('graveInfo');
const graveName = document.getElementById('graveName');
const graveDates = document.getElementById('graveDates');
const graveLocation = document.getElementById('graveLocation');

const allSpheres = [];

// Создаем сферы кликабельности для наземных могил
earthGroups.forEach((g, idx) => {
    // Сфера больше самого объекта, невидимая
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(5, 8, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    sphere.position.set(g.position.x, 2, g.position.z);
    sphere.userData = { type: 'earth', index: idx };
    scene.add(sphere);
    allSpheres.push(sphere);
});

// Создаем сферы кликабельности для галактики (облаков частиц)
galaxyData.forEach((g, idx) => {
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(6, 8, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    sphere.position.set(g.x, g.y + 2, g.z);
    sphere.userData = { type: 'galaxy', index: idx };
    scene.add(sphere);
    allSpheres.push(sphere);
});

// Функция проверки, куда смотрит игрок (или куда наведена мышь)
function checkRaycast() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(allSpheres);

    if (intersects.length > 0) {
        // Берем первый объект, с которым пересекся луч
        const data = intersects[0].object.userData;
        let g, loc;

        if (data.type === 'earth') {
            g = earthGroups[data.index];
            loc = '✦ ЗЕМЛЯ ✦';
        } else {
            g = galaxyData[data.index];
            loc = '✦ ГАЛАКТИКА ✦';
        }

        // Заполняем интерфейс данными объекта
        if (g) {
            // Исправление: userData может быть вложенным, если это Group
            const uData = g.userData || g;
            graveName.textContent = uData.name || 'Имя';
            graveDates.textContent = uData.dates ? `📅 ${uData.dates}` : '📅 —';
            graveLocation.textContent = loc;
            graveInfo.classList.add('visible');
            
            // Если курсор мыши виден (не заблокирован в FPS моде), меняем его вид
            if (!fpsCamera.getIsLocked()) container.style.cursor = 'pointer';
        }
    } else {
        // Если луч никуда не попал, скрываем панель информации
        graveInfo.classList.remove('visible');
        if (!fpsCamera.getIsLocked()) container.style.cursor = 'grab';
    }
}

// Отслеживание движения мыши (для Raycasting, когда курсор виден)
container.addEventListener('mousemove', (e) => {
    if (fpsCamera.getIsLocked()) return; // В FPS режиме считаем наведение строго из центра

    const rect = container.getBoundingClientRect();
    // Нормализуем координаты мыши (от -1 до 1)
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    checkRaycast();
});

// Обработка клика (можно добавить функционал при клике на могилу)
container.addEventListener('click', (e) => {
    // Чтобы клик сработал как выбор объекта, курсор не должен быть заблокирован (Pointer Lock)
    if (fpsCamera.getIsLocked()) return;

    checkRaycast(); // Проверяем наведение в момент клика
    
    // Тут можно добавить логику, если луч попал в объект
    // const intersects = raycaster.intersectObjects(allSpheres);
    // if (intersects.length > 0) { ... открыть меню / проиграть звук ... }
});


// --- КНОПКИ ИНТЕРФЕЙСА ---
let candlesOn = true,
    galaxyOn = true,
    fogOn = true;

// Кнопка сброса позиции камеры
document.getElementById('btnReset').addEventListener('click', () => fpsCamera.resetCamera());

// Переключатель свечей
document.getElementById('btnCandles').addEventListener('click', function() {
    candlesOn = !candlesOn;
    this.classList.toggle('active');
    this.textContent = candlesOn ? '🕯️' : '🕯️OFF';
    // Выключаем свет и видимость пламени у всех свечей
    earthGroups.forEach((group) => {
        group.children.forEach((child) => {
            if (child.isPointLight) {
                child.intensity = candlesOn ? 1.5 : 0;
            }
            if (child.type === 'Mesh' && child.material === candleLightMat) {
                child.visible = candlesOn;
            }
        });
    });
});

// Переключатель галактик (небесных мемориалов)
document.getElementById('btnGalaxy').addEventListener('click', function() {
    galaxyOn = !galaxyOn;
    this.classList.toggle('active');
    this.textContent = galaxyOn ? '🌌' : '🌌OFF';
    // Просто скрываем 3D объект Points
    galaxyCloud.visible = galaxyOn;
});

// Переключатель тумана
document.getElementById('btnFog').addEventListener('click', function() {
    fogOn = !fogOn;
    this.classList.toggle('active');
    this.textContent = fogOn ? '🌫️' : '🌫️OFF';
    // Меняем плотность тумана в сцене
    scene.fog.density = fogOn ? 0.003 : 0.0001; // Фикс: плотность синхронизирована с scene.js
});

// Запрещаем контекстное меню на холсте, чтобы не мешало управлению
container.addEventListener('contextmenu', (e) => e.preventDefault());


// --- СТАТИСТИКА FPS ---
let fc = 0,
    lastFps = performance.now();
const fpsEl = document.getElementById('fpsDisplay');

// --- ГЛАВНЫЙ ЦИКЛ АНИМАЦИИ (ОСНОВНОЙ ЦИКЛ ДВИЖКА) ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // 1. Анимация мерцания свечей (если включены)
    if (candlesOn) {
        earthGroups.forEach((group) => {
            group.children.forEach((child) => {
                if (child.isPointLight) {
                    // Используем sin() и id объекта для создания уникального мерцания
                    const flicker = 0.7 + Math.sin(t * 5 + child.id * 0.5) * 0.3;
                    child.intensity = flicker * 1.5;
                }
            });
        });
    }

    // 2. Анимация "дыхания" галактики (если включена)
    if (galaxyOn) {
        const gp = galaxyGeo.attributes.position;
        for (let i = 0; i < galaxyIdx; i++) {
            // Флаги определяют, к какому типу мемориала принадлежит частица
            if (galaxyFlagsFinal[i] >= 1 && galaxyFlagsFinal[i] <= 3) {
                const bx = galaxyBaseFinal[i * 3],
                    by = galaxyBaseFinal[i * 3 + 1],
                    bz = galaxyBaseFinal[i * 3 + 2];
                // Создаем волну по вертикали (ось Y)
                gp.setXYZ(i, bx, by + Math.sin(t * 0.3 + bx * 0.03 + bz * 0.03) * 0.3, bz);
            }
        }
        gp.needsUpdate = true; // Уведомляем Three.js, что геометрия изменилась
    }

    // 3. Обновление физики управления камерой (WASD клавиатура)
    updateKeyboard(camera);

    // 4. Если включен FPS режим (Pointer Lock), прицел всегда в центре
    if (fpsCamera.getIsLocked()) {
        mouse.x = 0;
        mouse.y = 0;
        checkRaycast(); // Проверяем наведение каждый кадр из центра
    }

    // 5. Расчет FPS (раз в секунду)
    fc++;
    const now = performance.now();
    if (now - lastFps >= 1000) {
        fpsEl.textContent = Math.round(fc * 1000 / (now - lastFps)) + ' FPS';
        fc = 0;
        lastFps = now;
    }

    // 6. Рендер сцены
    renderer.render(scene, camera);
}

// Запускаем цикл
animate();

console.log('🪦 Memorial Park — Ready!');
