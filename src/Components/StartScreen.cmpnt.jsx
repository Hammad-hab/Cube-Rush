import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
export default function Startscreen (props) {
 return (
     <div id="container">
     <div id="blocker"></div>
     <div id="sustainer"> 
     <h1 className="center">{props.name}</h1>
     </div>
     <pre>By Hammad Ali Butt</pre>
     
     <Link to={"/Game"}><button id="Play">Play</button></Link>

     </div>
 )
}