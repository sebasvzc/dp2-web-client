import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import React, { useState } from 'react';
// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName }) {



  const handleIconClick = () => {
    // Llamar a onFilterName con el valor actual de filterName
    // console.log(filterName)
    onFilterName(filterName);

  };
  const handleInputChange = (event) => {
    // Actualizar el estado local al cambiar el input
    // console.log(event.target.value);
    filterName=event.target.value;
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
        <Typography component="div" variant="subtitle1">
          {numSelected} {numSelected>1?"seleccionados":"seleccionado"}
        </Typography>
      ) : (
        <OutlinedInput

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
