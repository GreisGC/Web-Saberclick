import { Grid, Card, Typography, Box, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';

import { useEffect, useState } from 'react';
import axios from 'axios';

// Componente para mostrar detalles destacados
const DetailChip = ({ icon: Icon, label, value, color = 'text.secondary' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
    <Icon sx={{ mr: 1, color: 'primary.main', fontSize: 22 }} />
    <Typography variant="body1" fontWeight="bold" color={color} sx={{ mr: 1 }}>
      {label}:
    </Typography>
    <Typography variant="body1" color="text.primary">
      {value}
    </Typography>
  </Box>
);

const HeaderParalelo = ({ id, nombre, descripcion, costo }) => {
  const [paralelo, setParalelo] = useState(null);
  
  // Lógica de fetch de datos sin cambios
  useEffect(() => {
    if (!id) return;

    const fetchParalelo = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/paraleloPorTutoria/${id}`);

        if (!res.data || res.data.length === 0) {
          console.warn("No hay paralelos activos para esta tutoría");
          return;
        }

        // Tomamos el primer paralelo activo
        setParalelo(res.data[0]);

      } catch (err) {
        console.error("Error al obtener paralelo:", err);
      }
    };

    fetchParalelo();
  }, [id]);


  // Placeholder para datos del paralelo (usado si el fetch aún no carga)
  const currentParalelo = paralelo || {};

  return (
    <Grid container spacing={4} sx={{ mb: 4 }}>

      {/* --- TARJETA PRINCIPAL DE TUTORÍA --- */}
      <Grid item xs={12} sm={8}>
        <Card elevation={6} sx={{
          p: 4,
          borderRadius: 4,
          minHeight: { sm: 400 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          // Fondo más sutil y limpio
          background: 'linear-gradient(145deg, #ffffff, #f0f8ff)',
          border: '1px solid #e0e0e0'
        }}>

          <Box>
            {/* Título Principal */}
            <Typography 
              variant="h3" 
              fontWeight="extrabold" // Más impacto
              color="primary.dark" 
              sx={{ 
                mb: 1, 
                borderBottom: '3px solid', 
                borderColor: 'secondary.main', 
                display: 'inline-block',
                pb: 0.5 
              }}
            >
              {nombre}
            </Typography>

            {/* Subtítulo / Resumen */}
            <Typography variant="h6" color="text.primary" sx={{ mt: 2, mb: 1, fontStyle: 'italic' }}>
              {descripcion}
            </Typography>
            
           
            
          </Box>

          <Box>
            <Divider sx={{ mb: 2 }} />
            
            {/* Información clave del paralelo (usando datos ficticios si no hay fetch) */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DetailChip 
                  icon={GroupIcon} 
                  label="Vacantes" 
                  value={currentParalelo.cupo_maximo ? `${currentParalelo.cupo_maximo} estudiantes` : 'Limitadas'} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailChip 
                  icon={AccessTimeIcon} 
                  label="Duración" 
                  value={currentParalelo.duracion_semanas ? `${currentParalelo.duracion_semanas} Semanas` : 'Indefinida'} 
                />
              </Grid>
            </Grid>


            {/* Sección de Precio Destacada */}
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              backgroundColor: '#ffebee', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon sx={{ color: '#e91e63', fontSize: 30, mr: 1 }} />
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  Inversión Total:
                </Typography>
              </Box>
              
              <Typography variant="h3" fontWeight="bold" color="#e91e63">
                {costo} Bs
              </Typography>
            </Box>
          </Box>

        </Card>
      </Grid>
      
      {/* Puedes usar esta columna para una imagen de la tutoría o un componente de tutor */}
      <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{
            p: 3,
            borderRadius: 4,
            height: '100%',
            backgroundColor: '#ffffff'
          }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                  ¿Qué incluye?
              </Typography>
              <Box component="ul" sx={{ pl: 2, listStyleType: 'disc' }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>Acceso a material exclusivo.</Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>Certificado de finalización.</Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>Sesiones en vivo con el tutor.</Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>Soporte personalizado.</Typography>
              </Box>
          </Card>
      </Grid>

    </Grid>
  );
};

export default HeaderParalelo;