import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import Iconify from 'src/components/iconify';
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

function validarEmail(emailX) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(emailX);
}

function validarNombre(nombre) {
  const regexNombre = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
  return regexNombre.test(nombre);
}

export default function   ClientCupoTableRow({
                                        id,
                                        nombre,
                                        apellido,email,telefono,fechaCompra,selected,handleClick
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


        <TableCell>{nombre} {apellido}</TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{telefono}</TableCell>

        <TableCell>{formatDateTime(fechaCompra)}</TableCell>

      </TableRow>

      {/* Modal para editar usuario */}

    </>
  );
}

ClientCupoTableRow.propTypes = {
  id: PropTypes.number.isRequired,
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  telefono: PropTypes.string.isRequired,
  fechaCompra: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};