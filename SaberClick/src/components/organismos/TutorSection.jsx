
import { Typography, Box } from '@mui/material';
import TutorCard from './TutorCard';
import { useContext, useEffect, useState } from 'react';
import { SesionContext } from '../../context/SesionContext';

// --- Datos de los Tutores ---

function TutoresSection() {
    const { institucion } = useContext(SesionContext);
    const [listaTutorias, setListaTutorias] = useState([]);
    const getTutorias = ()=>{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
        };

        fetch("http://localhost:4000/tutoriaPorInstitucion/"+institucion.id_institucion, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            setListaTutorias(result)
        })
        .catch((error) => console.error(error));
    }
    useEffect(()=>{
        getTutorias()
    }, [])
  return (
    <Box sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Nuestros Tutorias
      </Typography>

      {listaTutorias.map((tutorias) => (
        <TutorCard 
          key={tutorias.id_tutoria}
          nombreTutoria={tutorias.nombre_tutoria}
          descripcion={tutorias.descripcion}
          costo={tutorias.costo}
          imageSrc={'https://via.placeholder.com/120x120?text=Grecia+1'}
		  idTutoria={tutorias.id_tutoria}

        />
      ))}
    </Box>
  );
}

export default TutoresSection;