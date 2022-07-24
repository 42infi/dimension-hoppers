import {Euler, EventDispatcher, Vector3} from 'three'

const _euler = new Euler(0, 0, 0, 'YXZ');
const _vector = new Vector3();

const _changeEvent = {type: 'change'};
const _lockEvent = {type: 'lock'};
const _unlockEvent = {type: 'unlock'};

const _PI_2 = Math.PI / 2;

class PointerLockControls extends EventDispatcher {

    constructor(player, camera, domElement) {

        super();

        if (domElement === undefined) {
            domElement = document.body;
        }

        this.domElement = domElement;
        this.isLocked = false;

        // Set to constrain the pitch of the camera
        // Range is 0 to Math.PI radians
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians

        const scope = this;

        function onMouseMove(event) {

            if (scope.isLocked === false) return;

            const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            //_euler.setFromQuaternion(camera.quaternion);

            _euler.y -= movementX * 0.002;
            _euler.x -= movementY * 0.002;

            _euler.x = Math.max(_PI_2 - scope.maxPolarAngle, Math.min(_PI_2 - scope.minPolarAngle, _euler.x));


            camera.quaternion.setFromEuler(_euler);

            scope.dispatchEvent(_changeEvent);

        }

        function onPointerlockChange() {

            if (scope.domElement.ownerDocument.pointerLockElement === scope.domElement) {

                scope.dispatchEvent(_lockEvent);

                scope.isLocked = true;

            } else {

                scope.dispatchEvent(_unlockEvent);

                scope.isLocked = false;

            }

        }

        function onPointerlockError() {

            // console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');

        }

        this.connect = function () {

            scope.domElement.ownerDocument.addEventListener('mousemove', onMouseMove);
            scope.domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange);
            scope.domElement.ownerDocument.addEventListener('pointerlockerror', onPointerlockError);

        };

        this.disconnect = function () {

            scope.domElement.ownerDocument.removeEventListener('mousemove', onMouseMove);
            scope.domElement.ownerDocument.removeEventListener('pointerlockchange', onPointerlockChange);
            scope.domElement.ownerDocument.removeEventListener('pointerlockerror', onPointerlockError);

        };

        this.dispose = function () {

            this.disconnect();

        };

        this.getObject = function () { // retaining this method for backward compatibility

            return camera;

        };


        this.getDirection = function () {
            return new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        };


        this.getEuler = function () {
            return _euler;
        };

        this.moveForward = function (distance, collisions) {

            // move forward parallel to the xz-plane
            // assumes camera.up is y-up

            _vector.setFromMatrixColumn(camera.matrix, 0);

            _vector.crossVectors(camera.up, _vector);

            camera.position.add(this.scaledCollision(_vector, distance, collisions));

        };

        this.moveRight = function (distance, collisions) {

            _vector.setFromMatrixColumn(camera.matrix, 0);

            camera.position.add(this.scaledCollision(_vector, distance, collisions));

        };

        //TODO: reset velocity on collide without breaking smth
        this.scaledCollision = (_vector, distance, collisions) => {
            let sv = new Vector3().addScaledVector(_vector, distance);

            if (collisions.x > 0 && sv.x > 0) {
                sv.x = 0;
                // player.velocity.x = 0;
            }
            if (collisions.x < 0 && sv.x < 0) {
                sv.x = 0;
                // player.velocity.x = 0;
            }

            if (collisions.z > 0 && sv.z > 0) {
                sv.z = 0;
                // player.velocity.z = 0;
            }
            if (collisions.z < 0 && sv.z < 0) {
                sv.z = 0;
                // player.velocity.z = 0;
            }

            return sv;
        }

        this.lock = function () {

            this.domElement.requestPointerLock();

        };

        this.unlock = function () {

            scope.domElement.ownerDocument.exitPointerLock();

        };

        this.connect();

    }

}

export {
    PointerLockControls
};