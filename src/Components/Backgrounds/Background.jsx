import React from 'react';
import Trunk from './Trunk';
import Dots from "./Dots"
import Halo from "./Halo"
import Waves from "./Waves"
import {useSelector} from "react-redux"

const Background = () => {
  const selectedBackground = useSelector(state => state.background.background)
  return (
    <div className="background-box">
      {selectedBackground === "" &&  <div className="background-fade"></div>}
      {selectedBackground === "Trunk" && <Trunk/>}
      {selectedBackground === "Halo" && <Halo/>}
      {selectedBackground === "Dots" && <Dots/>}
      {selectedBackground === "Waves" && <Waves/>}
    </div>
  );
};

export default Background;
