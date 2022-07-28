import {
    AmbientLight,
    BoxGeometry, CameraHelper,
    Color, DirectionalLight, Group,
    Mesh, MeshBasicMaterial,
    MeshLambertMaterial, PCFSoftShadowMap,
    PerspectiveCamera, PointLight,
    Scene,
    sRGBEncoding,
    WebGLRenderer
} from "three";
import {GLTFLoader} from "./GLTFLoader";

function addWall(x, y, z, width, height, depth, color, parent) {
    const wall = new Mesh(new BoxGeometry(width, height, depth), new MeshLambertMaterial({
        name: "wall",
        color: color,
        castShadow: true,
        receiveShadow: true
    }));
    wall.position.set(x, y + (height / 2) + 0.01, z);
    parent.add(wall);
}

export default function initWorld() {

    const modelLoader = new GLTFLoader();



    const canvas = document.getElementById("gamecanvas");

    const scene = new Scene();
    scene.background = new Color('#445d7a');

    const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setPixelRatio(1)
    renderer.outputEncoding = sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const overlayCamera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10);

    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        overlayCamera.aspect = window.innerWidth / window.innerHeight;
        overlayCamera.updateProjectionMatrix();
    })

    const overlayScene = new Scene();

    let state = {
        loaded: false,
        weapon: null
    }
    let weapon;
    modelLoader.load('../models/weapon/weapon.gltf', (model) => {

        const ambientLight = new AmbientLight('#ffffff', 0.1);
        overlayScene.add(ambientLight);

        const pointLight = new PointLight('#ffffff', 1, 1, 0);
        overlayScene.add(pointLight);

        state.weapon = model.scene;

        state.weapon.rotation.y = Math.PI/2
        state.weapon.position.x = 3;
        state.weapon.position.y = -6;

        overlayCamera.position.z = 4;

        overlayScene.add(state.weapon)
        state.loaded = true;
    });







    const directionalLight = new DirectionalLight('#ffffff', 1);
    directionalLight.position.set(30, 60, -15);
    directionalLight.lookAt(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;

    let side = 50

    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -side;
    directionalLight.shadow.camera.right = side;
    directionalLight.shadow.camera.top = side;
    directionalLight.shadow.camera.bottom = -side;
    directionalLight.shadow.radius = 3;

    /* let shadowHelper = new CameraHelper(directionalLight.shadow.camera);
     scene.add(shadowHelper);*/

    scene.add(directionalLight);

    const ambientLight = new AmbientLight('#ffffff', 0.7);
    scene.add(ambientLight)

    const dim1ObjColor = '#615198';
    const dim2ObjColor = '#9f19ff';

    let group1 = new Group();

    const plane = new Mesh(new BoxGeometry(50, 0.3, 50), new MeshLambertMaterial({color: '#5b5b5b'}));
    plane.position.y = -0.15;
    plane.name = "plane"
    plane.castShadow = true;
    plane.receiveShadow = true;
    group1.add(plane);

    // dim 1 side a
    addWall(12, 0, -2, 3, 5, 5, dim1ObjColor, group1);

    addWall(11, 0, 20, 1, 8, 5, dim1ObjColor, group1);
    addWall(9.5, 0, 15, 4, 3.5, 5, dim1ObjColor, group1);


    addWall(8, 0, -15, 1, 6, 5, dim1ObjColor, group1);
    addWall(5.5, 0, -17, 5, 6, 1, dim1ObjColor, group1);

    addWall(3, 0, 4, 1, 5, 4, dim1ObjColor, group1);


    // dim 1 side b
    addWall(-12, 0, 2, 3, 5, 5, dim1ObjColor, group1);

    addWall(-11, 0, -20, 1, 8, 5, dim1ObjColor, group1);
    addWall(-9.5, 0, -15, 4, 3.5, 5, dim1ObjColor, group1);


    addWall(-8, 0, 15, 1, 6, 5, dim1ObjColor, group1);
    addWall(-5.5, 0, 17, 5, 6, 1, dim1ObjColor, group1);

    addWall(-3, 0, -4, 1, 5, 4, dim1ObjColor, group1);


    scene.add(group1)


    let group2 = new Group();

    const plane2 = new Mesh(new BoxGeometry(50, 0.3, 50), new MeshLambertMaterial({color: '#5b5b5b'}));
    plane2.position.y = -0.15;
    plane2.name = "plane"
    plane2.castShadow = true;
    plane2.receiveShadow = true;
    group2.add(plane2);


    addWall(1, 0, -15, 3, 4, 4, dim2ObjColor, group2);

    addWall(5, 0, -5, 2, 5, 5, dim2ObjColor, group2);

    addWall(14, 0, -20, 2, 8, 3, dim2ObjColor, group2);

    addWall(13, 0, 10, 2, 3.5, 6, dim2ObjColor, group2);

    addWall(0, 0, 12, 10, 3, 4, dim2ObjColor, group2);


    addWall(-1, 0, 15, 3, 4, 4, dim2ObjColor, group2);

    addWall(-5, 0, 5, 2, 5, 5, dim2ObjColor, group2);

    addWall(-14, 0, 20, 2, 8, 3, dim2ObjColor, group2);

    addWall(-13, 0, -10, 2, 3.5, 6, dim2ObjColor, group2);

    addWall(0, 0, -12, 10, 3, 4, dim2ObjColor, group2);


    scene.add(group2)



    return [canvas, scene, camera, renderer, group1, group2, directionalLight, overlayCamera, overlayScene, state];
}