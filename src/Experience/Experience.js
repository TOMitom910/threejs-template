import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
import Stats from 'stats.js';

export default class Experience
{
    constructor(canvas)
    {
        this.canvas = canvas;

        // Mode debug : ajoute #debug à la fin de l'URL (ex : http://localhost:5173/#debug)
        this.debug = window.location.hash === '#debug';

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: Math.min(window.devicePixelRatio, 2)
        };

        this.setDebug();
        this.setLoaders();
        this.setScene();
        this.setCamera();
        this.setRenderer();
        this.setControls();
        this.setLights();
        this.setObjects();
        this.setResize();

        this.timer = new THREE.Timer();
        this.tick();
    }

    setDebug()
    {
        if(!this.debug) return;

        this.gui = new GUI();

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
        document.body.appendChild(this.stats.dom);
    }

    setLoaders()
    {
        // Gestionnaire de chargement : utile pour une barre de progression
        this.loadingManager = new THREE.LoadingManager(
            () => { console.log('Tous les assets sont chargés'); },
            (url, loaded, total) => { /* progression : loaded / total */ },
            (url) => { console.error(`Erreur de chargement : ${url}`); }
        );

        this.textureLoader = new THREE.TextureLoader(this.loadingManager);
        this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager);
        this.hdrLoader = new HDRLoader(this.loadingManager);

        // Draco : les fichiers du décodeur sont dans static/draco/
        this.dracoLoader = new DRACOLoader(this.loadingManager);
        this.dracoLoader.setDecoderPath('/draco/');

        this.gltfLoader = new GLTFLoader(this.loadingManager);
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
    }

    setScene()
    {
        this.scene = new THREE.Scene();
    }

    setCamera()
    {
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(4, 3, 6);
        this.scene.add(this.camera);
    }

    setRenderer()
    {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
        this.renderer.setClearColor('#111111');
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setControls()
    {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
    }

    setLights()
    {
        this.ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight('#ffffff', 2);
        this.directionalLight.position.set(3, 4, 2);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);

        if(this.debug)
        {
            const folder = this.gui.addFolder('Lumières');
            folder.add(this.ambientLight, 'intensity').min(0).max(3).step(0.01).name('ambiante');
            folder.add(this.directionalLight, 'intensity').min(0).max(10).step(0.01).name('directionnelle');
        }
    }

    setObjects()
    {
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: '#4f8cff', roughness: 0.4 })
        );
        this.cube.castShadow = true;
        this.scene.add(this.cube);

        this.rotationSpeed = 0.5;

        // Petit exemple GSAP : le cube "pop" au double-clic
        this.canvas.addEventListener('dblclick', () => {
            gsap.fromTo(this.cube.scale, { x: 1.3, y: 1.3, z: 1.3 }, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });

        if(this.debug)
        {
            const folder = this.gui.addFolder('Cube');
            folder.addColor(this.cube.material, 'color').name('couleur');
            folder.add(this, 'rotationSpeed').min(0).max(5).step(0.01).name('vitesse');
            folder.add(this.cube.material, 'wireframe');
        }
    }

    setResize()
    {
        window.addEventListener('resize', () => {
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;
            this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(this.sizes.pixelRatio);
        });
    }

    tick()
    {
        if(this.stats) this.stats.begin();

        this.timer.update();
        const delta = this.timer.getDelta();

        this.cube.rotation.x += delta * this.rotationSpeed;
        this.cube.rotation.y += delta * this.rotationSpeed * 1.3;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        if(this.stats) this.stats.end();

        window.requestAnimationFrame(() => this.tick());
    }
}
