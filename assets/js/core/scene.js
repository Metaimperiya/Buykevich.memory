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
    
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x2a2a5a, 2.5);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x00f3ff, 2.0);
    moonLight.position.set(30, 80, 40);
    moonLight.castShadow = true;
    scene.add(moonLight);

    const fillLight = new THREE.DirectionalLight(0xaa44ff, 1.0);
    fillLight.position.set(-30, 40, -40);
    scene.add(fillLight);

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

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { container, scene, camera, renderer };
}
