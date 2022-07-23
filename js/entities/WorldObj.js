import {Vector3} from "three";

export class WorldObj {

    constructor(position = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0)) {
        this.postion = position;
        this.rotation = rotation;

        addEventListener('update', this.update);

    }


    update = (e) => {
        console.log("update ev", e.detail);
    }

    destructor = () => {
        removeEventListener('update', this.update);
    }

}