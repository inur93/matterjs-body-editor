import React from 'react';
import './App.css';
import { Backdrop } from './components/Backdrop';
import { Canvas } from './components/Canvas';
import { useScreenDimensions } from './hooks/useScreenDimensions';
import { Toolbox } from './Toolbox';




function App() {
  
 const [dimensions] = useScreenDimensions();

  return (<div className="main-container" style={dimensions.styles}>
    
    <Toolbox />
    <Canvas />    
  </div>
  );
}

export default App;
