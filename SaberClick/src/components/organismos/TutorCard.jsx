import { Card, CardContent, Typography, Grid, Box, Rating, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import img from '../../assets/mujer.jpeg';

function TutorCard({ tutoria, nombreInstitucion }) {
  const navigate = useNavigate();

  const handleParalelosClick = () => {
    navigate("/ParaleloHome", {
      state: {
         id: tutoria.id_tutoria,
         nombre: tutoria.nombre_tutoria,
         descripcion: tutoria.descripcion,
         costo: tutoria.costo,
         idInstitucion: tutoria.id_institucion
       
      }
    });
  };


  return (
    <Card 
      elevation={8} 
      sx={{ 
        mb: 4, 
        borderRadius: 3, 
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 12 }
      }} 
    >
      <Grid container>
        
        {/* Imagen */}
        <Grid item xs={12} sm={4}>
          <Box 
            sx={{ 
              backgroundColor: '#3f51b5',
              p: 3,
              color: 'white',
              borderRadius: { xs: '12px 12px 0 0', sm: '12px 0 0 12px' },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              component="img"
              src={img}
              alt="Tutor"
              sx={{
                width: 180,
                height: 180,
                objectFit: 'cover',
                border: '5px solid white',
                borderRadius: '10px',
                mb: 1
              }}
            />
          </Box>
        </Grid>

        {/* Información */}
        <Grid item xs={12} sm={8}>
          <CardContent sx={{ p: 3 }}>

            <Typography variant="h5" fontWeight="bold" color="#3f51b5" sx={{ mb: 1.5 }}>
              {tutoria.nombre_tutoria}
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              {tutoria.descripcion}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
              
              <Box>
                <Rating name="read-only" value={4.0} precision={0.5} readOnly />
                <Typography variant="h6" fontWeight="bold">
                  {tutoria.costo} Bs
                </Typography>
              </Box>

              <Button 
                variant="contained"
                size="large"
                onClick={handleParalelosClick}
                sx={{
                  backgroundColor: '#9372f7',
                  '&:hover': { backgroundColor: '#7e60df' }
                }}
              >
                Ver Paralelos
              </Button>

            </Box>

          </CardContent>
        </Grid>

      </Grid>
    </Card>
  );
}

export default TutorCard;
