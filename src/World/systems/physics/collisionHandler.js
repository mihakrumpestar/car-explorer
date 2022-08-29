
let cbContactResult, cbContactPairResult;

class collisionHandler {
    constructor(world) {
        setupContactResultCallback();
        setupContactPairResultCallback();

        this.world = world;
        this.list = new Map();
    }

    push(object1, object2) {
        const uuid = object1.uuid+object2.uuid;
        const value = {
            object1: object1,
            object2: object2,
        }
        this.list.set(uuid, value);
    }

    tick() {
        this.list.forEach((value, uuid) => {
            (async () => {
                let doDelete = checkContactPair(this.world, value.object1, value.object2);
                if (doDelete) this.list.delete(uuid);
            })();
        });
    }
}


export { collisionHandler };


function setupContactResultCallback(){
    cbContactResult = new Ammo.ConcreteContactResultCallback();
    
    cbContactResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){
        
        let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );

        const distance = contactPoint.getDistance();

        if( distance > 0 ) return;

        let colWrapper0 = Ammo.wrapPointer( colObj0Wrap, Ammo.btCollisionObjectWrapper );
        let rb0 = Ammo.castObject( colWrapper0.getCollisionObject(), Ammo.btRigidBody );
        
        let colWrapper1 = Ammo.wrapPointer( colObj1Wrap, Ammo.btCollisionObjectWrapper );
        let rb1 = Ammo.castObject( colWrapper1.getCollisionObject(), Ammo.btRigidBody );

        let threeObject0 = rb0.threeObject;
        let threeObject1 = rb1.threeObject;

        let tag, localPos, worldPos

        if( threeObject0.userData.tag != "ball" ){

            tag = threeObject0.userData.tag;
            localPos = contactPoint.get_m_localPointA();
            worldPos = contactPoint.get_m_positionWorldOnA();

        }
        else{

            tag = threeObject1.userData.tag;
            localPos = contactPoint.get_m_localPointB();
            worldPos = contactPoint.get_m_positionWorldOnB();

        }
        
        let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
        let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

        console.log( { tag, localPosDisplay, worldPosDisplay } ); 
    }
}


function setupContactPairResultCallback(){
    cbContactPairResult = new Ammo.ConcreteContactResultCallback();
    cbContactPairResult.hasContact = false;

    cbContactPairResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){
        let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );
        const distance = contactPoint.getDistance();

        if( distance > 0 ) return;
        this.hasContact = true;
    }
}

function checkContact(physicsWorld, body){
    physicsWorld.contactTest(body, cbContactResult );
}


function checkContactPair(world, object1, object2){
    cbContactPairResult.hasContact = false;

    world.physicsWorld.contactPairTest(object1.body, object2.body, cbContactPairResult);

    if ( !cbContactPairResult.hasContact ) return;

    console.log("Collision detected");

    let doDelete1;
    let doDelete2;

    if (typeof object1.onContact == 'function') doDelete1 = object1.onContact(world, object2.objectType);
    if (typeof object2.onContact == 'function') doDelete2 = object2.onContact(world, object1.objectType);

    return !doDelete1 || !doDelete2;
}
