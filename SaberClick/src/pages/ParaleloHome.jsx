import React, { useState, useEffect } from "react";
import { Container, Grid, Divider, CssBaseline } from "@mui/material";
import HeaderParalelo from "../components/organismos/paralelo/HeaderParalelo";
import ParaleloHorario from "../components/organismos/paralelo/ParaleloHorario";
import TemasCard from "../components/organismos/paralelo/TemasCard";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

const API_URL = "http://localhost:4000";

const ParaleloHome = () => {
  const location = useLocation();
  const { id, nombre, descripcion, costo, idInstitucion } = location.state || {};
  
  const [nombreInstitucion, setNombreInstitucion] = useState("");

  // ---- FETCH PARA OBTENER EL NOMBRE DE LA INSTITUCIÓN ----
  useEffect(() => {
    const fetchInstitucion = async () => {
      try {
        const res = await fetch(`${API_URL}/institucion/${idInstitucion}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setNombreInstitucion(data[0].nombre_institucion);
        } else if (data.nombre_institucion) {
          setNombreInstitucion(data.nombre_institucion);
        } else {
          console.warn("No se encontró la institución");
        }
      } catch (error) {
        console.error("Error cargando institución:", error);
      }
    };

    if (idInstitucion) fetchInstitucion();
  }, [idInstitucion]);

  // Debug
  console.log("ID Institución:", idInstitucion, "Nombre:", nombreInstitucion);

  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Sección Superior: Perfil y Descripción del Curso */}
          <Grid item xs={12}>
            <HeaderParalelo 
              id={id}
              nombre={nombre}
              descripcion={descripcion}
              costo={costo}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Sección Inferior: Horarios y Material */}
          <Grid item xs={12} md={7}>
            <ParaleloHorario 
              id_tutoria={id}
              nombreTutoria={nombre} 
			  idInstitucion={idInstitucion}
              nombreInstitucion={nombreInstitucion} // ✅ Ahora autocompleta correctamente
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TemasCard id_tutoria={id}/>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default ParaleloHome;
