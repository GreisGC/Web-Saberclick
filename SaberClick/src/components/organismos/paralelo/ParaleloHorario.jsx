import { useEffect, useState } from "react";
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
  Divider,
  Card, // Importar Card para mejor presentación del tutor
  CardContent,
  CardHeader,
  Chip // Importar Chip para modalidad
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Nuevo icono para fechas
import ClassIcon from '@mui/icons-material/Class'; // Nuevo icono para paralelo
import PersonIcon from '@mui/icons-material/Person'; // Nuevo icono para tutor
import img from '../../../assets/pensador_lentes.jpeg'
import { useNavigate } from "react-router-dom";
import GetSesion from "../../../tools/GetSesion";

// Función de formato de fecha sin cambios
const formatDate = (fecha) => {
  if (!fecha) return "-";
  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Componente para una fila de detalle con icono
const DetailRow = ({ icon: Icon, label, value }) => (
  <Grid item xs={12} sm={6}>
    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
      <Icon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />
      <Typography variant="body2" color="text.secondary" fontWeight="medium">
        {label}:
      </Typography>
    </Box>
    <Typography variant="body2" color="text.primary" sx={{ ml: 3 }}>
      {value ?? "-"}
    </Typography>
  </Grid>
);

// Componente principal
const ParaleloHorario = ({ id_tutoria, nombreTutoria, nombreInstitucion }) => {
  const [paralelos, setParalelos] = useState([]);
  const [tutores, setTutores] = useState({});
  const navigate = useNavigate();

  // Lógica de useEffect (fetch de datos) sin cambios
  useEffect(() => {
    if (!id_tutoria) return;

    const fetchParalelos = async () => {
      try {
        const sesion=GetSesion();
        let url=`http://localhost:4000/paraleloPorTutoria/${id_tutoria}`;
      
        if(sesion && sesion.rol=="estudiante"){
          url=`http://localhost:4000/getParaleloPorTutoriaByEstudiante/${sesion.id}/${id_tutoria}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setParalelos(data);

        for (const p of data) {
          try {
            const resTutor = await fetch(
              `http://localhost:4000/TutorPorParalelo/${p.id_paralelo}`
            );
            const tutorData = await resTutor.json();
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

  // Lógica de onClick (navegación) sin cambios
  const onClick = (paraleloData, tutorData) => {
  if (!paraleloData) return;

  const inscripcionData = {
    nombre_tutoria: nombreTutoria,
    nombre_institucion: nombreInstitucion, 

    nombre_paralelo: paraleloData.nombre_paralelo,
    fecha_ini: paraleloData.fecha_ini,
    fecha_fin: paraleloData.fecha_fin,
    hora_ini: paraleloData.hora_ini,
    hora_fin: paraleloData.hora_fin,
    dia: paraleloData.dia,

    nombre_tutor: tutorData?.nombre,
    paterno_tutor: tutorData?.paterno,
    materno_tutor: tutorData?.materno,

    fecha_inscripcion: new Date().toISOString().slice(0, 10),
    hora_inscripcion: new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  navigate("/usuarios/new/Inscripcion", {
    state: { inscripcionData, id_tutoria: paraleloData.id_tutoria },
  });
};


  return (
    <>
      {paralelos.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          No se encontraron paralelos disponibles para esta tutoría.
        </Typography>
      ) : (
        paralelos.map((data) => {
          const tutor = tutores[data.id_paralelo];

          return (
            <Card key={data.id_paralelo} elevation={3} sx={{ mb: 3, borderRadius: 2, borderLeft: '5px solid #1976d2' }}>
              
              {/* Encabezado del Paralelo */}
              <CardHeader
                avatar={<ClassIcon color="primary" />}
                title={
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Paralelo: {data.nombre_paralelo}
                  </Typography>
                }
                action={
                  <Chip 
                    label={data.modalidad ?? "No definido"} 
                    color={data.modalidad === "Virtual" ? "info" : "success"}
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                }
                sx={{ pb: 1, backgroundColor: '#f5f5f5' }}
              />

              <CardContent>
                <Grid container spacing={3}>
                  
                  {/* Tarjeta del Tutor - Ahora un componente Card integrado */}
                  {tutor ? (
                    <Grid item xs={12} md={5}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Grid container spacing={1} alignItems="center">
                            <Grid item>
                              <Avatar
                                src={img}
                                alt="Foto del Tutor"
                                sx={{ width: 60, height: 60, border: '2px solid #ccc' }}
                              />
                            </Grid>
                            <Grid item xs>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {tutor.nombre + " " + tutor.paterno + " " + tutor.materno || "Nombre del Tutor"}
                              </Typography>
                              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                Tutor Certificado
                              </Typography>
                            </Grid>
                          </Grid>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ ml: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                              <SchoolIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />
                              <Typography variant="body2">
                                **Especialidad:** {tutor.especialidad || "No registrada"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                              <AccessTimeIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />
                              <Typography variant="body2">
                                **Experiencia:** {tutor.anos_experiencia + " año(s)" || "Sin información"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <AssignmentIndIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />
                              {tutor.cv ? (
                                <a
                                  href={tutor.cv}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#1976d2", textDecoration: "none", fontWeight: 'bold' }}
                                >
                                  Ver Portafolio
                                </a>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Portafolio no disponible
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                    </Grid>
                  ) : (
                    <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2, border: '1px dashed #ccc' }}>
                          Cargando información del tutor...
                        </Typography>
                    </Grid>
                  )}

                  {/* Detalles del Paralelo (Fechas y Horario) */}
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon color="action" sx={{ mr: 1 }}/>
                      Detalles del Periodo
                    </Typography>
                    
                    <Grid container spacing={2}>
                        {/* Fechas */}
                        <DetailRow 
                            icon={CalendarTodayIcon} 
                            label="Fecha Inicio" 
                            value={formatDate(data.fecha_ini)} 
                        />
                        <DetailRow 
                            icon={CalendarTodayIcon} 
                            label="Fecha Fin" 
                            value={formatDate(data.fecha_fin)} 
                        />
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Días y Horarios */}
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon color="action" sx={{ mr: 1 }}/>
                      Horario de Clases
                    </Typography>
                    <Table size="small" sx={{ maxWidth: 400, border: '1px solid #eee' }}>
                      <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Días</TableCell>
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

                    {/* Enlace de Modalidad Virtual */}
                    {data.modalidad === "Virtual" && data.enlace && (
                      <Box sx={{ mt: 2, p: 1, border: '1px dashed #1976d2', borderRadius: 1, display: "flex", alignItems: "center" }}>
                        <LinkIcon sx={{ mr: 1 }} color="primary" />
                        <Typography variant="subtitle2" fontWeight="bold">Enlace de Conexión:</Typography>
                        <a
                          href={data.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1976d2", marginLeft: 8 }}
                        >
                          Ir a la Sala Virtual
                        </a>
                      </Box>
                    )}
                  </Grid>

                  {/* Botón Inscribirse */}
                  <Grid
                    item
                    xs={12}
                    sx={{ mt: 2, textAlign: 'center' }}
                  >
                    {!data.id_estudiante?

                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => onClick(data, tutor)}
                      sx={{ minWidth: 200, py: 1.5 }}
                    >
                      Inscribirme a este Paralelo
                    </Button>:
                    <Button color="success">
                      Ver inscripcion
                    </Button>
                    }
                  </Grid>

                </Grid>
              </CardContent>
            </Card>
          );
        })
      )}
    </>
  );
};

export default ParaleloHorario;