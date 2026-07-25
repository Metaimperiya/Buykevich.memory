/**
 * Галактики-мемориалы
 * Парящие в небе сущности
 */

export function createGalaxy() {export function createGalaxy(scene) {
    const galaxyData = [
        { id: 0, name: 'Андрей', dates: '1970 — 2020', x: -30, y: 120, z: -20, color: '#ffdd88' },
        { id: 1, name: 'Людмила', dates: '1965 — 2019', x: -15, y: 130, z: 15, color: '#ff88aa' },
        { id: 2, name: 'Григорий', dates: '1958 — 2021', x: 20, y: 125, z: -25, color: '#88ddff' },
        { id: 3, name: 'Зоя', dates: '1943 — 2020', x: 35, y: 140, z: 10, color: '#ffaa88' },
        { id: 4, name: 'Николай', dates: '1930 — 2018', x: -25, y: 115, z: 30, color: '#88ffaa' },
        { id: 5, name: 'Татьяна', dates: '1940 — 2022', x: 25, y: 135, z: -35, color: '#aa88ff' },
        { id: 6, name: 'Борис', dates: '1950 — 2023', x: 0, y: 150, z: 0, color: '#ffdd44' },
        { id: 7, name: 'Елена', dates: '1945 — 2022', x: 0, y: 110, z: -40, color: '#ff88dd' },
    ];

    const galaxyN = 15000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPos = new Float32Array(galaxyN * 3);
    const galaxyBase = new Float32Array(galaxyN * 3);
    const galaxyCol = new Float32Array(galaxyN * 3);
    const galaxyFlags = new Uint8Array(galaxyN);

    const colGalaxy = new THREE.Color(0x334466);
    const colGalaxyGold = new THREE.Color(0xffdd88);
    const colGalaxyFlame = new THREE.Color(0xff6633);

    let galaxyIdx = 0;

    function addGalaxyParticle(x, y, z, color, flag) {
        if (galaxyIdx >= galaxyN) return;
        galaxyPos[galaxyIdx * 3] = x;
        galaxyPos[galaxyIdx * 3 + 1] = y;
        galaxyPos[galaxyIdx * 3 + 2] = z;
        galaxyBase[galaxyIdx * 3] = x;
        galaxyBase[galaxyIdx * 3 + 1] = y;
        galaxyBase[galaxyIdx * 3 + 2] = z;
        galaxyCol[galaxyIdx * 3] = color.r;
        galaxyCol[galaxyIdx * 3 + 1] = color.g;
        galaxyCol[galaxyIdx * 3 + 2] = color.b;
        galaxyFlags[galaxyIdx] = flag;
        galaxyIdx++;
    }

    function makeTexture(char, color = '#ffffff', size = 32) {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const ctx = c.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = `Bold ${size}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fillText(char, 32, 32);
        return new THREE.CanvasTexture(c);
    }

    galaxyData.forEach((grave) => {
        const gx = grave.x, gy = grave.y, gz = grave.z;
        const color = new THREE.Color(grave.color);

        for (let i = 0; i < 200; i++) {
            const w = 3 + Math.random() * 3, h = 4 + Math.random() * 4, d = 1.2 + Math.random() * 1.5;
            const x = gx + (Math.random() - 0.5) * w, z = gz + (Math.random() - 0.5) * d;
            const y = gy + (Math.random() - 0.5) * h + 0.5;
            const bright = 0.3 + Math.random() * 0.3;
            addGalaxyParticle(x, y, z, new THREE.Color(colGalaxy.r * bright, colGalaxy.g * bright, colGalaxy.b * bright), 1);
        }

        for (let i = 0; i < 80; i++) {
            const x = gx + (Math.random() - 0.5) * 2.5, z = gz + (Math.random() - 0.5) * 1.5;
            const y = gy + 2.5 + Math.random() * 3;
            const bright = 0.5 + Math.random() * 0.5;
            addGalaxyParticle(x, y, z, new THREE.Color(colGalaxyGold.r * bright, colGalaxyGold.g * bright, colGalaxyGold.b * bright), 2);
        }

        const nameChars = grave.name.split('');
        for (let ci = 0; ci < nameChars.length; ci++) {
            for (let j = 0; j < 15; j++) {
                const x = gx - nameChars.length * 0.7 + ci * 1.4 + (Math.random() - 0.5) * 0.5;
                const z = gz + 2.5 + (Math.random() - 0.5) * 0.4;
                const y = gy + 1.8 + Math.random() * 1;
                const bright = 0.6 + Math.random() * 0.4;
                addGalaxyParticle(x, y, z, new THREE.Color(color.r * bright, color.g * bright, color.b * bright), 3);
            }
        }

        for (let i = 0; i < 25; i++) {
            const a = Math.random() * Math.PI * 2, r = 2 + Math.random() * 2.5;
            const x = gx + Math.cos(a) * r, z = gz + Math.sin(a) * r;
            const y = gy - 0.5 + Math.random() * 0.5;
            const bright = 0.4 + Math.random() * 0.6;
            addGalaxyParticle(x, y, z, new THREE.Color(colGalaxyFlame.r * bright, colGalaxyFlame.g * bright * 0.6, colGalaxyFlame.b * bright * 0.3), 4);
        }

        for (let i = 0; i < 25; i++) {
            const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * 6;
            const x = gx + Math.cos(a) * r, z = gz + Math.sin(a) * r;
            const y = gy + (Math.random() - 0.5) * 5 + 2;
            const bright = 0.3 + Math.random() * 0.5;
            addGalaxyParticle(x, y, z, new THREE.Color(0.6 * bright, 0.8 * bright, 1 * bright), 5);
        }
    });

    for (let i = 0; i < 1500; i++) {
        const a = Math.random() * Math.PI * 2, r = 50 + Math.random() * 80;
        const x = Math.cos(a) * r, z = Math.sin(a) * r;
        const y = 100 + Math.random() * 50;
        const bright = 0.03 + Math.random() * 0.06;
        addGalaxyParticle(x, y, z, new THREE.Color(0.03 * bright, 0.05 * bright, 0.1 * bright), 6);
    }

    const galaxyPosFinal = galaxyPos.slice(0, galaxyIdx * 3);
    const galaxyBaseFinal = galaxyBase.slice(0, galaxyIdx * 3);
    const galaxyColFinal = galaxyCol.slice(0, galaxyIdx * 3);
    const galaxyFlagsFinal = galaxyFlags.slice(0, galaxyIdx);

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPosFinal, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColFinal, 3));

    const galaxyMat = new THREE.PointsMaterial({
        size: 2.0,
        map: makeTexture('✦', '#ffdd88', 32),
        transparent: true,
        opacity: 0.85,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
    });

    const galaxyCloud = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(galaxyCloud);

    console.log('🌌 Galaxy created');
    return { galaxyCloud, galaxyData, galaxyGeo, galaxyBaseFinal, galaxyFlagsFinal, galaxyIdx };
}
    // TODO: Создание галактик
    console.log('✅ Galaxy system created');
}
