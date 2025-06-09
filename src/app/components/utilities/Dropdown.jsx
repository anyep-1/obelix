import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

const Dropdown = ({ options, value, onChange, placeholder = "Pilih opsi" }) => {
  return (
    <FormControl variant="outlined" size="small" className="mt-4 w-48">
      <InputLabel id="dropdown-label">{placeholder}</InputLabel>
      <Select
        labelId="dropdown-label"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={placeholder}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
