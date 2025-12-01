import { jwtDecode } from "jwt-decode";

const GetSesion = () => {
	try {
		const token = localStorage.getItem("x-token");
		if (!token) return null;

		const decode = jwtDecode(token);
		const data = decode.data;
		return {
			rol: data.rol,
			username: data.username,
			id: data.id,
			id_usuario: data.id_usuario,
		};
	} catch (error) {
		console.log("error al obtener sesion:", error);
	}
};
export default GetSesion;
