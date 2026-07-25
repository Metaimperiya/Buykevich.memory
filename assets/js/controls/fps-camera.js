export function initFPSCamera(camera) {
    const container = document.getElementById('canvas-container');
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    let pitch = 0, yaw = 0;
    let isPointerLocked = false;

    container.addEventListener('click', () => {
        if (!isPointerLocked) container.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === container;
        container.style.cursor = isPointerLocked ? 'none' : 'grab';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isPointerLocked) return;
        const sensitivity = 0.002;
        yaw -= e.movementX * sensitivity;
        pitch -= e.movementY * sensitivity;
        pitch = Math.max(-1.5, Math.min(1.5, pitch));
        euler.set(pitch, yaw, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);
    });

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1 : -1;
        const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        camera.position.addScaledVector(dir, delta * 0.8);
        if (camera.position.y < 0.5) camera.position.y = 0.5;
    }, { passive: false });
}
