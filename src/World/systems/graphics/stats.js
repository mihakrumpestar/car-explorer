import Stats from './../../../../../vendor/examples/jsm/libs/stats.module.js';

function createStats() {
    const stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.left = '80px';

    stats.tick = () => stats.update();
    
    return stats;
}

export { createStats }