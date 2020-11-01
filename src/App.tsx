import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Canvas from './components/Canvas';
import { useScreenDimensions } from './hooks/useScreenDimensions';
import Toolbox from './components/toolbox/Toolbox';

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
    <Toolbox />
    <Canvas />
  </div>
  );
}

export default App;
