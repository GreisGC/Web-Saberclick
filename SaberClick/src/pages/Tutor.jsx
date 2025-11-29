import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Link, List, ListItem
} from "@mui/material";

function Tutor() {
  const [tutor, setTutor] = useState([]);
  const navigate = useNavigate();

  // Define la URL base de tu backend para servir archivos estáticos
  const BASE_URL = "http://localhost:4000/upload/";

  const loadTutor = async () => {
    try {
      const response = await fetch("http://localhost:4000/tutor");
      const data = await response.json();
      
      // El backend ya debería devolver t.contenido como un array de URLs o nombres de archivo
      setTutor(data); 
    } catch (error) {
      console.error("Error al cargar Tutor:", error);
    }
  };

  const handleEliminar = async (idTutor) => {
    // Usamos console.log para indicar la acción, ya que las funciones nativas (alert/confirm) están deshabilitadas.
    console.log(`Paso 1: Se requiere la confirmación para deshabilitar el tutor ${idTutor}.`);
    
    // Si usas un modal de MUI, aquí pondrías la lógica de apertura y espera.
    // Para el entorno, asumimos continuar (deberías implementar tu modal de confirmación).
    const confirmar = true; 

    if (confirmar) {
      try {
        const response = await fetch(`http://localhost:4000/tutor/${idTutor}`, { method: "DELETE" });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error al deshabilitar: ${errorData.message || response.statusText}`);
        }
        
        // Actualiza el estado localmente
        setTutor((prevTemas) => 
          prevTemas.map((t) => t.id_tema === idTutor ? { ...t, estado: 'Deshabilitado' } : t)
        );
        console.log(`Paso 2: Tema ${idTutor} deshabilitado correctamente.`);

      } catch (error) {
        console.error("Error al deshabilitar Tutor:", error);
        // Mostrar mensaje de error en la UI (aquí solo logeamos)
      }
    }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadTutor(); 
  }, []);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#121212",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <UsuarioNav context="tutor"/> 
      <Typography
        variant="h4"
        align="center"
        style={{ color: "white", margin: "1rem 0", flexShrink: 0 }}
      >
        Lista de Tutores
      </Typography>

      <TableContainer
        component={Paper}
        style={{
          backgroundColor: "#1e272e",
          width: "100%",
          height: "100%",
          borderRadius: 0,
          margin: 0,
          boxShadow: "none",
          flexGrow: 1,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["ID_Tutor", "ID_Usuario", "Nombre", "Paterno", "Materno", "Correo", "Rol", "Celular", "F. Nacimiento", "F. Registro","Curriculum","Estado", "Acciones"].map((columna) => (
                <TableCell
                  key={columna}
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderBottom: "2px solid #2f3640",
                    backgroundColor: "#1e272e",
                  }}
                >
                  {columna}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tutor.map((t) => (
              <TableRow key={t.id_tema}>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.id_tutor}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.id_usuario}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.nombre}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.paterno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.materno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.correo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.rol}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.celular}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.fecha_naci}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.fecha_registro}</TableCell>
                

                {/* Mostrar contenido como lista de archivos */}
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {/* Verificamos que sea un array y no esté vacío */}
                  {Array.isArray(t.cv) && t.cv.length > 0 ? (
                    <List dense sx={{ textAlign: 'left', p: 0 }}>
                      {t.contenido.map((item, index) => {
                        
                        // Si el ítem es solo el nombre del archivo, construimos la URL completa.
                        // Si ya contiene '://' (es una URL completa), la usamos directamente.
                        const url = item.includes('://') ? item : `${BASE_URL}${item}`;
                        
                        // El nombre del archivo es la última parte de la URL o el ítem mismo.
                        const fileName = item.split('/').pop();

                        return (
                          <ListItem key={index} style={{ display: "block", padding: "2px 0" }}>
                            <Link href={url} target="_blank" rel="noopener" sx={{ color: "#1e90ff", wordBreak: 'break-word' }}>
                              {fileName}
                            </Link>
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <span>No hay archivos</span>
                  )}
                </TableCell>

                <TableCell style={{ color: "white", textAlign: "center" }}>{t.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => navigate(`/tutor/${t.id_tutor}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(t.id_tutor)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Tutor;

