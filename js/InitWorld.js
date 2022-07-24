import {
    AmbientLight,
    BoxGeometry,
    Color, DirectionalLight,
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

    const renderer = new WebGLRenderer({canvas: canvas});
    renderer.setPixelRatio(4);
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

    /*let shadowHelper = new CameraHelper(directionalLight.shadow.camera);
    scene.add(shadowHelper);*/

    scene.add(directionalLight);

    const ambientLight = new AmbientLight('#ffffff', 0.7);
    scene.add(ambientLight)


    const plane = new Mesh(new BoxGeometry(50, 0.1, 50), new MeshLambertMaterial({color: '#5b5b5b'}));
    plane.name = "plane"
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);


    const wall = new Mesh(new BoxGeometry(5, 10, 10), new MeshLambertMaterial({color: 0xffff55}));
    wall.name = "wall";
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.position.x = -10;
    scene.add(wall);

    const wall2 = new Mesh(new BoxGeometry(5, 0.5, 10), new MeshLambertMaterial({color: 0xffff55}));
    wall2.name = "wall";
    wall2.castShadow = true;
    wall2.receiveShadow = true;
    wall2.position.x = 10;
    wall2.position.y = 3;
    scene.add(wall2);


    loaded = true;

    return [canvas, scene, camera, renderer, loaded];
}