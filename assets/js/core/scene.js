export function initScene() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    
    scene.fog = new THREE.FogExp2(0x05050e, 0.003);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 12, 45);
    camera.rotation.order = 'YXZ';

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x05050e);
    
    if (container) {
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
    } else {
        document.body.appendChild(renderer.domElement);
    }

    // Свет
    const ambientLight = new THREE.AmbientLight(0x2a2a5a, 2.5);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x00f3ff, 2.0);
    moonLight.position.set(30, 80, 40);
    moonLight.castShadow = true;
    scene.add(moonLight);

    const fillLight = new THREE.DirectionalLight(0xaa44ff, 1.0);
    fillLight.position.set(-30, 40, -40);
    scene.add(fillLight);

    // Земля и сетка
    const groundGeo = new THREE.PlaneGeometry(300, 300);
    const groundMat = new THREE.MeshStandardMaterial({ 
        color: 0x121225, 
        roughness: 0.8, 
        metalness: 0.2 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(300, 60, 0x00f3ff, 0x112244);
    grid.position.y = -0.4;
    scene.add(grid);

    // 🌌 ГАЛАКТИКА И ЗВЁЗДЫ (ПАРТИКЛЫ СВЕРХУ)
    const starsCount = 4000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
        const x = (Math.random() - 0.5) * 400;
        const y = Math.random() * 120 + 10; // Выше земли
        const z = (Math.random() - 0.5) * 400;

        starPositions[i * 3] = x;
        starPositions[i * 3 + 1] = y;
        starPositions[i * 3 + 2] = z;

        // Неоново-голубые и фиолетовые оттенки
        starColors[i * 3] = Math.random() > 0.5 ? 0.0 : 0.7;
        starColors[i * 3 + 1] = 0.8;
        starColors[i * 3 + 2] = 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.85
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { container, scene, camera, renderer };
}
