import { useEffect, useState } from "react";
import Menu from './UsuarioNav';
import Navbar from "../components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box, // Añadido Box para una mejor estructura
} from "@mui/material";


const formatDate = (dateString) => {
    if (!dateString) return "";
  
    return dateString.substring(0, 10);
};


function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  // Obtener usuarios
  const loadUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:4000/usuario");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Eliminar usuario
  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (confirmar) {
      try {
        await fetch(`http://localhost:4000/usuario/${id}`, { method: "DELETE" });
        setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id));
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  // Editar usuario
  const handleEditar = (id) => {
    console.log("Editar usuario con ID:", id);
  };

  useEffect(() => {
    
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadUsuarios();
  }, []);

  
  const PRIMARY_BLUE = "#1976d2";
  const DARK_BACKGROUND = "#121212";
  const CARD_BACKGROUND = "#212121"; 
  const HEADER_BACKGROUND = "#1e272e";
  const LIGHT_TEXT = "#e0e0e0";
  const ALT_ROW_COLOR = "#2a333a"; 
  // --- Fin Estilos de diseño ---

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: DARK_BACKGROUND,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 100 }}>
                      <Navbar />
      </Box>
      <Menu/>
      
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: PRIMARY_BLUE,
          margin: "2rem 0 1rem",
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        Lista de Usuarios
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: CARD_BACKGROUND,
          width: { xs: '95%', md: '90%' },
          margin: '0 auto',
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          flexGrow: 1, 
          maxHeight: 'calc(100vh - 200px)', 
          marginBottom: '2rem',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "ID",
                "Nombre",
                "Paterno",
                "Materno",
                "Correo",
                "Rol",
                "Celular",
                "F. Nacimiento",
                "F. Registro",
                "Estado",
                "Password",
                "Acciones",
              ].map((columna) => (
                <TableCell
                  key={columna}
                  sx={{
                    color: PRIMARY_BLUE,
                    fontWeight: "900",
                    textAlign: "center",
                    borderBottom: "2px solid " + HEADER_BACKGROUND,
                    backgroundColor: HEADER_BACKGROUND,
                    fontSize: '0.9rem',
                    py: 1.5,
                  }}
                >
                  {columna}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow 
                key={usuario.id_usuario}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: CARD_BACKGROUND },
                  '&:nth-of-type(even)': { backgroundColor: ALT_ROW_COLOR },
                  '&:hover': { backgroundColor: PRIMARY_BLUE + '30' },
                }}
              >
                <TableCell sx={{ color: LIGHT_TEXT, textAlign: "center", fontWeight: 'bold' }}>
                  {usuario.id_usuario}
                </TableCell>
                <TableCell sx={{ color: LIGHT_TEXT, textAlign: "center" }}>
                  {usuario.nombre}
                </TableCell>
                <TableCell sx={{ color: LIGHT_TEXT, textAlign: "center" }}>
                  {usuario.paterno}
                </TableCell>
                <TableCell sx={{ color: LIGHT_TEXT, textAlign: "center" }}>
                  {usuario.materno}
                </TableCell>
                <TableCell sx={{ color: LIGHT_TEXT, textAlign: "center", fontSize: '0.85rem' }}>
                  {usuario.correo}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                   <Typography 
                    variant="caption"
                    sx={{
                      backgroundColor: usuario.rol === 'admin' ? PRIMARY_BLUE + '50' : '#ff980050',
                      color: LIGHT_TEXT,
                      borderRadius: '4px',
                      px: 1,
                      py: 0.5,
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}
                  >
                    {usuario.rol}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: LIGHT_TEXT, textAlign: "center" }}>
                  {usuario.celular}
                </TableCell>
                
                {/* ⭐️ CAMBIO 1: Aplicar formato a Fecha de Nacimiento ⭐️ */}
                <TableCell sx={{ color: LIGHT_TEXT, textAlign: "center" }}>
                  {formatDate(usuario.fecha_naci)}
                </TableCell>
                
                {/* ⭐️ CAMBIO 2: Aplicar formato a Fecha de Registro ⭐️ */}
                <TableCell sx={{ color: LIGHT_TEXT, textAlign: "center" }}>
                  {formatDate(usuario.fecha_registro)}
                </TableCell>
                
                <TableCell sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      color: usuario.estado === 'activo' ? '#4caf50' : '#f44336', 
                      fontWeight: 'bold',
                    }}
                  >
                    {usuario.estado}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      color: usuario.estado === 'activo' ? '#4caf50' : '#f44336', 
                      fontWeight: 'bold',
                    }}
                  >
                    {usuario.password}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center", py: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleEditar(usuario.id_usuario)}
                      sx={{ mr: 1, bgcolor: PRIMARY_BLUE, '&:hover': { bgcolor: '#1565c0' } }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleEliminar(usuario.id_usuario)}
                      sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Usuarios;
