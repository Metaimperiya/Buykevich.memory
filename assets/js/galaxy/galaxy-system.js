import * as THREE from 'three';

export class GalaxySystem {
    constructor(scene) {
        this.scene = scene;
        this.galaxyN = 15000;
        this.galaxyIdx = 0;
        this.galaxyData = [
            { name: 'Андрей', dates: '1970 — 2020', x: -30, y: 120, z: -20, color: '#ffdd88' },
            { name: 'Людмила', dates: '1965 — 2019', x: -15, y: 130, z: 15, color: '#ff88aa' },
            { name: 'Григорий', dates: '1958 — 2021', x: 20, y: 125, z: -25, color: '#88ddff' },
            { name: 'Зоя', dates: '1943 — 2020', x: 35, y: 140, z: 10, color: '#ffaa88' },
            { name: 'Елена', dates: '1945 — 2022', x: 0, y: 110, z: -40, color: '#ff88dd' }
        ];

        this.init();
    }

    makeTexture(text, color, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = `${size * 0.7}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, size / 2, size / 2);
        return new THREE.CanvasTexture(canvas);
    }

    init() {
        this.galaxyGeo = new THREE.BufferGeometry();
        this.galaxyPos = new Float32Array(this.galaxyN * 3);
        this.galaxyBase = new Float32Array(this.galaxyN * 3);
        this.galaxyCol = new Float32Array(this.galaxyN * 3);
        this.galaxyFlags = new Uint8Array(this.galaxyN);

        // Души в небе
        this.galaxyData.forEach((grave) => {
            const gx = grave.x, gy = grave.y, gz = grave.z;
            const color = new THREE.Color(grave.color);

            for (let i = 0; i < 300; i++) {
                const x = gx + (Math.random() - 0.5) * 6;
                const z = gz + (Math.random() - 0.5) * 6;
                const y = gy + (Math.random() - 0.5) * 6;
                this.addParticle(x, y, z, color, 1);
            }
        });

        // Млечный путь
        for (let i = 0; i < 10000; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = 40 + Math.random() * 100;
            const x = Math.cos(a) * r;
            const z = Math.sin(a) * r;
            const y = 80 + Math.random() * 90;
            const bright = 0.2 + Math.random() * 0.8;
            this.addParticle(x, y, z, new THREE.Color(0.2 * bright, 0.4 * bright, 0.8 * bright), 0);
        }

        this.galaxyGeo.setAttribute('position', new THREE.BufferAttribute(this.galaxyPos.slice(0, this.galaxyIdx * 3), 3));
        this.galaxyGeo.setAttribute('color', new THREE.BufferAttribute(this.galaxyCol.slice(0, this.galaxyIdx * 3), 3));

        const galaxyMat = new THREE.PointsMaterial({
            size: 1.8,
            map: this.makeTexture('✦', '#ffffff', 32),
            transparent: true,
            opacity: 0.85,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.galaxyCloud = new THREE.Points(this.galaxyGeo, galaxyMat);
        this.scene.add(this.galaxyCloud);
    }

    addParticle(x, y, z, color, flag) {
        if (this.galaxyIdx >= this.galaxyN) return;
        this.galaxyPos[this.galaxyIdx * 3] = x;
        this.galaxyPos[this.galaxyIdx * 3 + 1] = y;
        this.galaxyPos[this.galaxyIdx * 3 + 2] = z;
        this.galaxyBase[this.galaxyIdx * 3] = x;
        this.galaxyBase[this.galaxyIdx * 3 + 1] = y;
        this.galaxyBase[this.galaxyIdx * 3 + 2] = z;
        this.galaxyCol[this.galaxyIdx * 3] = color.r;
        this.galaxyCol[this.galaxyIdx * 3 + 1] = color.g;
        this.galaxyCol[this.galaxyIdx * 3 + 2] = color.b;
        this.galaxyFlags[this.galaxyIdx] = flag;
        this.galaxyIdx++;
    }

    update(time) {
        if (!this.galaxyCloud.visible) return;
        const pos = this.galaxyGeo.attributes.position.array;
        for (let i = 0; i < this.galaxyIdx; i++) {
            if (this.galaxyFlags[i] === 1) {
                pos[i * 3 + 1] = this.galaxyBase[i * 3 + 1] + Math.sin(time + i) * 0.2;
            }
        }
        this.galaxyGeo.attributes.position.needsUpdate = true;
    }
}
