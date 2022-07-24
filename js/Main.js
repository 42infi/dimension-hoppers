import initWorld from "./InitWorld";
import Player from "./entities/Player";
import {WEBGL} from "./WEBGL";


const [canvas, scene, camera, renderer, loaded] = initWorld();


let lastTime = Date.now();


const localPlayer = new Player(scene, camera, canvas);
camera.position.y += 10;


function animate() {

    requestAnimationFrame( animate );

    if(!loaded) return;

    let delta = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();


    dispatchEvent(new CustomEvent('update', {detail: {delta: delta}}));

    renderer.render( scene, camera );
}

if (WEBGL.isWebGLAvailable()) {

    animate();

} else {
    alert(WEBGL.getWebGLErrorMessage());
}

export {scene}