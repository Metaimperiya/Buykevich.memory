export function initFpsCamera(container, camera) {
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    let pitch = 0, yaw = 0;
    let isPointerLocked = false;

    // Клик по экрану — захват курсора
    container.addEventListener('click', () => {
        if (!isPointerLocked) container.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === container;
        container.style.cursor = isPointerLocked ? 'none' : 'grab';
    });

    // Движение мыши (вращение камеры)
    document.addEventListener('mousemove', (e) => {
        if (!isPointerLocked) return;
        const sensitivity = 0.002;
        yaw -= e.movementX * sensitivity;
        pitch -= e.movementY * sensitivity;
        pitch = Math.max(-1.5, Math.min(1.5, pitch)); // Ограничение взгляда вверх/вниз
        euler.set(pitch, yaw, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);
    });

    // Колёсико — полет вперед/назад
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1 : -1;
        const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        camera.position.addScaledVector(dir, delta * 0.8);
        if (camera.position.y < 0.5) camera.position.y = 0.5;
    }, { passive: false });

    // Touch управление для телефонов
    let isTouching = false, lastTouchX = 0, lastTouchY = 0;
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isTouching = true;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isTouching) {
            const dx = e.touches[0].clientX - lastTouchX;
            const dy = e.touches[0].clientY - lastTouchY;
            yaw -= dx * 0.005;
            pitch -= dy * 0.005;
            pitch = Math.max(-1.5, Math.min(1.5, pitch));
            euler.set(pitch, yaw, 0, 'YXZ');
            camera.quaternion.setFromEuler(euler);
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        }
    }, { passive: false });

    container.addEventListener('touchend', () => { isTouching = false; }, { passive: false });

    // Сброс камеры на дефолт
    function resetCamera() {
        camera.position.set(0, 5, 40);
        pitch = 0; yaw = 0;
        euler.set(0, 0, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);
    }

    return { resetCamera, getIsLocked: () => isPointerLocked };
}
