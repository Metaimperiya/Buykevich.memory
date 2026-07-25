export function initFpsCamera(container, camera) {
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    let pitch = 0, yaw = 0;
    let isPointerLocked = false;

    // Состояние клавиш
    const keys = {
        KeyW: false, KeyS: false, KeyA: false, KeyD: false,
        KeyQ: false, KeyE: false, ShiftLeft: false, ShiftRight: false
    };

    // Клик по экрану — захват мыши
    container.addEventListener('click', () => {
        if (!isPointerLocked) container.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === container;
        container.style.cursor = isPointerLocked ? 'none' : 'grab';
    });

    // Поворот мыши
    document.addEventListener('mousemove', (e) => {
        if (!isPointerLocked) return;
        const sensitivity = 0.002;
        yaw -= e.movementX * sensitivity;
        pitch -= e.movementY * sensitivity;
        pitch = Math.max(-1.5, Math.min(1.5, pitch));
        euler.set(pitch, yaw, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);
    });

    // Нажатия клавиш ходьбы
    window.addEventListener('keydown', (e) => {
        if (e.code in keys) keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.code in keys) keys[e.code] = false;
    });

    // Функция обновления позиции (вызывать каждый кадр)
    function update() {
        const speed = (keys.ShiftLeft || keys.ShiftRight) ? 0.6 : 0.25;

        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        forward.y = 0; // Ходим по земле
        forward.normalize();

        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        right.y = 0;
        right.normalize();

        if (keys.KeyW) camera.position.addScaledVector(forward, speed);
        if (keys.KeyS) camera.position.addScaledVector(forward, -speed);
        if (keys.KeyD) camera.position.addScaledVector(right, speed);
        if (keys.KeyA) camera.position.addScaledVector(right, -speed);
        if (keys.KeyQ) camera.position.y += speed * 0.5; // Вверх
        if (keys.KeyE) camera.position.y -= speed * 0.5; // Вниз

        // Ограничитель снизу, чтобы под землю не проваливался
        if (camera.position.y < 1.6) camera.position.y = 1.6;
    }

    function resetCamera() {
        camera.position.set(0, 5, 40);
        pitch = 0; yaw = 0;
        euler.set(0, 0, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);
    }

    return { update, resetCamera, getIsLocked: () => isPointerLocked };
}
