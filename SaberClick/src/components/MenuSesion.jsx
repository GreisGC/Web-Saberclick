import {
	Button,
	ClickAwayListener,
	Grow,
	MenuItem,
	MenuList,
	Paper,
	Popper,
} from "@mui/material";
import React, { useContext } from "react";
import { SesionContext } from "../context/SesionContext";
import { useNavigate } from "react-router-dom";

const menuAdmin = [
	{
		url: "/administrador",
		nombre: "administrador",
	},
	{
		url: "/usuarios",
		nombre: "Usuarios",
	},
	{
		url: "/estudiante",
		nombre: "Estudiante",
	},
	{
		url: "/gerente",
		nombre: "Gerente",
	},
	{
		url: "/institucion",
		nombre: "Institucion",
	},
	{
		url: "/tutoria",
		nombre: "Tutoria",
	},
	{
		url: "/tema",
		nombre: "Tema",
	},
	{
		url: "/paralelo",
		nombre: "Paralelo",
	},
	{
		url: "/pregunta",
		nombre: "Pregunta",
	},
	{
		url: "/opcion",
		nombre: "Opcion",
	},
	{
		url: "/inscripcion",
		nombre: "Inscripcion",
	},
];

const menuGerente = [
	{
		url: "/institucion",
		nombre: "Institucion",
	},
	{
		url: "/tutoria",
		nombre: "Tutoria",
	},
	{
		url: "/paralelo",
		nombre: "Paralelo",
	},
	{
		url: "/pregunta",
		nombre: "Pregunta",
	},
	{
		url: "/opcion",
		nombre: "Opcion",
	},
];

const menuEstudiante = [
	{
		url: "/inscripcion",
		nombre: "Inscripcion",
	},
];

const menuTutor = [
	{
		url: "/paralelo",
		nombre: "Paralelo",
	},
	{
		url: "/tema",
		nombre: "Tema",
	},
	{
		url: "/pregunta",
		nombre: "Pregunta",
	},
	{
		url: "/opcion",
		nombre: "Opcion",
	},
];

const MenuSesion = () => {
	const { sesion, setSesionI } = useContext(SesionContext);
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);
	const navigate = useNavigate();

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		localStorage.removeItem("x-token");
		setSesionI(null);

		setOpen(false);
	};

	const handleClose2 = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}


		setOpen(false);
	};

	function handleListKeyDown(event) {
		if (event.key === "Tab") {
			event.preventDefault();
			setOpen(false);
		} else if (event.key === "Escape") {
			setOpen(false);
		}
	}

	function selectRol() {
		if (sesion.rol == "administrador") {
			return menuAdmin;
		}
		if (sesion.rol == "gerente") {
			return menuGerente;
		}
		if (sesion.rol == "tutor") {
			return menuTutor;
		}
		if (sesion.rol == "estudiante") {
			return menuEstudiante;
		}
		return [];
	}

	// return focus to the button when we transitioned from !open -> open
	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
		}

		prevOpen.current = open;
	}, [open]);
	return (
		<>
			<div>
				<Button
					ref={anchorRef}
					id="composition-button"
					aria-controls={open ? "composition-menu" : undefined}
					aria-expanded={open ? "true" : undefined}
					aria-haspopup="true"
					onClick={handleToggle}
				>
					{sesion.rol}
				</Button>
				<Popper
					open={open}
					anchorEl={anchorRef.current}
					role={undefined}
					placement="bottom-start"
					transition
					disablePortal
				>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin:
									placement === "bottom-start"
										? "left top"
										: "left bottom",
							}}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose2}>
									<MenuList
										autoFocusItem={open}
										id="composition-menu"
										aria-labelledby="composition-button"
										onKeyDown={handleListKeyDown}
									>
										{selectRol().map((val) => {
											return (
												<MenuItem
													key={val.nombre}
													onClick={() => {
														navigate(val.url);
													}}
												>
													{val.nombre}
												</MenuItem>
											);
										})}
										<MenuItem
											onClick={handleClose}
											className="text-red-700"
										>
											<p className="text-red-500">
												Cerrar sesion
											</p>
										</MenuItem>
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</div>
		</>
	);
};

export default MenuSesion;
