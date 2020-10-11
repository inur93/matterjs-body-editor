import { useEffect, useState } from "react";

const margin = 10;
export const useScreenDimensions = () => {
    const [height, setHeight] = useState(window.innerHeight - margin*2);
    const [width, setWidth] = useState(window.innerWidth - margin*2);

    const resizeListener = () => {
        setWidth(window.innerWidth - margin*2);
        setHeight(window.innerHeight - margin*2);
    }
    useEffect(() => {
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
      }, []);

      const styles = {
          width, height, marginTop: margin, marginLeft: margin
      }
      return [{width, height, styles}];
}