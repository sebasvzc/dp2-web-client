import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const NewScrollbar = styled(Box)`
  overflow-y: auto;
  max-height: calc(100vh - 200px); /* Ajusta la altura máxima según sea necesario */
`;

export default NewScrollbar;


