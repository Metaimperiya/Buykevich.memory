window.initGalaxy = function(scene) {
    const galaxyN = 15000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPos = new Float32Array(galaxyN * 3);
    const galaxyBase = new Float32Array(galaxyN * 3);
    const galaxyCol = new Float32Array(galaxyN * 3);
    const galaxyFlags = new Uint8Array(galaxyN);

    let gIdx = 0;
    function addParticle(x, y, z, color, flag) {
        if (gIdx >= galaxyN) return;
        galaxyPos[gIdx * 3] = x;
        galaxyPos[gIdx * 3 + 1] = y;
        galaxyPos[gIdx * 3 + 2] = z;
        galaxyBase[gIdx * 3] = x;
        galaxyBase[gIdx * 3 + 1] = y;
        galaxyBase[gIdx * 3 + 2] = z;
        galaxyCol[gIdx * 3] = color.r;
        galaxyCol[gIdx * 3 + 1] = color.g;
        galaxyCol[gIdx * 3 + 2] = color.b;
        galaxyFlags[gIdx] = flag;
        gIdx++;
    }

    // Млечный путь над кладбищем (высота Y: 100 - 180)
    for (let i = 0; i < galaxyN; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 20 + Math.random() * 120;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const y = 100 + Math.random() * 80;
        const bright = 0.3 + Math.random() * 0.7;
        addParticle(x, y, z, new THREE.Color(0.2 * bright, 0.5 * bright, 0.9 * bright), 1);
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyCol, 3));

    const galaxyMat = new THREE.PointsMaterial({
        size: 1.8,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    const cloud = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(cloud);

    return {
        update: function(time) {
            const pos = galaxyGeo.attributes.position.array;
            for (let i = 0; i < gIdx; i++) {
                pos[i * 3 + 1] = galaxyBase[i * 3 + 1] + Math.sin(time + i) * 0.2;
            }
            galaxyGeo.attributes.position.needsUpdate = true;
        }
    };
};
