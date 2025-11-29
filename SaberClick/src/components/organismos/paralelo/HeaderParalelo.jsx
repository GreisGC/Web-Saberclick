import { Grid, Card, CardMedia, Typography, Box, Rating } from '@mui/material';
import img from '../../../assets/pensador_lentes.jpeg';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';
import { useEffect, useState } from 'react';
import axios from 'axios';

const TEACHER_IMAGE_URL = img;

const HeaderParalelo = ({ id, nombre, descripcion, costo }) => {
  const [paralelo, setParalelo] = useState(null);
  const [tutor, setTutor] = useState(null);

  // --- 1️⃣ Obtener paralelos de la tutoría ---
  useEffect(() => {
    if (!id) return;

    const fetchParalelo = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/paraleloPorTutoria/${id}`);

        if (!res.data || res.data.length === 0) {
          console.warn("No hay paralelos activos para esta tutoría");
          return;
        }

        // Tomamos el primer paralelo activo (si hay más, se puede cambiar para listar todos)
        setParalelo(res.data[0]);

      } catch (err) {
        console.error("Error al obtener paralelo:", err);
      }
    };

    fetchParalelo();
  }, [id]);

  // --- 2️⃣ Obtener tutor del paralelo ---
  useEffect(() => {
    if (!paralelo?.id_paralelo) return;

    const fetchTutor = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/TutorPorParalelo/${paralelo.id_paralelo}`);

        if (!res.data || res.data.length === 0) {
          console.warn("No se encontró tutor para este paralelo");
          return;
        }

        setTutor(res.data[0]); // Devuelve un array, tomamos el primer tutor

      } catch (err) {
        console.error("Error al obtener tutor:", err);
      }
    };

    fetchTutor();
  }, [paralelo]);

  return (
    <Grid container spacing={4}>

      {/* --- TARJETA DE TUTOR --- */}
      <Grid item xs={12} sm={4}>
        <Card elevation={6} sx={{ borderRadius: 3, p: 3, backgroundColor: '#ffffff' }}>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <CardMedia
              component="img"
              image={tutor?.foto || TEACHER_IMAGE_URL}
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #3f51b5',
                mb: 2
              }}
            />

            <Typography variant="h5" fontWeight="bold" color="primary.dark">
              {tutor?.nombre || "Nombre del Tutor"} {tutor?.paterno || ""} {tutor?.materno || ""}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Tutor Certificado
            </Typography>
          </Box>

          {/* Información del tutor */}
          <Box sx={{ mt: 2, p: 1, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#555' }}>
              Detalles del Tutor
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {tutor?.especialidad || "Especialidad no registrada"}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTimeIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {tutor?.anos_experiencia ? `${tutor.anos_experiencia} años de experiencia` : "Sin información"}
              </Typography>
            </Box>

            {/* Mostrar CV si existe */}
            {tutor?.cv && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LinkIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                  variant="body2"
                  color="primary"
                  component="a"
                  href={tutor.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver Portafolio (CV)
                </Typography>
              </Box>
            )}

          </Box>
        </Card>
      </Grid>

      {/* --- TARJETA DE TUTORIA --- */}
      <Grid item xs={12} sm={8}>
        <Card elevation={6} sx={{
          p: 3,
          borderRadius: 3,
          minHeight: { sm: 400 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#e3f2fd'
        }}>

          <Box>
            <Typography variant="h3" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              {nombre}
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {descripcion}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {paralelo?.descripcion_larga || "Esta tutoría está diseñada para mejorar tus habilidades..."}
            </Typography>
          </Box>

          <Box>
            <Rating name="course-rating" value={4.0} readOnly precision={0.5} size="large" />

            <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mt: 2 }}>
              Precio: <span style={{ color: '#e91e63' }}>{costo} Bs</span>
            </Typography>
          </Box>

        </Card>
      </Grid>

    </Grid>
  );
};

export default HeaderParalelo;
