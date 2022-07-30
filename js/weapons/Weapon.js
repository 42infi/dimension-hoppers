import {Raycaster} from "three";

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
                const split = intersects[i].object.name.split('#');
                switch (split[0]) {
                    case '':
                        return;
                    case 'Head':
                        return {part: 1, playerId: split[1]};
                    case 'Body':
                        return {part: 2, playerId: split[1]};
                }

            }
        }
    }

}