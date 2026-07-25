export function initKeyboard(camera) {
    const keys = { w: false, a: false, s: false, d: false, q: false, e: false, shift: false };
    const moveSpeed = 0.6;

    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'w') keys.w = true;
        if (key === 'a') keys.a = true;
        if (key === 's') keys.s = true;
        if (key === 'd') keys.d = true;
        if (key === 'q') keys.q = true;
        if (key === 'e') keys.e = true;
        if (key === 'shift') keys.shift = true;
    });

    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'w') keys.w = false;
        if (key === 'a') keys.a = false;
        if (key === 's') keys.s = false;
        if (key === 'd') keys.d = false;
        if (key === 'q') keys.q = false;
        if (key === 'e') keys.e = false;
        if (key === 'shift') keys.shift = false;
    });

    return function updateKeyboard() {
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
            if (camera.position.y < 0.5) camera.position.y = 0.5;
        }
    };
}
