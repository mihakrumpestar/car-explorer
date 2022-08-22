
function vehicleControl() {
    // Keybord actions
    let actions = {};
    let keysActions = {
        "KeyW":'acceleration',
        "KeyS":'braking',
        "KeyA":'left',
        "KeyD":'right',
    };


    window.addEventListener( 'keydown', keydown);
    window.addEventListener( 'keyup', keyup);

    function keyup(e) {
      if(keysActions[e.code]) {
        //console.log(e);
        actions[keysActions[e.code]] = false;
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    function keydown(e) {
      if(keysActions[e.code]) {
        actions[keysActions[e.code]] = true;
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    return actions;
}

export { vehicleControl }