export function createCemetery(scene) {
    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.3, metalness: 0.8 });
    const candleLightMat = new THREE.MeshBasicMaterial({ color: 0xffa500 });

    function addCandle(group, x, z) {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 10), graniteMat);
        base.position.set(x, 0.6, z);
        const flame = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), candleLightMat);
        flame.position.set(x, 1.5, z);
        const light = new THREE.PointLight(0xffaa00, 1.5, 10);
        light.position.set(x, 1.8, z);
        group.add(base, flame, light);
    }

    function createClassicTomb(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        const base = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 5), graniteMat);
        base.position.y = 0.6;
        const stele = new THREE.Mesh(new THREE.BoxGeometry(6, 10, 1.2), graniteMat);
        stele.position.set(0, 6.2, -1.2);
        const photoFrame = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.2, 0.15, 24),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 })
        );
        photoFrame.rotation.x = Math.PI / 2;
        photoFrame.position.set(0, 8, -0.5);
        group.add(base, stele, photoFrame);
        addCandle(group, 2.5, 1.2);
        scene.add(group);
        group.userData = { name: 'Классический памятник', dates: '—', type: 'earth' };
        return group;
    }

    function createCrossTomb(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        const base = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 4), graniteMat);
        base.position.y = 0.75;
        const vBar = new THREE.Mesh(new THREE.BoxGeometry(1.5, 11, 1), graniteMat);
        vBar.position.set(0, 7, 0);
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 1), graniteMat);
        hBar.position.set(0, 9, 0);
        group.add(base, vBar, hBar);
        addCandle(group, -2, 1);
        scene.add(group);
        group.userData = { name: 'Крест', dates: '—', type: 'earth' };
        return group;
    }

    function createDoubleTomb(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        const base = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 5), graniteMat);
        base.position.y = 0.6;
        const stele = new THREE.Mesh(new THREE.BoxGeometry(12, 7, 1.2), graniteMat);
        stele.position.set(0, 4.7, -1.2);
        const frame1 = new THREE.Mesh(
            new THREE.CylinderGeometry(1.1, 1.1, 0.15, 24),
            new THREE.MeshStandardMaterial({ color: 0xdddddd })
        );
        frame1.rotation.x = Math.PI / 2;
        frame1.position.set(-3, 5.5, -0.5);
        const frame2 = frame1.clone();
        frame2.position.set(3, 5.5, -0.5);
        group.add(base, stele, frame1, frame2);
        addCandle(group, 0, 1.5);
        scene.add(group);
        group.userData = { name: 'Семейный памятник', dates: '—', type: 'earth' };
        return group;
    }

    function createMemoryWall(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        const wall = new THREE.Mesh(new THREE.BoxGeometry(30, 12, 1.5), graniteMat);
        wall.position.y = 6;
        for (let i = -12; i <= 12; i += 6) {
            const frame = new THREE.Mesh(
                new THREE.BoxGeometry(4, 4, 0.3),
                new THREE.MeshStandardMaterial({ color: 0x00f3ff, roughness: 0.2, metalness: 0.5 })
            );
            frame.position.set(i, 6, 1.0);
            group.add(frame);
        }
        group.add(wall);
        scene.add(group);
        group.userData = { name: 'Стена памяти', dates: '—', type: 'earth' };
        return group;
    }

    // РАССАДКА МОГИЛ
    const g1 = createClassicTomb(-20, 10);
    const g2 = createCrossTomb(0, 10);
    const g3 = createDoubleTomb(20, 10);
    const g6 = createMemoryWall(0, -35);
    
    console.log('🪦 Cemetery created');
    return [g1, g2, g3, g6];
}
