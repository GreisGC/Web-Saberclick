import React from "react";
import { Container, Grid, Divider, CssBaseline } from "@mui/material";
import HeaderParalelo from "../components/organismos/paralelo/HeaderParalelo";
import ParaleloHorario from "../components/organismos/paralelo/ParaleloHorario";
import TemasCard from "../components/organismos/paralelo/TemasCard";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

const ParaleloHome = () => {
   const location = useLocation();
   const { id, nombre, descripcion, costo } = location.state || {};
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
						<ParaleloHorario id_tutoria={id}/>
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
