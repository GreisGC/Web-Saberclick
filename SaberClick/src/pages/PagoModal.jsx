import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function PagoModal() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    nombre_estudiante,
    nombre_tutoria,
    nombre_institucion,
    costo_tutoria,
  } = state || {};

  const handlePagar = () => {
    navigate("/ParaleloHome");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Centra horizontalmente
        alignItems: "center", // Centra verticalmente
        minHeight: "100vh", // Ocupa toda la altura de la ventana (viewport height)
        backgroundColor: "#f5f5f5", // Color de fondo opcional para diferenciar
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: "90%", // Hace que sea un poco responsive
          p: 2,
          borderRadius: 3,
          boxShadow: 8, // Aumento la sombra para un mejor efecto "flotante"
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom // Añade un margen inferior
          >
            💳 Pago del Curso
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            Nombre: **{nombre_estudiante}**
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Tutoría: **{nombre_tutoria}**
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Institución: **{nombre_institucion}**
          </Typography>
          <Typography
            variant="h6"
            color="primary"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            Costo: **{costo_tutoria} BS**
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Pago%20Curso"
              alt="QR de Pago"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "10px",
                border: "1px solid #ccc", // Borde para resaltar el QR
              }}
            />
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth // Hace que el botón ocupe todo el ancho de la tarjeta
              onClick={handlePagar}
            >
              Confirmar y Volver a Inicio
            </Button>
          </Box>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ mt: 2, color: "text.secondary" }} // Uso el color secundario del tema
          >
            ⚠️ Por favor, realiza el pago escaneando el código QR. Revisaremos tu
            pago en breve.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

