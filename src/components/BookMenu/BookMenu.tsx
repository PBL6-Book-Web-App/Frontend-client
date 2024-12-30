import React, { useEffect, useState } from "react";
import {
	Box,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface BookMenuProps {
	onFilterChange: (filter: string) => void;
	onSearchChange: (searchTerm: string) => void;
}

const BookMenu = ({ onFilterChange, onSearchChange }: BookMenuProps) => {
	const [filter, setFilter] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState<string>("");
	const accessToken = useSelector((state: RootState) => state.auth.accessToken);

	const debounceSearch = useDebounce({
		value: searchTerm,
		ms: 800,
	});

	useEffect(() => {
		onSearchChange(searchTerm);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceSearch]);

	const handleFilterChange = (
		event: React.MouseEvent<HTMLElement>,
		newFilter: string
	) => {
		setFilter(newFilter);
		onFilterChange(newFilter);
	};

	return (
		<Box>
			<Typography variant="h5" paddingBottom={2}>
				Filter:
			</Typography>
			<Box display={"flex"} justifyContent={"space-between"}>
				<ToggleButtonGroup
					defaultValue={"all"}
					value={filter}
					exclusive
					onChange={handleFilterChange}
				>
					<ToggleButton value="all">All Books</ToggleButton>
					{accessToken && (
						<ToggleButton value="voted">Voted Books</ToggleButton>
					)}
				</ToggleButtonGroup>
				<TextField
					label="Search Books"
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
				/>
			</Box>
		</Box>
	);
};

export default BookMenu;
