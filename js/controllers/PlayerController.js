import {Vector3} from "three";
import {PointerLockControls} from "./PointerLockControls";

export default class PlayerController {

    constructor(player, canvas) {

        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;


        window.addEventListener('keydown', ev => {

            switch (ev.key) {
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

    }

    inIdle = () => {
        return !this.forward && !this.backward && !this.left && !this.right;
    }

    static getMoveDir = (yaw) => {

        yaw -= Math.PI/2;

        let dX = -Math.cos(yaw);
        let dZ = Math.sin(yaw);

        return new Vector3(dX, 0, dZ);
    }


}