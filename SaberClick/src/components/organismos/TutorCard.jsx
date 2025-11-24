

import { Card, CardContent, Typography, Grid, Box, Rating, Link, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // 👈 Importamos useNavigate

function TutorCard({ 
    nombreTutoria, 
    descripcion, 
    costo, 
    imageSrc, 
    name, // Agregado: el nombre del tutor para la imagen (parece que estaba faltando)
    idTutoria // 👈 Nuevo: ID para enviar
}) {
  const navigate = useNavigate(); // 👈 Inicializamos el hook
  const headerColor = '#9c27b0'; 

  // Función para manejar la navegación
  const handleParalelosClick = () => {
    
    navigate('/ParaleloHome', { 
      state: {
        id_tutoria: idTutoria,
        nombre_tutoria: nombreTutoria

      }
    });
  };

  return (
    <Card 
      elevation={3} 
      sx={{ mb: 4, borderRadius: 2, overflow: 'visible' }} 
    >
      <Grid container>
        {/* Columna de la Imagen y Nombre del Tutor */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ 
            backgroundColor: headerColor, 
            p: 2, 
            color: 'white', 
            // Ajustamos borderRadius para dispositivos móviles y escritorio
            borderRadius: { xs: '8px 8px 0 0', sm: '8px 0 0 8px' }, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {name}
            </Typography>
            <Box
              component="img"
              src={imageSrc}
              alt={`Tutor ${name}`}
              sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                objectFit: 'cover', 
                mt: 1,
                border: '4px solid white', 
              }}
            />
          </Box>
        </Grid>

        {/* Columna del Contenido del Curso */}
        <Grid item xs={12} sm={8}>
          <CardContent>
            <Box 
              sx={{ 
                backgroundColor: '#3f51b5', 
                color: 'white', 
                p: 1, 
                borderRadius: 1, 
                display: 'inline-block', 
                mb: 1 
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {nombreTutoria}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {descripcion}
            </Typography>

            <Link href="#" underline="hover" color="primary" variant="body2" sx={{ display: 'block', mt: 1 }}>
              Portfolio →
            </Link>

            {/* Estrellas, Precio Y BOTÓN */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mt: 2 
            }}>
              {/* Sección Izquierda: Rating y Precio */}
              <Box>
                  <Rating name="read-only" value={3.5} precision={0.5} readOnly size="small" />
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    {costo} Bs
                  </Typography>
              </Box>
              
              {/* Sección Derecha: Botón Paralelos */}
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleParalelosClick} 
                sx={{ ml: 2 }} 
              >
                Paralelos
              </Button>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}

export default TutorCard;