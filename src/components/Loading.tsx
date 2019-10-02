import React from 'react';
import Wrapper from './Container/AppContainer';
import "./Loading.css";


function Loading(x: any): JSX.Element {

    const Element = (): JSX.Element => {
      return (
        <div className="back-drop">
          <div className="sk-folding-cube">
            <div className="sk-cube1 sk-cube"></div>
            <div className="sk-cube2 sk-cube"></div>
            <div className="sk-cube4 sk-cube"></div>
            <div className="sk-cube3 sk-cube"></div>
          </div>
        </div>
      )
    }
    
    return x.isAuthenticated ? <Wrapper><Element/></Wrapper> : <Element/> 

}

export default (Loading)