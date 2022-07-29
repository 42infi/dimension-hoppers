import {Raycaster, Vector2, Vector3} from "three";

export default class Weapon {

    constructor(camera, scene, playerController) {
        this.camera = camera;
        this.scene = scene;
        this.playerController = playerController;
        this.lastShootTime = Date.now();
        this.shotRaycaster = new Raycaster();
    }

    shoot() {

        if (Date.now() - this.lastShootTime > 50) {
            this.lastShootTime = Date.now();
            this.shotRaycaster.set(this.camera.position, this.playerController.mouseControls.getDirection().normalize());
            this.shotRaycaster.near = 0.1;
            this.shotRaycaster.far = 100;
            const intersects = this.shotRaycaster.intersectObjects(this.scene.children);

            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.material.wireframe) continue;

                switch (intersects[i].object.name) {
                    case '':
                        return;
                    case 'Head':
                        return "Head";
                    case 'Body':
                        return "Body";
                }

            }
        }
    }

}