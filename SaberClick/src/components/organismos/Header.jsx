import { Grid, Typography, Box } from '@mui/material';
import img from '../../assets/cerebro.jpeg'; 
import img1 from '../../assets/apuntando.jpeg';

function Header({ id, nombre, descripcion }) {
  return (
    <Box sx={{ mt: 5, mb: 8, p: 2 }}>
      <Grid container spacing={5} alignItems="center">

        {/* Columna izquierda con imágenes */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: '#e0f7fa',
              boxShadow: 4,
            }}
          >
            <Grid container spacing={2}>
              
              <Grid item xs={12} sm={6}>
                <Box
                  component="img"
                  src={img}
                  alt="Imagen 1"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 250,
                    objectFit: 'contain',
                    borderRadius: 2,
                    p: 1,
                    bgcolor: '#ffffff',
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  component="img"
                  src={img1}
                  alt="Imagen 2"
                  sx={{
                    width: '100%',
                    maxHeight: 250,
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              </Grid>

            </Grid>
          </Box>
        </Grid>

        {/* Columna derecha con texto */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: { xs: 0, md: 2 } }}>
            
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              color="primary.main"
              sx={{ fontWeight: 'extrabold', mb: 2 }}
            >
              {nombre}
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 2, fontStyle: 'italic' }}
            >
              ¡Aprende con nosotros y alcanza tu potencial!
            </Typography>

            <Typography
              variant="body1"
              sx={{ mt: 1, lineHeight: 1.7, color: 'text.primary' }}
            >
              {descripcion}
            </Typography>

          </Box>
        </Grid>

      </Grid>
    </Box>
  );
}

export default Header;
