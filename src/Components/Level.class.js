import * as THREE from "three";
import User from "./User.controls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useState } from "react";
import {TbPlayerTrackNext, TbPlayerTrackPrev} from "react-icons/tb"
import {RiRestartFill} from "react-icons/ri"
const Quotes = [{
  q: "The game is never over until it is over",
  s: "Lugi Lemencello",
  f: `Escape from Mr. Lemoncello's library. by Chris Grabenstein`
}, {
  q: "winners never quit, and quitters never win",
  s: "Anonymous"
}, {
  q: "We learn more from failing than from winning",
  s: "Anonymous"
}]
function Trigger () {
  q = Quotes[Math.floor(Math.random() * Quotes.length)]
  return (
    <>
    <div className="overlay" style={{width: window.innerWidth, height: window.innerHeight}}>
     <h1>"{q.q}"</h1>
     <h3>{q.s}</h3>
     <h4>{q.f}</h4>
    <TbPlayerTrackNext className="next" onClick={() => {
      localStorage.setItem("serialNum", (Number(localStorage.getItem("serialNum")) + 1))
      window.location.reload()
    }}/>
    <br/>
    <RiRestartFill className="next" onClick={() => {
      window.location.reload()
    }} />
    <br/>
    <TbPlayerTrackPrev className="next" onClick={() => {
        localStorage.setItem("serialNum", (Number(localStorage.getItem("serialNum")) - 1))
        window.location.reload()
    }} />
    </div>
    </>
  )
}
class Game {
  constructor(props) {
    const [done, setDone] = useState(false)
    localStorage.setItem("game-finished", "false ")
    try {
      var scripts = ``
      var state = "noState";
      props.Texture ? (this.texture = props.Texture) : (this.texture = "");
      //#region  initialization
      var gravity = 0;
      this.levels = props.levels;
      this.caster = new THREE.Raycaster();
      this.props = props;
      // this.winningPoint =  {x: 0, y: 0, z: 0}
      this.scene = new THREE.Scene();
      this.fallingCondition = props.fallIf;
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      this.i = 0;
      this.camera.position.y += 3;
      this.camera.position.x -= 7;
      this.camera.rotation.y -= 1.55;
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      this.renderer.domElement.setAttribute("id", "canvas")
      document.body.setAttribute("style", "background: linear-gradient(skyblue, white);")
      const controls = User.Controls();
      const Controls = new OrbitControls(this.camera, this.renderer.domElement);
      //#endregion initialization

      //#region render
      
      this.geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
      this.blockMetalMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(require("./Textures/Texture.jpg")),
      });
      this.checkpoint = new THREE.MeshBasicMaterial({
        color: new THREE.Color("purple")
      })
      this.blocks = [];
      var CheckPoints = [];
      // this.scene.add()
      var geometry = new THREE.BoxGeometry(1, 0.5, 1);
      var material = new THREE.MeshBasicMaterial({
        color: "red",
        side: THREE.DoubleSide,
        visible: true,
      });

      for (
        let i = 1;
        i < props.positions[localStorage.getItem("serialNum")].length;
        i++
      ) {
        const element = props.positions[localStorage.getItem("serialNum")][i];
        if (element.winAt) {
          delete element.winAt;
          this.winningPoint = element;
        }
        if (element.script) {
          scripts += element.script
          delete element.script
        }
        if (element.mat) {
          this.blockMetal = new THREE.Mesh(this.geometry, element.mat);
        } else {
          this.blockMetal = new THREE.Mesh(
            this.geometry,
            this.blockMetalMaterial
          );
        }
        this.blockMetal.position.copy(
          new THREE.Vector3(element.x, element.y, element.z)
        );
        if (element.isCheckPoint) {
       
          this.endPoint = new THREE.Mesh(geometry, this.checkpoint);
          delete element.isCheckPoint
          this.endPoint.position.copy(new THREE.Vector3(element.x, 0.75, element.z))
          this.scene.add(this.endPoint)
          CheckPoints.push(element);
        }
        this.scene.add(this.blockMetal);
        this.blocks.push(this.blockMetal);
      }

      var geo = new THREE.BoxGeometry(1, 1, 1);
      var mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(230, 163, 166)"),
      });
      var mesh = new THREE.Mesh(geo, mat);

      
      var endPoint = new THREE.Mesh(geometry, material);

      mesh.position.y = 1;
      mesh.position.x += 1;
      endPoint.position.x = this.winningPoint.x;
      endPoint.position.z = this.winningPoint.z;
      endPoint.position.y = 0.75;
      this.scene.add(mesh, endPoint);
      var animate = () => {
        var id = requestAnimationFrame(animate);
        this.renderer.render(this.scene, this.camera);
        if (
          mesh.position.x === this.winningPoint.x &&
          mesh.position.z === this.winningPoint.z
        ) {
          endPoint.material.color = new THREE.Color("green");
          mesh.position.y = 1.5;
          state = "won";
          setTimeout(() => {
            eval(scripts)
          }, 2000);
          this.blocks = [];
                 cancelAnimationFrame(id)

          setDone(true)
          
        } else {
          if (User.movement.x === true) {
            mesh.position.x += 1;
            this.i++;
            this.camera.position.x += 1;
          } else if (User.movement.z === true) {
            mesh.position.z -= 1;
            this.i++;
            this.camera.position.z -= 1;
          } else if (User.movement.negZ === true) {
            mesh.position.z += 1;
            this.camera.position.z += 1;
            this.i++;
          } 
        }
        for (let i = 0; i < CheckPoints.length; i++) {
          const element = CheckPoints[i];
          if (mesh.position.x === element.x && mesh.position.z === element.z) {
            User.movement.negX = false;
            User.movement.negZ = false;
            User.movement.z = false;
            User.movement.x = false;
            // this.endPoint.material.color = new THREE.Color('blue')
            // mesh.position.y = 1.5;
          } 
        }

        if (this.blocks[this.i] ) {
          if (
            mesh.position.z !== this.blocks[this.i].position.z ||
            mesh.position.x !== this.blocks[this.i].position.x
          ) {
            state = "lost";
            delete User.movement.z;
            delete User.movement.x;
            delete User.movement.negZ;
            mesh.position.y -= gravity;
            // this.camera.position.y -= gravity
            gravity += 0.01;
            window.removeEventListener("keypress", User.controlFunction);
            setTimeout(() => {
              cancelAnimationFrame(id);
            if (state === "lost") {
              if (done === false) {
                document.body.remove()
              window.location.reload()
              }
            }
            }, 1000);
          }
        }
        // delete this
      };
      animate();
      if (!(localStorage.getItem("game-finished"))) {
         localStorage.setItem("game-finished", "false")
      }

    } catch (error) {
      localStorage.setItem("serialNum", "1");
      window.location.reload();
    console.error(error)
    }

    this.component = () => {
      return (
        <>
          <p className="hover">
            <strong>Level </strong>
            {localStorage.getItem("serialNum")}
            <br/>
          </p>
          {
            done === true ? Trigger() : ""
          }
        </>
      );
    };
    this.state = state;
  }
}
//#endregion render

export default Game;
