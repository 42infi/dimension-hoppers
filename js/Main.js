import initWorld from "./InitWorld";
import LocalPlayer from "./entities/LocalPlayer";
import {WEBGL} from "./WEBGL";
import Player from "./entities/Player";
import {Color} from "three";

let initialized = false;
let lastTime = Date.now();
let healthElem;
let serverIp = 'localhost:8866';

const [canvas, scene, camera, renderer, group1, group2, overlayCamera, overlayScene, state] = initWorld();

let localPlayer;
camera.position.y += 10;

function animate() {

    requestAnimationFrame(animate);

    let delta = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    if (!state.loaded || delta > 0.1) return;

    if (!initialized) {

        connect();
        healthElem = document.getElementById('healthVal');

        initialized = true;
    }

    if (!connected) return;

    dispatchEvent(new CustomEvent('update', {detail: {delta: delta}}));

    state.weapon.rotation.x = localPlayer.velocity.x / 1000;
    state.weapon.position.x = 3 + (-(localPlayer.velocity.z) / 200);

    renderer.autoClear = true;
    renderer.render(scene, camera);

    renderer.autoClear = false;
    renderer.clearDepth()
    renderer.render(overlayScene, overlayCamera);

}

if (WEBGL.isWebGLAvailable()) {

    const params = new URLSearchParams(window.location.search);
    serverIp = params.get('ip');
    console.log(serverIp)

    animate();

} else {
    alert(WEBGL.getWebGLErrorMessage());
}


let playerList = [];

//current session id of the client
let sessionId;
let playerId;
let color;

//websocket networking
let socket;
let connected = false;

function connect() {
    socket = new WebSocket(`ws://${serverIp}/`);

    function getPlayerById(id) {
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].id === id) return playerList[i];
        }
        return null;
    }

    socket.onopen = function (e) {
        console.log("[open] Connection established");
    };

    //process incoming packets from the server
    socket.onmessage = function (event) {

        if (event.data === "room full") {
            alert("room full");
            socket.close();
            return;
        }

        const incomingJson = JSON.parse(event.data)
        const type = incomingJson.type


        if (type === "sessionId") {
            sessionId = incomingJson.sessionId;
            playerId = incomingJson.playerId;
            color = incomingJson.color;
            console.log(`sessionId: ${sessionId}, playerId: ${playerId}`)
            socket.send(JSON.stringify({type: "init"}));
        }

        if (type === "load") {

            incomingJson.list.forEach((e) => {
                //Only add other players to client sided playerlist
                if (e.id !== playerId) {
                    playerList.push(new Player(e.id, scene));
                }
            })

            console.log("load", playerList)

            localPlayer = new LocalPlayer(group1, group2, scene, camera, canvas, socket, playerList.length);
            localPlayer.health = 100;
            healthElem.innerText = localPlayer.health;

            setInterval(() => {

                let packet = {
                    type: "player",
                    sessionId: sessionId,
                    position: {x: camera.position.x, y: camera.position.y - 4, z: camera.position.z},
                    rotation: {x: camera.rotation.x, y: camera.rotation.y},
                };

                socket.send(JSON.stringify(packet));

            }, 16.67);

            connected = true;
        }

        if (!connected) return;

        if (type === "join") {
            if (incomingJson.player.id === playerId) return;
            playerList.push(new Player(incomingJson.player.id, scene));
        }

        if (type === "leave") {
            if (incomingJson.player.id === playerId) return;
            let player = getPlayerById(incomingJson.player.id);
            if (player) player.destructor();
        }

        if (type === 'player') {

            if (incomingJson.player.id === playerId) return;
            let player = getPlayerById(incomingJson.player.id);

            if (player) {
                let updatedPlayer = incomingJson.player;

                player.position.set(updatedPlayer.position.x, updatedPlayer.position.y, updatedPlayer.position.z);
                player.rotation.y = updatedPlayer.rotation.y;
                player.head.material.color = updatedPlayer.dim === 1 ? new Color('#ff1454') : new Color('#ff9914')

            }
        }

        if (type === 'damage') {
            localPlayer.health -= incomingJson.damage;
            if (localPlayer.health <= 0) localPlayer.respawn();
            healthElem.innerText = localPlayer.health;
        }

    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('[close] Connection died');
        }
    };

    socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
    };

}
