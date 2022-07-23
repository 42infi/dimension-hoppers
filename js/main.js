import {BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";
import {WorldObj} from "./entities/WorldObj";

const canvas = document.getElementById("gamecanvas");

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

const scene = new Scene();
const camera = new PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new WebGLRenderer({canvas: canvas});
renderer.setSize( window.innerWidth, window.innerHeight );


const geometry = new BoxGeometry( 1, 1, 1 );
const material = new MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

let lastTime = Date.now();

let obj1 = new WorldObj();
let obj2 = new WorldObj();


function animate() {

    let delta = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    requestAnimationFrame( animate );

    dispatchEvent(new CustomEvent('update', {detail: {delta: delta}}));



    renderer.render( scene, camera );
}
animate();