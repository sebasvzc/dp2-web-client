import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
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

        paddingLeft: '0 !important',

      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1" style={{ color: "black" }}>
        {numSelected} {numSelected > 1 ? "seleccionados" : "seleccionado"}
      </Typography>
      ) : (
        <>
      <OutlinedInput
        value={localFilterName}
        onChange={handleInputChange}
        placeholder="Buscar usuario por nombre o por correo"
        style={{ width: 500, height: 40, backgroundColor: "white" }}
      />
      <Button
        onClick={handleIconClick}
        style={{ minWidth: 0, marginLeft: '8px', backgroundColor: '#003B91', color: 'white' }}
      >
        <Iconify icon="eva:search-fill" style={{ width: 20, height: 20 }} />
      </Button>
    </>
        
      )}

    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
