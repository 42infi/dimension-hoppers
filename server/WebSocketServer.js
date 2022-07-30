const WebSocketServer = require('ws');

let port = 8866;

let sessionIds = [];
let playerIds = [];


class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Player {
    constructor(id, position, rotation) {
        this.id = id;
        this.position = position;
        this.rotation = rotation;
        this.dim = 1;
    }
}

// [[sessionId, connection, player], ...]
let playerList = [];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPlayerFromWs(ws) {
    for (let entry of playerList) {
        if (entry[1] === ws) {
            return entry;
        }
    }
    return null;
}

function getPlayerFromSessionId(id) {
    for (let entry of playerList) {
        if (entry[0] === id) {
            return entry;
        }
    }
    return null;
}

function getPlayerFromPlayerId(id) {
    for (let entry of playerList) {
        if (entry[2].id === id) {
            return entry;
        }
    }
    return null;
}

function generatePlayerID() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id;

    do {
        id = ""
        for (let i = 0; i < 8; i++) {
            id += chars.charAt(getRandomInt(0, 61))
        }
    } while (playerIds.includes(id))

    return id
}

function generateSessionId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id;

    do {
        id = ""
        for (let i = 0; i < 16; i++) {
            id += chars.charAt(getRandomInt(0, 61))
        }
    } while (sessionIds.includes(id))

    sessionIds.push(id);

    return id;
}


// broadcast players at 60 ticks
setInterval(() => {


    for (let i = 0; i < playerList.length; i++) {
        let entry = playerList[i];
        for (let j = 0; j < playerList.length; j++) {
            let player = playerList[j][2];
            if (entry[1] && player !== entry[2]) {
                entry[1].send(JSON.stringify({type: "player", player: player}));
            }
        }
    }


}, 16.67)


const wss = new WebSocketServer.Server({port: port})

wss.on("connection", ws => {

    if (playerList.length >= 4) {
        ws.send("room full");
        ws.close();
        return;
    }

    let sessionId = generateSessionId();
    let playerID = generatePlayerID();

    const newPlayer = new Player(playerID, new Vector3(Math.floor(Math.random() * 10), 0, 0), new Vector3());

    playerList.push([sessionId, ws, newPlayer]);
    ws.send(JSON.stringify({type: "sessionId", sessionId: sessionId, playerId: playerID}));

    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i][1]) playerList[i][1].send(JSON.stringify({type: "join", player: newPlayer}));
    }

    console.log(`new client connected, sessionId: ${sessionId}, playerId: ${playerID}`);

    //process incoming json data
    ws.on("message", data => {
        data = JSON.parse(data);

        if (data.type === "pong") {
            let ping = Date.now() - data.time;
        }

        if (data.type === 'init') {
            let tempList = [];
            for (let i = 0; i < playerList.length; i++) {
                tempList.push(playerList[i][2]);
            }
            ws.send(JSON.stringify({type: "load", list: tempList}));
        }

        if (data.type === 'player') {
            if (data.sessionId) {
                let player = getPlayerFromSessionId(data.sessionId)[2];
                player.position = data.position;
                player.rotation.y = data.rotation.y;
            }
        }

        if (data.type === 'hit') {

            const rs = getPlayerFromPlayerId(data.playerId);
            if (rs) rs[1].send(JSON.stringify({type: "damage", damage: data.part === 1 ? 5 : 3}));

        }

        if (data.type === 'dimSwap') {
            getPlayerFromWs(ws)[2].dim = data.dim;
        }

    });

    ws.on("close", () => {
        let discPlayer = getPlayerFromWs(ws);
        if (discPlayer) {
            for (let i = 0; i < playerList.length; i++) {
                if (playerList[i][1]) playerList[i][1].send(JSON.stringify({type: "leave", player: discPlayer[2]}));
            }
            playerList.splice(playerList.indexOf(discPlayer), 1);
        }
        console.log("a client has disconnected", discPlayer[2]);
    });

    ws.onerror = function () {
        console.log("some error occurred")
    }

});
console.log("the webSocket server is running on port " + port);