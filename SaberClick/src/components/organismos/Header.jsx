
import { Grid, Typography, Box } from '@mui/material';
import { useContext } from 'react';
import { SesionContext } from '../../context/SesionContext';
// Nota: Reemplaza estos paths con tus imágenes reales o URLs
const logoPlaceholder = 'ruta/a/tu/logo-instituto-alfa.png'; 
const classImagePlaceholder = 'ruta/a/tu/imagen-clase.jpg';

function Header() {
    const { institucion } = useContext(SesionContext);
  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        {institucion.nombre_institucion}
      </Typography>

      <Grid container spacing={4} alignItems="center">
        {/* Columna de la Imagen/Logo */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={logoPlaceholder}
            alt="Logo Instituto Alfa"
            sx={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </Grid>

        {/* Columna de la Imagen de Clase */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={classImagePlaceholder}
            alt="Clase de estudiantes"
            sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
          />
        </Grid>
      </Grid>
      
      {/* Texto de Relleno */}
      <Typography variant="body1" sx={{ mt: 3, lineHeight: 1.7 }}>
        {institucion.descripcion}
      </Typography>
    </Box>
  );
}

export default Header;