
import React from 'react';
import { Container, Grid, Divider ,CssBaseline } from '@mui/material';
import HeaderParalelo from '../components/organismos/paralelo/HeaderParalelo'; 
import ParaleloHorario from '../components/organismos/paralelo/ParaleloHorario';
import TemasCard from '../components/organismos/paralelo/TemasCard';
import Navbar from "../components/Navbar";

const ParaleloHome = () => {
    
  return (
     

    <React.Fragment>
          <CssBaseline />
          <Navbar />
          <Container maxWidth="lg">
            <Grid container spacing={4}>
        {/* Sección Superior: Perfil y Descripción del Curso */}
        <Grid item xs={12}>
          <HeaderParalelo />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Sección Inferior: Horarios y Material */}
        <Grid item xs={12} md={7}>
          <ParaleloHorario />
        </Grid>
        <Grid item xs={12} md={5}>
          <TemasCard />
        </Grid>
      </Grid>
          </Container>
          
    </React.Fragment>
  );
};

export default ParaleloHome;