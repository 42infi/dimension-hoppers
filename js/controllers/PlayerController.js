import {PointerLockControls} from "./PointerLockControls";

export default class PlayerController {

    constructor(player, camera, canvas) {

        this.player = player;
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;

        this.mouseLeft = false;

        this.curDim = 1;

        this.mouseControls = new PointerLockControls(player, camera, canvas);

        canvas.onclick = () => {
            canvas.requestPointerLock();
        }

        window.addEventListener('keydown', ev => {

            switch (ev.key) {
                case ' ':
                    player.jump();
                    player.canJump = false;
                    break;
                case 'w':
                    this.forward = true;
                    break;
                case 's':
                    this.backward = true;
                    break;
                case 'a':
                    this.left = true;
                    break;
                case 'd':
                    this.right = true;
            }

        });

        window.addEventListener('keyup', ev => {

            switch (ev.key) {
                case ' ':
                    player.canJump = true;
                    break;
                case 'w':
                    this.forward = false;
                    break;
                case 's':
                    this.backward = false;
                    break;
                case 'a':
                    this.left = false;
                    break;
                case 'd':
                    this.right = false;
            }

        });

        window.addEventListener('keypress', ev => {
            switch (ev.key) {
                case 'q':
                    this.curDim = 1;
                    this.player.socket.send(JSON.stringify({type: "dimSwap", dim: 1}));
                    break;
                case 'e':
                    this.curDim = 2;
                    this.player.socket.send(JSON.stringify({type: "dimSwap", dim: 2}));
            }
        });

        canvas.addEventListener('mousedown', (ev) => {
            if (ev.button === 0) this.mouseLeft = true;
        });

        canvas.addEventListener('mouseup', (ev) => {
            if (ev.button === 0) this.mouseLeft = false;
        });

    }


}