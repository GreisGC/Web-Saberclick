import { useEffect, useState } from "react";
import { Typography, Box, Paper, Grid, Button } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLocation } from "react-router-dom";

const ScheduleRow = ({ label, value }) => (
  <Grid item xs={6} sm={3}>
    <Typography variant="caption" fontWeight="bold" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Grid>
);


const ScheduleBlock = ({ data }) => (
  <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
    <Grid container spacing={2}>
      <ScheduleRow label="Paralelo" value={data.nombre_paralelo} />
      <ScheduleRow label="Fecha Ini" value={data.fecha_ini} />
      <ScheduleRow label="Fecha Fin" value={data.fecha_fin} />

      <Grid item xs={12} sx={{ mt: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Días y Horarios
        </Typography>
      </Grid>

      <Grid item xs={12} container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Typography>{data.dia}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography>
            {data.hora_ini} - {data.hora_fin}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ mt: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Modalidad:
          <span style={{ fontWeight: "normal" }}> {data.modalidad}</span>
        </Typography>

        {data.modalidad === "Virtual" && data.enlace && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LinkIcon sx={{ fontSize: 16, mr: 1 }} color="primary" />
            <a href={data.enlace} target="_blank" rel="noopener noreferrer">
              {data.enlace}
            </a>
          </Box>
        )}

        {data.modalidad === "Presencial" && data.ubicacion && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} color="primary" />
            <Typography>{data.ubicacion}</Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => console.log("Inscripción:", data.id_paralelo)}
        >
          Inscribirme
        </Button>
      </Grid>
    </Grid>
  </Paper>
);


export default function ParaleloHome() {
  const location = useLocation();
  const { id_tutoria, nombre_tutoria } = location.state || {};

  const [paralelo, setParalelo] = useState(null);

  const getParalelo = () => {
    fetch(`http://localhost:4000/paraleloPorTutoria/${id_tutoria}`)
      .then((res) => res.json())
      .then((result) => {
        console.log("PARALELO RECIBIDO:", result);
        setParalelo(result); // <<— ahora llega solo 1 objeto
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (id_tutoria) getParalelo();
  }, [id_tutoria]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Paralelos – {nombre_tutoria}
      </Typography>

      {!paralelo ? (
        <Typography>No existen paralelos registrados.</Typography>
      ) : (
        <ScheduleBlock data={paralelo} />
      )}
    </Box>
  );
}
