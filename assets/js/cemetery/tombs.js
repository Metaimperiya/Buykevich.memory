function createNoiseTexture() {
    if (typeof THREE === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    for (let x = 0; x < 128; x++) {
        for (let y = 0; y < 128; y++) {
            const val = Math.floor(Math.random() * 255);
            ctx.fillStyle = `rgb(${val},${val},${val})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    return new THREE.CanvasTexture(canvas);
}

export function initCemetery(scene) {
    if (typeof THREE === 'undefined') return { earthGroups: [] };

    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x0d0d14, roughness: 0.2, metalness: 0.8 });
    const candleLightMat = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const noiseTex = createNoiseTexture();

    const earthGroups = [];

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
        group.add(base, stele);
        addCandle(group, 2.5, 1.2);
        scene.add(group);
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
        return group;
    }

    function createDoubleTomb(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        const base = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 5), graniteMat);
        base.position.y = 0.6;
        const stele = new THREE.Mesh(new THREE.BoxGeometry(12, 7, 1.2), graniteMat);
        stele.position.set(0, 4.7, -1.2);
        group.add(base, stele);
        addCandle(group, 0, 1.5);
        scene.add(group);
        return group;
    }

    function createHoloTomb(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        const base = new THREE.Mesh(new THREE.BoxGeometry(7, 1.2, 4), graniteMat);
        base.position.y = 0.6;
        const holoGeo = new THREE.BoxGeometry(5, 9, 0.6);
        const holoMat = new THREE.MeshBasicMaterial({
            map: noiseTex, color: 0x00f3ff, transparent: true, opacity: 0.5
        });
        const holoStele = new THREE.Mesh(holoGeo, holoMat);
        holoStele.position.set(0, 5.5, 0);
        group.add(base, holoStele);
        scene.add(group);
        return group;
    }

    // 🏛️ ВОТ ОНА: МЕМОРИАЛЬНАЯ СТЕНА ПАМЯТИ
    function createMemoryWall(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const wallMat = new THREE.MeshStandardMaterial({ color: 0x080810, roughness: 0.4, metalness: 0.6 });
        const wall = new THREE.Mesh(new THREE.BoxGeometry(40, 14, 2), wallMat);
        wall.position.y = 7;

        // Неоновая рамка над стеной
        const borderMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
        const borderTop = new THREE.Mesh(new THREE.BoxGeometry(41, 0.4, 2.2), borderMat);
        borderTop.position.y = 14.2;

        // Ячейки памяти
        for (let i = -15; i <= 15; i += 6) {
            const frameMat = new THREE.MeshStandardMaterial({ color: 0x00f3ff, roughness: 0.2 });
            const frame = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.5, 0.4), frameMat);
            frame.position.set(i, 7, 1.1);
            group.add(frame);
        }

        group.add(wall, borderTop);
        scene.add(group);
        return group;
    }

    earthGroups.push(
        createClassicTomb(-20, 10),
        createCrossTomb(0, 10),
        createDoubleTomb(20, 10),
        createHoloTomb(-10, -15),
        createHoloTomb(10, -15),
        createMemoryWall(0, -35) // Спавним Стена Памяти сзади
    );

    return { earthGroups, candleLightMat };
}
