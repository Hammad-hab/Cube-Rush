import Startscreen from "./Components/StartScreen.cmpnt";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import GameCmpnt from "./Components/Game.cmpnt"
import "./style.css";
const App = () => {
const end = setInterval(() => {
  if (localStorage.getItem("game-finished") === "true") {
    if ( document.getElementById("root")) {
    document.getElementById("root").remove()
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.appendChild(root)
    }
    if ( document.getElementById("canvas")) {
    document.getElementById("canvas").remove()
    }
    console.log("ye")
    alert("You have won the game")
    clearInterval(end)
  } 
}, 100);
 return <GameCmpnt.Game/>
};

export default App;
 
