import { Button, CardActions, CardContent, Typography } from "@mui/material";

const CardNotas = ({
	nota1,
	nota2,
	nota3,
	intento1,
	intento2,
	intento3,
	onUpdate,
}) => {
	return (
		<>
			<CardContent>
				<Typography variant="h5" component="div">
					Datos de su inscripcion
				</Typography>
				<Typography sx={{ color: "text.secondary", mb: 1.5 }}>
					Nota 1:{` ${nota1 ?? 0} \t intento1: ${intento1 ?? 0}`}
				</Typography>
				<Typography sx={{ color: "text.secondary", mb: 1.5 }}>
					Nota 2: {` ${nota2 ?? 0} \t intento2: ${intento2 ?? 0}`}
				</Typography>
				<Typography sx={{ color: "text.secondary", mb: 1.5 }}>
					Nota 3: {` ${nota3 ?? 0} \t intento3: ${intento3 ?? 0}`}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" onClick={onUpdate}>
					Actualizar{" "}
				</Button>
			</CardActions>
		</>
	);
};

export default CardNotas;
