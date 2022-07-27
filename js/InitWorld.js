import {
    AmbientLight,
    BoxGeometry, CameraHelper,
    Color, DirectionalLight, Group,
    Mesh,
    MeshLambertMaterial, PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    WebGLRenderer
} from "three";

export default function initWorld() {

    let loaded = false;

    const canvas = document.getElementById("gamecanvas");

    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })

    const scene = new Scene();
    scene.background = new Color('#445d7a');

    const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setPixelRatio(1)
    renderer.outputEncoding = sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);


    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const directionalLight = new DirectionalLight('#ffffff', 1);
    directionalLight.position.set(30, 50, -10)
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.radius = 3;

    let side = 50

    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -side;
    directionalLight.shadow.camera.right = side;
    directionalLight.shadow.camera.top = side;
    directionalLight.shadow.camera.bottom = -side;
    directionalLight.shadow.bias = -0.001;
    directionalLight.shadow.radius = 3;

   /* let shadowHelper = new CameraHelper(directionalLight.shadow.camera);
    scene.add(shadowHelper);*/

    scene.add(directionalLight);

    const ambientLight = new AmbientLight('#ffffff', 0.7);
    scene.add(ambientLight)

    const dim1ObjColor = '#615198';
    const dim2ObjColor = '#9f19ff';

    let group1 = new Group();

    const plane = new Mesh(new BoxGeometry(50, 0.1, 50), new MeshLambertMaterial({color: '#5b5b5b'}));
    plane.name = "plane"
    plane.castShadow = true;
    plane.receiveShadow = true;
    group1.add(plane);

    const wall = new Mesh(new BoxGeometry(5, 10, 10), new MeshLambertMaterial({color: dim1ObjColor}));
    wall.name = "wall";
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.position.x = -11;
    wall.position.z = -2;
    group1.add(wall);

    const wall2 = new Mesh(new BoxGeometry(5, 16, 10), new MeshLambertMaterial({color: dim1ObjColor}));
    wall2.name = "wall";
    wall2.castShadow = true;
    wall2.receiveShadow = true;
    wall2.position.x = 8;
    wall2.position.y = 0;
    group1.add(wall2);

    scene.add(group1)



    let group2 = new Group();

    const plane2 = new Mesh(new BoxGeometry(50, 0.1, 50), new MeshLambertMaterial({color: '#5b5b5b'}));
    plane2.name = "plane"
    plane2.castShadow = true;
    plane2.receiveShadow = true;
    group2.add(plane2);

    const wall3 = new Mesh(new BoxGeometry(3, 10, 5), new MeshLambertMaterial({color: dim2ObjColor}));
    wall3.name = "wall";
    wall3.castShadow = true;
    wall3.receiveShadow = true;
    wall3.position.z = -15;
    group2.add(wall3);

    const wall4 = new Mesh(new BoxGeometry(10, 3, 4), new MeshLambertMaterial({color: dim2ObjColor}));
    wall4.name = "wall";
    wall4.castShadow = true;
    wall4.receiveShadow = true;
    wall4.position.z = 12;
    wall4.position.y = 0;
    group2.add(wall4);

    scene.add(group2)

    loaded = true;


    return [canvas, scene, camera, renderer, loaded, group1, group2, directionalLight];
}