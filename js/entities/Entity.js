import WorldObj from "./WorldObj";

export default class Entity extends WorldObj {

    constructor(health = 100) {
        super();
        this.health = health;
        this.onGround = false;
    }

}