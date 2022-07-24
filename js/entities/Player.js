import Entity from "./Entity";
import {
    Box3,
    CylinderGeometry,
    Mesh,
    MeshLambertMaterial,
    Raycaster,
    Vector3
} from "three";
import PlayerController from "../controllers/PlayerController";


export default class Player extends Entity {

    constructor(scene, camera, canvas) {
        super();
        this.scene = scene;
        this.camera = camera;
        this.velocity = new Vector3();
        this.playerController = new PlayerController(this, camera, canvas);
        this.stopped = false;

        this.collider = new Mesh(new CylinderGeometry(1, 1, 2, 8, 1), new MeshLambertMaterial({color: 0xffff55}));
        this.collider.name = 'collider';
        this.collider.castShadow = true;
        this.collider.receiveShadow = true;

        scene.add(this.collider);

    }

    update(detail) {

        if (!this.camera) return;

        const delta = detail.delta;

        const groundRaycaster = new Raycaster();
        groundRaycaster.set(this.camera.position, new Vector3(0, -1, 0));
        groundRaycaster.far = 4.5;
        groundRaycaster.near = 4;
        const intersects = groundRaycaster.intersectObjects(this.scene.children);

        if (intersects[0] && intersects[0].object.name === 'collider') {
            this.onGround = !!intersects[1];
        } else {
            this.onGround = !!intersects[0];
        }

        let colVec = new Vector3();

        for (let i = 0; i < this.scene.children.length; i++) {

            const curObj = this.scene.children[i];

            if (curObj.name === 'collider' || curObj.name === 'plane') continue;

            let box = new Box3().setFromObject(curObj);

            let xc = Math.max(this.collider.position.x, Math.min(box.max.x, this.collider.position.x));
            let yc = Math.max(this.collider.position.y, Math.min(box.max.y, this.collider.position.y + 4))
            let zc = Math.max(this.collider.position.z, Math.min(box.max.z, this.collider.position.z))

            let x = Math.max(box.min.x, Math.min(xc, box.max.x));
            let y = Math.max(box.min.y, Math.min(yc, box.max.y));
            let z = Math.max(box.min.z, Math.min(zc, box.max.z));

            let relX = x - xc;
            let relY = y - yc;
            let relZ = z - zc;

            let distance = Math.sqrt(Math.pow(relX, 2) + Math.pow(relY, 2) + Math.pow(relZ, 2));

            if (distance < 0.7) {
                colVec = new Vector3(Math.sign(relX), Math.sign(relY), Math.sign(relZ))
            }

        }


        if (this.playerController.forward) {
            if (this.velocity.x < 12) {
                this.velocity.x += 12 * delta;
            }
        }

        if (this.playerController.backward) {
            if (this.velocity.x > -12) {
                this.velocity.x -= 12 * delta;
            }
        }

        if (this.playerController.right) {
            if (this.velocity.z < 12) {
                this.velocity.z += 12 * delta;
            }
        }

        if (this.playerController.left) {
            if (this.velocity.z > -12) {
                this.velocity.z -= 12 * delta;
            }
        }

        if (!this.playerController.forward && !this.playerController.backward) {

            if (this.velocity.x < 0) {
                this.velocity.x += 9 * delta;
                if (this.velocity.x > 0) this.velocity.x = 0;
            }

            if (this.velocity.x > 0) {
                this.velocity.x -= 9 * delta;
                if (this.velocity.x < 0) this.velocity.x = 0;
            }

        }

        if (!this.playerController.left && !this.playerController.right) {

            if (this.velocity.z < 0) {
                this.velocity.z += 9 * delta;
                if (this.velocity.z > 0) this.velocity.z = 0;
            }

            if (this.velocity.z > 0) {
                this.velocity.z -= 9 * delta;
                if (this.velocity.z < 0) this.velocity.z = 0;
            }

        }

        this.playerController.mouseControls.moveForward(this.velocity.x * delta, colVec);
        this.playerController.mouseControls.moveRight(this.velocity.z * delta, colVec);


        if (this.onGround) {

            if (!this.stopped) {
                this.velocity.y = 0;
                this.stopped = true;
            }

        } else {

            this.stopped = false;

            if (this.velocity.y > -80) {
                this.velocity.y -= 80 * delta;
            }

        }

        this.camera.position.y += this.velocity.y * delta;

        this.collider.position.set(this.camera.position.x, this.camera.position.y - 4, this.camera.position.z);


    }

    jump = () => {
        if (this.onGround) this.velocity.y += 30;
    }

}