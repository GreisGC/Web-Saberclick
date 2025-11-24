
import { Grid, Card, CardMedia, Typography, Box, Rating } from '@mui/material';
import { SesionContext } from '../../../context/SesionContext';
import { useContext } from 'react';


const TEACHER_IMAGE_URL = 'https://via.placeholder.com/300x400'; 

const HeaderParalelo = () => {
  const { tutor } = useContext(SesionContext);
  const { tutoria } = useContext(SesionContext);
  return (
    <Grid container spacing={3}>
      {/* Columna Izquierda: Perfil del Profesor */}
      <Grid item xs={12} sm={4}>
        <Box sx={{
          p: 2,
          bgcolor: 'grey.100', // Color de fondo sutil para el área
          borderRadius: 2
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Grecia Rodriques Dias{tutoria.nombre_tutoria}
          </Typography>
          <Card elevation={0}>
            <CardMedia
              component="img"
              height="300"
              image={TEACHER_IMAGE_URL}
              alt="Grecia Rodriques Dias"
              sx={{ borderRadius: 1 }}
            />
          </Card>
        </Box>
      </Grid>

      {/* Columna Derecha: Información del Curso */}
      <Grid item xs={12} sm={8}>
        <Box sx={{
          p: 2,
          bgcolor: 'grey.100', // Color de fondo sutil para el área
          borderRadius: 2,
          height: '100%', // Para que ocupe todo el alto
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="primary" 
            sx={{ mb: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}
          >
            Calculo I{tutoria.nombre_tutoria}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Lorem ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. 
            Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500.
          </Typography>
          <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 'medium' }}>
            Portafolio{tutor.cv}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating name="course-rating" value={2.5} readOnly precision={0.5} />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="text.secondary">
            80 Bs
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HeaderParalelo;