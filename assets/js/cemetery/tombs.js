import * as THREE from 'three';

export class TombManager {
    constructor(scene) {
        this.scene = scene;
        this.stoneMat = new THREE.MeshStandardMaterial({ color: 0x2a2d32, roughness: 0.9 });
        this.marbleMat = new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.3, metalness: 0.5 });
        this.candleLightMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    }

    addCandle(group, x, z) {
        const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0xeeeedd }));
        candle.position.set(x, 0.2, z);
        const flame = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), this.candleLightMat);
        flame.position.set(x, 0.45, z);
        const light = new THREE.PointLight(0xffaa33, 1.5, 6);
        light.position.set(x, 0.5, z);
        group.add(candle, flame, light);
    }

    createTomb(x, z, name, dates) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        const base = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 3), this.stoneMat);
        base.position.y = 0.15;
        const stele = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 0.3), this.marbleMat);
        stele.position.set(0, 1.55, -1.1);
        group.add(base, stele);
        this.addCandle(group, 0.6, 0.8);
        group.userData = { name, dates, loc: '✦ ЗЕМЛЯ ✦' };
        this.scene.add(group);
        return group;
    }

    initDefaultTombs() {
        return [
            this.createTomb(-15, 5, 'Иван Смирнов', '1952 — 2015'),
            this.createTomb(0, 5, 'Анна Петрова', '1980 — 2021'),
            this.createTomb(15, 5, 'Семья Волковых', '1945 — 2018')
        ];
    }
}
