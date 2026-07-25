import { SceneInit } from './core/scene.js';
import { FPSCamera } from './controls/fps-camera.js';
import { KeyboardControls } from './controls/keyboard.js';
import { TombManager } from './cemetery/tombs.js';
import { GalaxySystem } from './galaxy/galaxy-system.js';

class App {
    constructor() {
        this.core = new SceneInit();
        this.fpsCamera = new FPSCamera(this.core.camera, this.core.renderer.domElement);
        this.keyboard = new KeyboardControls(this.core.camera);
        
        this.tombs = new TombManager(this.core.scene);
        this.tombs.initDefaultTombs();

        this.galaxy = new GalaxySystem(this.core.scene);

        this.setupUI();
        this.animate();
    }

    setupUI() {
        document.getElementById('btnFlyUp')?.addEventListener('click', () => {
            this.core.camera.position.set(0, 130, 50);
        });
        document.getElementById('btnFlyDown')?.addEventListener('click', () => {
            this.core.camera.position.set(0, 3, 30);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.002;
        this.keyboard.update();
        this.galaxy.update(time);

        this.core.renderer.render(this.core.scene, this.core.camera);
    }
}

new App();
