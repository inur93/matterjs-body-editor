import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import Canvas from './components/Canvas';
import { FloatingPropertiesWindow } from './components/properties/PropertiesWindow';
import { FloatingToolbox } from './components/toolbox/Toolbox';
import { useScreenDimensions } from './hooks/useScreenDimensions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "root": {
      position: "relative",
      "z-index": 1031,
      overflow: "hidden",
      border: "1px solid black"
    }
  }),
);



function App() {
  const classes = useStyles();
  const [dimensions] = useScreenDimensions();

  return (<div className={classes.root} style={dimensions.styles}>
    <FloatingToolbox />
    <FloatingPropertiesWindow />
    <Canvas />
  </div>
  );
}

export default App;
