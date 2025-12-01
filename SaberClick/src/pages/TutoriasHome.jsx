import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import Navbar from "../components/Navbar";
import Header from '../components/organismos/Header';
import TutoresSection from '../components/organismos/TutorSection';
import { useLocation } from "react-router-dom";


function TuroriasHome() {
  const location = useLocation();
  const { id, nombre, descripcion } = location.state || {};
  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Header 
          id={id}
          nombre={nombre}
          descripcion={descripcion}
        />
        <TutoresSection 
          idInstitucion={id} 
          nombreInstitucion={nombre} 
        />
      </Container>
      
    </React.Fragment>
  );
}

export default TuroriasHome;