import { Typography, Box } from '@mui/material';
import TutorCard from './TutorCard';
import { useEffect, useState } from 'react';

function TutoresSection({ idInstitucion, nombreInstitucion  }) {
  const [tutorias, setTutorias] = useState([]);

  useEffect(() => {
    if (!idInstitucion) return;

    const fetchTutorias = async () => {
      try {
        const res = await fetch(`http://localhost:4000/tutoriaPorInstitucion/${idInstitucion}`);
        const data = await res.json();
        setTutorias(data);
      } catch (error) {
        console.error("Error cargando tutorias", error);
      }
    };

    fetchTutorias();
  }, [idInstitucion]);

  return (
    <Box sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Nuestras Tutorías
      </Typography>

      {tutorias.map((tutoria) => (
        <TutorCard 
          key={tutoria.id_tutoria} 
          tutoria={tutoria}
          nombreInstitucion={nombreInstitucion}/>
      ))}
    </Box>
  );
}

export default TutoresSection;
