
export default {
    createTuning({Ammo: Ammo}) {
        const tuning = new Ammo.btVehicleTuning();

        return tuning;
    },

    createRaycast({Ammo: Ammo, world: world, body: body, tuning: tuning}) {
        const rayCaster = new Ammo.btDefaultVehicleRaycaster(world.physicsWorld);
        const vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster);
        vehicle.setCoordinateSystem(0, 1, 2);

        return vehicle;
    },


}
