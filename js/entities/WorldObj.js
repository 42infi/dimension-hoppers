import {Vector3} from "three";

export default class WorldObj {

    constructor(position = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0)) {
        this.position = position;
        this.rotation = rotation;
        this.model = null;
        addEventListener('update', this.updateEvent);

    }


    updateEvent = e => this.update(e.detail);

    update(detail) {
        if (this.model != null) {
            this.model.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
            this.model.position.set(this.position.x, this.position.y, this.position.z);
        }
    }

    destructor = () => {
        removeEventListener('update', this.updateEvent);
    }


}