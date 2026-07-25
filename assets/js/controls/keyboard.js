// Переменные для состояния клавиш
const keys = { w: false, a: false, s: false, d: false, q: false, e: false, shift: false };
const moveSpeed = 0.6;

// Слушаем нажатия
document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) keys[k] = true;
});

document.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) keys[k] = false;
});

// Функция для обновления позиции камеры в каждом кадре
export function updateKeyboard(camera) {
    const speed = keys.shift ? moveSpeed * 2 : moveSpeed;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const move = new THREE.Vector3();

    if (keys.w) move.add(forward.clone().multiplyScalar(speed));
    if (keys.s) move.add(forward.clone().multiplyScalar(-speed));
    if (keys.a) move.add(right.clone().multiplyScalar(-speed));
    if (keys.d) move.add(right.clone().multiplyScalar(speed));
    if (keys.q) move.y += speed * 0.8;
    if (keys.e) move.y -= speed * 0.8;

    if (move.length() > 0) {
        camera.position.add(move);
        if (camera.position.y < 0.5) camera.position.y = 0.5; // Защита от провала под землю
    }
}
