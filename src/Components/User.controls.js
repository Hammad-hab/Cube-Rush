
var movement = {
    x: false,
    z: false,
    negZ: false,
    negX: false
}
function controlFunction (e) {
        switch (e.key.toLowerCase()) {
                case "w":
                    movement.x = true
                    movement.negZ = false
                    movement.negX =false
                    movement.z = false
                break;
                case "a":
                    movement.z = true
                   movement.negZ = false
                   movement.negX =false
                   movement.x = false
                 break;     
                 case "d":
                    movement.z = false
                    movement.negZ = true
                    movement.negX =false
                    movement.x = false
                  break;
                  case "s":
                    movement.z = false
                    movement.negX = true
                    movement.negZ = false
                    movement.x = false
                  break;
            default:
                break;
        }
}
const Controls = () => {
    window.addEventListener("keypress", controlFunction)
}

export default {
    movement,
    Controls,
    controlFunction
}