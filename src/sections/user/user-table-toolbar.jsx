import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import React, { useState, useEffect} from 'react';
// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName }) {

  const [localFilterName, setLocalFilterName] = useState(filterName);

  useEffect(() => {
    setLocalFilterName(filterName); // Actualiza el estado local cuando filterName cambia
  }, [filterName]);

  const handleIconClick = () => {
    onFilterName(localFilterName); // Llama a onFilterName con el valor actualizado
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setLocalFilterName(newValue); // Actualiza el estado local al cambiar el input
  };

  return (
    <Toolbar
      sx={{
        height: 120,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'F9FAFB',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1" style={{ color: "black" }}>
        {numSelected} {numSelected > 1 ? "seleccionados" : "seleccionado"}
      </Typography>
      ) : (
        <OutlinedInput
          value={localFilterName}
          onChange={handleInputChange}
          placeholder="Buscar usuario..."
          startAdornment={
            <InputAdornment position="left" onClick={handleIconClick}>
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 40, height: 20 }}
              />
            </InputAdornment>
          }
          sx={{  width: 600, height: 40, backgroundColor:"white" }}
        />
      )}

    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
