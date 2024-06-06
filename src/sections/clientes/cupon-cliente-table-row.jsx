import { useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { makeStyles } from '@mui/styles';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';



// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    padding: "40px",
    backgroundColor: 'white', // Fondo blanco
    boxShadow: 24,
    outline: 'none',
  },
  activo: {
    color: '#008000', // Verde oscuro para activo
    backgroundColor: '#C8E6C9', // Fondo verde claro para activo
    padding: '2px 6px',
    borderRadius: '4px',
  },
  inactivo: {
    color: '#FF0000', // Rojo para inactivo
    backgroundColor: '#FFCDD2', // Fondo rojo claro para inactivo
    padding: '2px 6px',
    borderRadius: '4px',
  },
}));


export default function   CuponxClienteTableRow({
                                               id,
                                               codigo,
                                                  categoria,tienda,fechaCompra,fechaExpiracion,selected,handleClick
                                             }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();
  const formatDateTime = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('es-ES', options);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>


        <TableCell>{codigo} </TableCell>

        <TableCell>{categoria}</TableCell>
        <TableCell>{tienda}</TableCell>

        <TableCell>{formatDateTime(fechaCompra)}</TableCell>
        <TableCell>{formatDateTime(fechaExpiracion)}</TableCell>
      </TableRow>

      {/* Modal para editar usuario */}

    </>
  );
}

CuponxClienteTableRow.propTypes = {
  id: PropTypes.number.isRequired,
  codigo: PropTypes.string.isRequired,
  categoria: PropTypes.string.isRequired,
  tienda: PropTypes.string.isRequired,
  fechaCompra: PropTypes.string.isRequired,
  fechaExpiracion: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};