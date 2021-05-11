import React from 'react';
import "../css/management.css";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";


class Main extends React.Component {
   
  render() {

      
      return <Container>
             <div></div>
             <div className="title">
              <h3>project 1 team</h3>
              <div className="main">
                <h1><strong>project 1 team</strong></h1>
              </div>
             </div>
            
             <Link to="/login">
               <h3 className="login">login</h3>
           </Link>

           

      </Container>;
    }
  }
  
  const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("https://pixabay.com/get/g1312445ede5ca505c5ce40df709ca8a00f25f0611718774c1d2757458b6db3c926f00eb7a826f1108cb96a7aa2f1f124_1280.jpg");
    background-size: cover;
  `;
  
  export default Main;

