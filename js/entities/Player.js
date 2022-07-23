import Entity from "./Entity";
import {Raycaster, Vector3} from "three";
import {scene, mouseControls} from "../Main";
import PlayerController from "../controllers/PlayerController";


export default class Player extends Entity {

    constructor(camera) {
        super();
        this.camera = camera;
        this.velocity = new Vector3();
        this.moveDir = new Vector3();
        this.playerController = new PlayerController(this);

    }

    update(detail) {

        if (!this.camera) return;

        const delta = detail.delta;

        const groundRaycaster = new Raycaster();
        groundRaycaster.set(this.position, new Vector3(0, -1, 0));
        groundRaycaster.near = 4;
        const gintersects = groundRaycaster.intersectObjects(scene.children);

        this.onGround = !gintersects[0];

        if (!this.onGround) this.position.y -= 30 * delta;

        this.moveDir = new Vector3();


        let loweringRate = 0.005;

        if (this.playerController.inIdle()) {
            if (this.velocity.x > 0) {
                this.velocity.x -= loweringRate * delta;
                if (this.velocity.x < 0) this.velocity.x = 0;
            }
            if (this.velocity.z > 0) {
                this.velocity.z -= loweringRate * delta;
                if (this.velocity.z < 0) this.velocity.z = 0;
            }

            if (this.velocity.x < 0) {
                this.velocity.x += loweringRate * delta;
                if (this.velocity.x > 0) this.velocity.x = 0;
            }
            if (this.velocity.z < 0) {
                this.velocity.z += loweringRate * delta;
                if (this.velocity.z > 0) this.velocity.z = 0;
            }
        } else {
            if (this.velocity.x < 0.1) this.velocity.x += 0.01;
            if (this.velocity.z < 0.1) this.velocity.z += 0.01;
        }

        if(this.playerController.forward){
            this.moveDir.add(PlayerController.getMoveDir(mouseControls.getEuler().y)).normalize()
        }

        if(this.playerController.backward){
            this.moveDir.add(PlayerController.getMoveDir(mouseControls.getEuler().y - Math.PI)).normalize()
        }

        if(this.playerController.left){
            this.moveDir.add(PlayerController.getMoveDir(mouseControls.getEuler().y + Math.PI/2)).normalize()
        }

        if(this.playerController.right){
            this.moveDir.add(PlayerController.getMoveDir(mouseControls.getEuler().y - Math.PI/2)).normalize()
        }

        this.position.x += this.velocity.x * this.moveDir.x;
        this.position.z += this.velocity.z * this.moveDir.z;

        this.camera.position.set(this.position.x, this.position.y, this.position.z);


    }


}