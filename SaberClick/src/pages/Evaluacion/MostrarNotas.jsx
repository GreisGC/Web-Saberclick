import {
	Box,
	Button,
	CardActions,
	CardContent,
	Typography,
} from "@mui/material";
import ViewEvaluacion from "./ViewEvaluacion";

const MostrarNotas = ({
	id_inscripcion,
	fecha_inscripcion,
	hora_inscripcion,
	nota1,
	nota2,
	nota3,
	intento1,
	intento2,
	intento3,
	id_tutoria,
	id_paralelo,
	id_estudiante,
	estado,
	id_institucion,
	onSendNota,
}) => {
	return (
		<>
			<Box sx={{ minWidth: 275 }}>
				<CardContent>
					<Typography variant="body2">
						{`Nota 1: ${nota1},\t intento: ${Number(intento1)}/3`}
						<br />
						{`Nota 2: ${nota2},\t intento: ${Number(intento2)}/3`}
						<br />
						{`Nota 3: ${nota3},\t intento: ${Number(intento3)}/3`}
					</Typography>
				</CardContent>
				<CardActions>
					<ViewEvaluacion
						id_institucion={id_institucion}
						id_tutoria={id_tutoria}
						onSendNota={onSendNota}
						id_inscripcion={id_inscripcion}
					/>
				</CardActions>
			</Box>
		</>
	);
};

export default MostrarNotas;
