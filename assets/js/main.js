document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация сцены из scene.js
    const app = window.initCoreScene(); 
    
    // 2. Инициализация кладбища из tombs.js
    if (window.initTombs) window.initTombs(app.scene);

    // 3. Инициализация небесной галактики сверху
    const galaxy = window.initGalaxy ? window.initGalaxy(app.scene) : null;

    // 4. Инициализация управления из fps-camera.js и keyboard.js
    if (window.initControls) window.initControls(app.camera, app.renderer.domElement);

    // Главный цикл
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.002;
        
        if (galaxy) galaxy.update(time);
        if (window.updateKeyboard) window.updateKeyboard(app.camera);

        app.renderer.render(app.scene, app.camera);
    }

    animate();
});
