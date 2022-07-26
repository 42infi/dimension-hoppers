import {CapsuleGeometry, Color, Group, Mesh, MeshLambertMaterial, SphereGeometry} from "three";
import Entity from "./Entity";


export default class Player extends Entity {

    constructor(id, scene) {
        super();
        this.id = id;
        this.scene = scene;
        this.curDim = 1;
        const modelGroup = new Group();
        const body = new Mesh(new CapsuleGeometry(0.8, 1.8, 20, 20), new MeshLambertMaterial({color: '#00b219'}));
        body.name = `Body#${id}`;
        body.position.y = 1.5 / 2 + 0.8;
        this.head = new Mesh(new SphereGeometry(0.7, 64, 64), new MeshLambertMaterial({color: this.curDim === 1 ? new Color('#ff1454') : new Color('#ff9914')}));
        this.head.name = `Head#${id}`;
        this.head.position.y = 1.5 / 2 + 3;
        modelGroup.add(body, this.head);
        modelGroup.traverse(node => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        modelGroup.name = "Player";
        this.model = modelGroup;
        scene.add(this.model);
    }

    destructor() {
        this.scene.remove(this.model);
    }


}