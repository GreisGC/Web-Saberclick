import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const SelectGerentes = ({ onSelect }) => {
	const [listGerentes, setListGerentes] = useState([]);
	const listarGerentes = () => {
		const requestOptions = {
			method: "GET",
			redirect: "follow",
		};

		fetch("http://localhost:4000/listarGerentes", requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				setListGerentes(result);
			})
			.catch((error) => console.error(error));
	};
	const handleChange = (event) => {
		onSelect(event.target.value);
	};
	useEffect(() => {
		listarGerentes();
	}, []);
	return (
		<>
			<Box sx={{ minWidth: 120 }}>
				<FormControl fullWidth color="info" className="text-white">
					<InputLabel id="demo-simple-select-label">
						Gerentes
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						label="Gerentes"
						onChange={handleChange}
					>
						{listGerentes.map((value, index) => {
							return (
								<MenuItem
									key={value.id_gerente}
									defaultValue={value}
									value={value}
								>{`${value.nombre} ${value.paterno} ${value.materno}`}</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			</Box>
		</>
	);
};

export default SelectGerentes;
