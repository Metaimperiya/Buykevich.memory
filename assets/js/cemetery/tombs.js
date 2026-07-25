import * as THREE from 'three';

export class KeyboardControls {
    constructor(camera) {
        this.camera = camera;
        this.keys = { w: false, a: false, s: false, d: false, q: false, e: false, shift: false };
        
        window.addEventListener('keydown', (e) => this.onKey(e, true));
        window.addEventListener('keyup', (e) => this.onKey(e, false));
    }

    onKey(e, state) {
        const key = e.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = state;
        }
    }

    update() {
        const speed = this.keys.shift ? 1.5 : 0.5;
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);

        if (this.keys.w) this.camera.position.addScaledVector(forward, speed);
        if (this.keys.s) this.camera.position.addScaledVector(forward, -speed);
        if (this.keys.a) this.camera.position.addScaledVector(right, -speed);
        if (this.keys.d) this.camera.position.addScaledVector(right, speed);
        if (this.keys.e) this.camera.position.y += speed; // Взлет в небо
        if (this.keys.q) this.camera.position.y -= speed; // Спуск
        
        if (this.camera.position.y < 0.5) this.camera.position.y = 0.5;
    }
}
