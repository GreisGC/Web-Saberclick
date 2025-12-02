import  { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import GetSesion from "../tools/GetSesion"; // Asegúrate que la ruta sea correcta: ../tools/GetSesion

export default function Calificaciones() {
  
  // 1. Obtener los datos de la sesión
  const sesion = GetSesion();
  const id_estudiante = sesion?.id;
  const nombre = sesion?.nombre;
  const paterno = sesion?.paterno;
  const materno = sesion?.materno;
  const nombreCompleto = `${nombre || ''} ${paterno || ''} ${materno || ''}`.trim();
  
  // 2. Estado para guardar los datos de inscripción
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Lógica para cargar las inscripciones usando el ID del estudiante
  useEffect(() => {
    // Si no hay ID de estudiante, no hacemos la llamada
    if (!id_estudiante) {
      setLoading(false);
      setError("ID de estudiante no encontrado en la sesión.");
      return;
    }

    const loadInscripciones = async () => {
      setLoading(true);
      setError(null);
      try {
        // Usamos el id_estudiante obtenido de la sesión
        const url = `http://localhost:4000/notasEstudiante/${id_estudiante}`; 
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error al cargar las inscripciones: ${response.statusText}`);
        }
        
        const data = await response.json();
        setInscripciones(data); 
      } catch (err) {
        console.error("Error en fetch de inscripciones:", err);
        setError(err.message || "Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    loadInscripciones();
  }, [id_estudiante]); // Se ejecuta solo cuando el componente se monta o si id_estudiante cambia

  // --- Renderizado del Componente ---
  return (
    <Box sx={{ p: 4, maxWidth: 1000, margin: '0 auto' }}> 
        
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          🎓 Calificaciones
        </Typography>

        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
          Estudiante: **{nombreCompleto || 'Datos de estudiante no disponibles'}**
        </Typography>
        
        <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
          ID de Estudiante: **{id_estudiante || 'N/A'}**
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* 4. Mostrar estados de carga/error */}
        {loading && (
          <Typography variant="h6" color="info.main" sx={{ textAlign: 'center' }}>
            Cargando inscripciones...
          </Typography>
        )}
        
        {error && (
          <Typography variant="h6" color="error.main" sx={{ textAlign: 'center' }}>
            ❌ Error: {error}
          </Typography>
        )}
        
        {/* 5. Mostrar la tabla de inscripciones */}
        {!loading && !error && inscripciones.length > 0 && (
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Tutoria</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Nota 1</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Intento 1</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Nota 2</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Intento 2</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Nota 3</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Intento 3</TableCell>
                      {/* Agrega más columnas según los datos que necesites mostrar de la inscripción */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inscripciones.map((inscripcion) => (
                      <TableRow key={inscripcion.id_nombre_tutoria} hover>
                        <TableCell>{inscripcion.nombre_tutoria}</TableCell>
                        <TableCell>{inscripcion.nota1}</TableCell>
                        <TableCell>{inscripcion.intento1}</TableCell>
                        <TableCell>{inscripcion.nota2}</TableCell>
                        <TableCell>{inscripcion.intento2}</TableCell>
                        <TableCell>{inscripcion.nota3}</TableCell>
                         <TableCell>{inscripcion.intento3}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
        )}

        {/* 6. Mensaje si no hay inscripciones */}
        {!loading && !error && inscripciones.length === 0 && (
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
            Aún no tienes inscripciones registradas.
          </Typography>
        )}
        
    </Box>
  );
}