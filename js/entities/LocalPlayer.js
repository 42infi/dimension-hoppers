import Entity from "./Entity";
import {Box3, Color, Raycaster, Vector3} from "three";
import PlayerController from "../controllers/PlayerController";
import Weapon from "../weapons/Weapon";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class LocalPlayer extends Entity {

    constructor(dim1, dim2, scene, camera, canvas, socket, playerCount) {
        super();
        this.dim1 = dim1;
        this.dim2 = dim2;
        this.scene = scene;
        this.camera = camera;
        this.groundRaycaster = new Raycaster();
        this.socket = socket;
        this.velocity = new Vector3();
        this.stopped = false;
        this.playerController = new PlayerController(this, camera, canvas);
        this.weapon = new Weapon(camera, scene, this.playerController);
        this.spawns = [
            new Vector3(-19, 4, 2),
            new Vector3(19, 4, -2),
            new Vector3(-17, 4, -19),
            new Vector3(-19, 4, 21),
            new Vector3(16, 4, 20),
            new Vector3(20, 4, -20),
            new Vector3(6, 4, -19),
            new Vector3(6, 4, -19)
        ];
        const spawnVec = this.spawns[playerCount % 2];
        this.camera.position.set(spawnVec.x, spawnVec.y, spawnVec.z);
        this.canJump = true;
        this.lives = 10;
        this.respawnTime = Date.now();
    }

    update(detail) {

        if (!this.camera) return;

        const delta = detail.delta;

        this.dim1.traverse((e) => {
            if (e !== this.dim1) {
                e.material.wireframe = this.playerController.curDim !== 1;
                e.castShadow = !e.material.wireframe;
            }
        });

        this.dim2.traverse((e) => {
            if (e !== this.dim2) {
                e.material.wireframe = this.playerController.curDim !== 2;
                e.castShadow = !e.material.wireframe;
            }
        });

        this.scene.background = this.playerController.curDim === 1 ? new Color('#ff1454') : new Color('#ff9914');

        this.groundRaycaster.set(this.camera.position, new Vector3(0, -1, 0));
        this.groundRaycaster.far = 4;
        const intersects = this.groundRaycaster.intersectObjects(this[`dim${this.playerController.curDim}`].children);

        this.onGround = !!intersects[0];

        let colVec = new Vector3();

        for (let i = 0; i < this[`dim${this.playerController.curDim}`].children.length; i++) {

            const curObj = this[`dim${this.playerController.curDim}`].children[i];

            if (curObj.name === 'collider' || curObj.name === 'plane') continue;

            let box = new Box3().setFromObject(curObj, true);

            let xc = Math.max(this.camera.position.x, Math.min(box.max.x, this.camera.position.x));
            let yc = Math.max(this.camera.position.y - 4, Math.min(box.max.y, this.camera.position.y));
            let zc = Math.max(this.camera.position.z, Math.min(box.max.z, this.camera.position.z));

            let x = Math.max(box.min.x, Math.min(xc, box.max.x));
            let y = Math.max(box.min.y, Math.min(yc, box.max.y));
            let z = Math.max(box.min.z, Math.min(zc, box.max.z));

            let relX = x - xc;
            let relY = y - yc;
            let relZ = z - zc;

            let distance = Math.sqrt(Math.pow(relX, 2) + Math.pow(relY, 2) + Math.pow(relZ, 2));

            if (distance < 0.8) {
                colVec.add(new Vector3(Math.sign(relX), Math.sign(relY), Math.sign(relZ)));
            }

        }

        const speed = 300;
        const maxSpeed = 14;
        const slowdown = 100;

        if (this.playerController.forward) {
            if (this.velocity.x < maxSpeed) {
                this.velocity.x += speed * delta;
            }
        }

        if (this.playerController.backward) {
            if (this.velocity.x > -maxSpeed) {
                this.velocity.x -= speed * delta;
            }
        }

        if (this.playerController.right) {
            if (this.velocity.z < maxSpeed) {
                this.velocity.z += speed * delta;
            }
        }

        if (this.playerController.left) {
            if (this.velocity.z > -maxSpeed) {
                this.velocity.z -= speed * delta;
            }
        }


        if (this.velocity.x < 0) {
            this.velocity.x += slowdown * delta;
            if (this.velocity.x > 0) this.velocity.x = 0;
        }

        if (this.velocity.x > 0) {
            this.velocity.x -= slowdown * delta;
            if (this.velocity.x < 0) this.velocity.x = 0;
        }


        if (this.velocity.z < 0) {
            this.velocity.z += slowdown * delta;
            if (this.velocity.z > 0) this.velocity.z = 0;
        }

        if (this.velocity.z > 0) {
            this.velocity.z -= slowdown * delta;
            if (this.velocity.z < 0) this.velocity.z = 0;
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

        if (this.camera.position.y < -10) {
            this.camera.position.x = 0;
            this.camera.position.y = 15;
            this.camera.position.z = 0;
        }

        if (this.playerController.mouseLeft) {
            const result = this.weapon.shoot();
            if (result) {
                this.socket.send(JSON.stringify(Object.assign({type: "hit"}, result)));
            }
        }

    }

    jump = () => {
        if (this.onGround && this.canJump) this.velocity.y += 27;
    }

    respawn = () => {
        const vec = this.spawns[getRandomInt(0, this.spawns.length - 1)];
        this.camera.position.set(vec.x, vec.y, vec.z);
        this.health = 100;
        this.lives--;
        if (this.lives <= 0) {
            this.socket.close();
            alert("you died (you can rejoin)");
            window.location.href = window.location.origin;
        }
        this.respawnTime = Date.now();
    }

    spawnProtected = () => Date.now() - this.respawnTime < 1200;

}