import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Alert, AlertTitle, TextField } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { SesionContext } from "../../../context/SesionContext";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const ModalLogin = () => {
	const { sesion, setSesionI } = React.useContext(SesionContext);
	const [open, setOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [showAlert, setShowAlert] = React.useState({
		show: false,
		title: "",
		descripcion: "asdf",
	});
	const [correo, setCorreo] = React.useState("");
	const [password, setPassword] = React.useState("");
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const iniciarSesion = () => {
		const url = `http://localhost:4000/usuario/login`;
		const sesion = {
			correo,
			password,
		};
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const raw = JSON.stringify(sesion);
		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow",
		};
		setIsLoading(true);
		fetch(url, requestOptions)
			.then((response) => {
				if (response.status === 401) {
					setShowAlert({
						descripcion: "Usuario o contraseña incorrecta",
						title: "Error al iniciar sesion",
						show: true,
					});
				} else if (response.status === 200) {
					setShowAlert({
						descripcion: "",
						title: "",
						show: false,
					});
					return response.json();
				} else {
					setShowAlert({
						descripcion: "Ocurrio un error con el servidor",
						title: "Error",
						show: true,
					});
				}
			})
			.then((result) => {
				localStorage.setItem("x-token", result.token);
				const decode = jwtDecode(result.token);
				const data = decode.data;
				setSesionI({
					rol: data.rol,
					username: data.username,
					id: data.id,
				});
				setOpen(false);
			})
			.catch((error) => {
				setShowAlert({
					descripcion: "error :" + error.message,
					title: "Error",
					show: true,
				});
			})
			.finally(() => setIsLoading(false));
	};
	return (
		<>
			<Button
				variant="outlined"
				size="large"
				sx={{
					color: "#ff9800",
					borderColor: "#ff9800",
					borderRadius: "8px",
					textTransform: "none",
				}}
				onClick={handleOpen}
			>
				Iniciar Sesión
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						className="text-black"
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						INICIAR SESION
					</Typography>
					<div className="grid mt-2">
						<TextField
							id="input-correo"
							label="Correo"
							variant="outlined"
							color="info"
							onChange={(event) => {
								setCorreo(event.target.value);
							}}
						/>
						<TextField
							id="input-password"
							className="mt-32"
							label="Password"
							type="password"
							variant="outlined"
							onChange={(event) => {
								setPassword(event.target.value);
							}}
						/>
					</div>
					{showAlert.show ? (
						<Alert severity="error">
							<AlertTitle>{showAlert.title}</AlertTitle>
							{showAlert.descripcion}
						</Alert>
					) : (
						<></>
					)}
					<div className="mt-5">
						<Button
							className="mt-5"
							color="primary"
							variant="contained"
							onClick={iniciarSesion}
							loading={isLoading}
						>
							Iniciar sesion
						</Button>
					</div>
				</Box>
			</Modal>
		</>
	);
};

export default ModalLogin;
