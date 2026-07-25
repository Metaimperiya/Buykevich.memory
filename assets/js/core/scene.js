export function initScene() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    
    // Туман глубокого тёмного космоса
    scene.fog = new THREE.FogExp2(0x020208, 0.0025);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.set(0, 12, 45);
    camera.rotation.order = 'YXZ';

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x020208);
    
    if (container) {
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
    } else {
        document.body.appendChild(renderer.domElement);
    }

    // Свет
    const ambientLight = new THREE.AmbientLight(0x1a1a3a, 2.0);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x00f3ff, 1.8);
    moonLight.position.set(30, 80, 40);
    moonLight.castShadow = true;
    scene.add(moonLight);

    // 🖤 ЧЁРНЫЙ ГЛЯНЦЕВЫЙ ПОЛ И СЕТКА
    const groundGeo = new THREE.PlaneGeometry(500, 500);
    const groundMat = new THREE.MeshStandardMaterial({ 
        color: 0x030307, 
        roughness: 0.9, 
        metalness: 0.1 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(500, 80, 0x00f3ff, 0x081122);
    grid.position.y = -0.4;
    scene.add(grid);

    // 🌌 ВЕРХНИЕ СПИРАЛЬНЫЕ ГАЛАКТИКИ
    function createGalaxy(centerX, centerY, centerZ, radius, colorHex) {
        const particleCount = 6000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(particleCount * 3);
        const col = new Float32Array(particleCount * 3);
        const baseColor = new THREE.Color(colorHex);

        for (let i = 0; i < particleCount; i++) {
            const r = Math.pow(Math.random(), 2) * radius;
            const arms = 3;
            const theta = (i % arms) * ((2 * Math.PI) / arms) + r * 0.08;

            const x = centerX + Math.cos(theta) * r + (Math.random() - 0.5) * 8;
            const y = centerY + (Math.random() - 0.5) * (r * 0.2);
            const z = centerZ + Math.sin(theta) * r + (Math.random() - 0.5) * 8;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            col[i * 3] = baseColor.r + (Math.random() - 0.5) * 0.2;
            col[i * 3 + 1] = baseColor.g + (Math.random() - 0.5) * 0.2;
            col[i * 3 + 2] = baseColor.b + (Math.random() - 0.5) * 0.2;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 1.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });

        scene.add(new THREE.Points(geo, mat));
    }

    // Спавним 2 спиральные галактики под потолком
    createGalaxy(-60, 140, -100, 90, 0x00f3ff); // Голубая
    createGalaxy(70, 160, -120, 110, 0xaa00ff); // Фиолетовая

    // ✨ ФОНОВЫЕ ЗВЁЗДЫ
    const starsCount = 3000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 600;
        starPos[i * 3 + 1] = Math.random() * 200 + 30;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 600;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.7, color: 0xffffff, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(starGeo, starMat));

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { container, scene, camera, renderer };
}
