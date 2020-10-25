import React from 'react';
import './App.css';
import { Canvas } from './components/Canvas';
import { useScreenDimensions } from './hooks/useScreenDimensions';
import { Toolbox } from './components/toolbox/Toolbox';




function App() {
  
 const [dimensions] = useScreenDimensions();

  return (<div className="main-container" style={dimensions.styles}>
    
    <Toolbox />
    <Canvas />    
  </div>
  );
}

export default App;
