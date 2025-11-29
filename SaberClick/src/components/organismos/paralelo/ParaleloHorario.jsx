import  { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Divider
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import img from '../../../assets/pensador_lentes.jpeg'
import { useNavigate } from "react-router-dom";
const formatDate = (fecha) => {
  if (!fecha) return "-";
  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ScheduleRow = ({ label, value }) => (
  <Grid item xs={6} sm={3}>
    <Typography
      variant="subtitle2"
      fontWeight="bold"
      color="text.primary"
      sx={{ mb: 0.5 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" color="text.primary">
      {value ?? "-"}
    </Typography>
  </Grid>
);

const ParaleloHorario = ({ id_tutoria }) => {
  const [paralelos, setParalelos] = useState([]);
  const [tutores, setTutores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!id_tutoria) return;

    const fetchParalelos = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/paraleloPorTutoria/${id_tutoria}`
        );
        const data = await res.json();
        console.log("Paralelos:", data);
        setParalelos(data);

        // Fetch de tutor para cada paralelo
        for (const p of data) {
          try {
            const resTutor = await fetch(
              `http://localhost:4000/TutorPorParalelo/${p.id_paralelo}`
            );
            const tutorData = await resTutor.json();
            console.log(`Tutor de paralelo ${p.id_paralelo}:`, tutorData);

            // Si tu endpoint devuelve array, toma el primero
            const tutor = Array.isArray(tutorData) ? tutorData[0] : tutorData;

            setTutores((prev) => ({ ...prev, [p.id_paralelo]: tutor }));
          } catch (error) {
            console.error("Error al obtener tutor:", error);
          }
        }
      } catch (error) {
        console.error("Error al obtener paralelos:", error);
      }
    };

    fetchParalelos();
  }, [id_tutoria]);

  const onClick = (id_paralelo, id_tutoria) => {
    console.log("Inscribir en:", id_paralelo, "Tutoria:", id_tutoria);
  
    navigate('/usuarios/new/Inscripcion', {
      state: { id_paralelo: id_paralelo, id_tutoria: id_tutoria }
    });
  };
  return (
    <>
      {paralelos.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2, color: "text.primary" }}>
          No se encontraron paralelos para esta tutoría.
        </Typography>
      ) : (
        paralelos.map((data) => {
          const tutor = tutores[data.id_paralelo];
          console.log("Render paralelo:", data.id_paralelo, "Tutor:", tutor);

          return (
            <Paper key={data.id_paralelo} elevation={3} sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                {/* Tarjeta Tutor */}
                {tutor ? (
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Avatar
                            src={img}
                            sx={{ width: 70, height: 70 }}
                          />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="h6" fontWeight="bold">
                            {tutor.nombre+" "+tutor.paterno+" "+tutor.materno || "Nombre del Tutor"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {"Tutor Certificado"}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolIcon sx={{ mr: 1, color: "text.secondary" }} />
                                <Typography variant="body2" color="text.secondary">
                                  {tutor.especialidad || "Especialidad no registrada"}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                                <Typography variant="body2" color="text.secondary">
                                  {tutor.anos_experiencia+" año de experiencia" || "Sin información"}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ) : (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Cargando tutor...
                  </Typography>
                )}

                {/* Paralelo, Fecha Inicio, Fecha Fin */}
                <ScheduleRow label="Paralelo" value={data.nombre_paralelo} />
                <ScheduleRow label="Fecha Inicio" value={formatDate(data.fecha_ini)} />
                <ScheduleRow label="Fecha Fin" value={formatDate(data.fecha_fin)} />

                {/* Días y Horarios */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="text.primary"
                    gutterBottom
                  >
                    Días y Horarios
                  </Typography>

                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Día</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Hora Inicio</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Hora Fin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{data.dia ?? "-"}</TableCell>
                        <TableCell>{data.hora_ini ?? "-"}</TableCell>
                        <TableCell>{data.hora_fin ?? "-"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                {/* Modalidad */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    Modalidad:{" "}
                    <span style={{ fontWeight: "normal", color: "text.primary" }}>
                      {data.modalidad ?? "-"}
                    </span>
                  </Typography>

                  {data.modalidad === "Virtual" && data.enlace && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <LinkIcon sx={{ fontSize: 16, mr: 1 }} color="primary" />
                      <a
                        href={data.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1976d2" }}
                      >
                        {data.enlace}
                      </a>
                    </Box>
                  )}
                </Grid>

                {/* Botón Inscribirse */}
                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ textAlign: { xs: "left", sm: "right" }, mt: 2 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => onClick(data.id_paralelo, data.id_tutoria)} 
                  >
                    Inscribirme
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          );
        })
      )}
    </>
  );
};

export default ParaleloHorario;
