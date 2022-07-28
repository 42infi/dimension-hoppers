import initWorld from "./InitWorld";
import Player from "./entities/Player";
import {WEBGL} from "./WEBGL";


const [canvas, scene, camera, renderer, group1, group2, directionalLight, overlayCamera, overlayScene, state] = initWorld();

let lastTime = Date.now();

const localPlayer = new Player(group1, group2, scene, camera, canvas);
camera.position.y += 10;


function animate() {

    requestAnimationFrame(animate);

    let delta = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    if (!state.loaded) return;


    dispatchEvent(new CustomEvent('update', {detail: {delta: delta}}));

    state.weapon.rotation.x = (localPlayer.velocity.x) / 1000;
    state.weapon.position.x = 3 + (-(localPlayer.velocity.z) / 200);

    renderer.autoClear = true;
    renderer.render(scene, camera);

    renderer.autoClear = false;
    renderer.clearDepth()
    renderer.render(overlayScene, overlayCamera);

}

if (WEBGL.isWebGLAvailable()) {
    animate();
} else {
    alert(WEBGL.getWebGLErrorMessage());
}
