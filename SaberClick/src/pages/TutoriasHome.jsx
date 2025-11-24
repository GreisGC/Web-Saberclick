import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import Navbar from "../components/Navbar";
import Header from '../components/organismos/Header';
import TutoresSection from '../components/organismos/TutorSection';

function TuroriasHome() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Header />
        <TutoresSection />
      </Container>
      
    </React.Fragment>
  );
}

export default TuroriasHome;