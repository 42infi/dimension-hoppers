import {BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";
import initWorld from "./InitWorld";
import Player from "./entities/Player";
import {PointerLockControls} from "./controllers/PointerLockControls";
import {WEBGL} from "./WEBGL";


const [canvas, scene, camera, renderer, loaded] = initWorld();


let lastTime = Date.now();
let pointerLocked = false;


const localPlayer = new Player(camera);
localPlayer.position.y = 10;

const mouseControls = new PointerLockControls(camera, canvas);

mouseControls.addEventListener( 'lock',  () => pointerLocked = true);
mouseControls.addEventListener( 'unlock',  () => pointerLocked = false);


function animate() {

    requestAnimationFrame( animate );

    if(!loaded) return;

    let delta = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();


    dispatchEvent(new CustomEvent('update', {detail: {delta: delta}}));


    renderer.render( scene, camera );
}

if (WEBGL.isWebGLAvailable()) {

    canvas.onclick = function () {
        if (!pointerLocked) {
            mouseControls.lock();
        }
    }

    animate();

} else {
    alert(WEBGL.getWebGLErrorMessage());
}

export {scene, mouseControls}