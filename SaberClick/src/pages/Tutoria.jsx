import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
} from "@mui/material";

function Tutoria() {
  const [tutoria, setTutoria] = useState([]);
  const navigate = useNavigate();

  const handleAddPregunta = async (tuto) => {
    // 1. Obtener los datos necesarios de la tutoría
    const { nombre_tutoria, id_institucion } = tuto;
    let nombre_institucion = "Desconocido"; // Valor por defecto

    try {
        // 2. Llamada al backend para obtener la Institución por su ID
        const res = await fetch(`http://localhost:4000/institucion/${id_institucion}`);
        
        if (res.ok) {
            const instData = await res.json();
            // 3. Asumimos que el JSON de la institución tiene un campo 'nombre_institucion'
            nombre_institucion = instData.nombre_institucion; 
        } else {
            console.error(`Error al buscar institución ${id_institucion}:`, res.statusText);
        }

    } catch (error) {
        console.error("Error en la petición a la institución:", error);
    }
    
    // 4. Navegar al formulario de pregunta, pasando todos los datos
    navigate(`/usuarios/new/Pregunta`, {
        state: { 
            tutoriaData: { 
                nombre_tutoria: nombre_tutoria,
                nombre_institucion: nombre_institucion, // <-- ¡Este es el dato autocompletado!
                id_institucion: id_institucion, // Opcional, pero útil si lo necesitas
            }
        } 
    });
  };

    const handleAddParalelo = async (tuto) => {
    // 1. Obtener los datos necesarios de la tutoría
    const { nombre_tutoria, id_institucion } = tuto;
    let nombre_institucion = "Desconocido"; // Valor por defecto

    try {
        // 2. Llamada al backend para obtener la Institución por su ID
        const res = await fetch(`http://localhost:4000/institucion/${id_institucion}`);
        
        if (res.ok) {
            const instData = await res.json();
            // 3. Asumimos que el JSON de la institución tiene un campo 'nombre_institucion'
            nombre_institucion = instData.nombre_institucion; 
        } else {
            console.error(`Error al buscar institución ${id_institucion}:`, res.statusText);
        }

    } catch (error) {
        console.error("Error en la petición a la institución:", error);
    }
    
    // 4. Navegar al formulario de pregunta, pasando todos los datos
    navigate(`/usuarios/new/Paralelo`, {
        state: { 
            tutoriaData: { 
                nombre_tutoria: nombre_tutoria,
                nombre_institucion: nombre_institucion, // <-- ¡Este es el dato autocompletado!
                id_institucion: id_institucion, // Opcional, pero útil si lo necesitas
            }
        } 
    });
  };

     const handleAddTema = async (tuto) => {
    // 1. Obtener los datos necesarios de la tutoría
    const { nombre_tutoria, id_institucion } = tuto;
    let nombre_institucion = "Desconocido"; // Valor por defecto

    try {
        // 2. Llamada al backend para obtener la Institución por su ID
        const res = await fetch(`http://localhost:4000/institucion/${id_institucion}`);
        
        if (res.ok) {
            const instData = await res.json();
            // 3. Asumimos que el JSON de la institución tiene un campo 'nombre_institucion'
            nombre_institucion = instData.nombre_institucion; 
        } else {
            console.error(`Error al buscar institución ${id_institucion}:`, res.statusText);
        }

    } catch (error) {
        console.error("Error en la petición a la institución:", error);
    }
    
    // 4. Navegar al formulario de pregunta, pasando todos los datos
    navigate(`/usuarios/new/Tema`, {
        state: { 
            tutoriaData: { 
                nombre_tutoria: nombre_tutoria,
                nombre_institucion: nombre_institucion, // <-- ¡Este es el dato autocompletado!
                id_institucion: id_institucion, // Opcional, pero útil si lo necesitas
            }
        } 
    });
  };

  const loadGerente = async () => {
    try {
      const response = await fetch("http://localhost:4000/tutoria");
      const data = await response.json();
      setTutoria(data); 
    } catch (error) {
      console.error("Error al cargar Tutoria:", error);
    }
  };


  // Eliminación (Deshabilitación) 
  const handleEliminar = async (idTutoria) => {
    
      const confirmar = window.confirm("¿Seguro que deseas DESHABILITAR esta tutoria? Su estado se cambiará a 'Deshabilitado'.");
      
      if (confirmar) {
        try {
          const response = await fetch(`http://localhost:4000/tutoria/${idTutoria}`, { 
              method: "DELETE" 
          });

          if (!response.ok) {
              throw new Error(`Error al deshabilitar: ${response.statusText}`);
          }
          
          setTutoria((prevTutoria) => 
              prevTutoria.map((tuto) => {
                  if (tuto.id_Tutoria === idTutoria) {
                      return { ...tuto, estado: 'Deshabilitado' };
                  }
                  return tuto;
              })
          );
        } catch (error) {
          console.error("Error al deshabilitar Tutoria:", error);
          alert("Ocurrió un error al intentar deshabilitar tutoria.");
        }
      }
  };


  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadGerente(); 
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
      <UsuarioNav context="tutoria"/> 
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Tutorias
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
              {[
                "ID_Tutoria", "ID_Institucion", "Nombre", "Descripcion", "Costo", "Estado", "Acciones",
              ].map((columna) => (
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
            {tutoria.map((tuto) => (
              <TableRow key={tuto.id_tutoria}>
                {/* ... (Celdas de la tabla) ... */}
                <TableCell style={{ color: "white", textAlign: "center" }}>{tuto.id_tutoria}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{tuto.id_institucion}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{tuto.nombre_tutoria}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{tuto.descripcion}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{tuto.costo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{tuto.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    // OPCIONAL: Usar handleEditar o directamente navigate
                    onClick={() => navigate(`/tutoria/${tuto.id_tutoria}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(tuto.id_tutoria)}
                  >
                    Eliminar
                  </Button>

                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                   onClick={() => handleAddParalelo(tuto)

                   }
                  >
                    Add Paralelo
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => handleAddTema(tuto)}
                  >
                    Add Tema
                  </Button>

                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    // 🎯 Llamamos a la nueva función que busca el nombre y navega
                    onClick={() => handleAddPregunta(tuto)}
                  >
                    Add Pregunta
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

export default Tutoria;