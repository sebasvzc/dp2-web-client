import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import obtenerCupones  from 'src/_mock/cupon';

import Iconify from 'src/components/iconify';


  const useStyles = makeStyles((theme) => ({
    hideNavigationButton: {
      display: 'none !important', // Oculta el botón de navegación
    },
    paginationContainer: {

      display: "inline-block"
    },
    centeredPagination: {
      margin: 'auto', // Centra horizontalmente el componente
      maxWidth: 'fit-content', // Ajusta el ancho al contenido
    },
  }));
  // ----------------------------------------------------------------------
  const scrollContainerStyle = {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 470px)',
    paddingRight: '0.1%',
    boxSizing: 'border-box', // Añade esta propiedad para incluir el padding en el ancho total
  };
  export default function CuponNew() {
    const [order, setOrder] = useState('asc');
    const [searchName, setSearchName] = useState("all");
    const [userData, setCuponData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [habilitarCupones, setHabilitarCupones] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [orderBy, setOrderBy] = useState('id');
    const [backgroundBtnHabilitar, setBackgroundBtnHabilitar] = useState("#CCCCCC");
    const [backgroundBtnDeshabilitar, setBackgroundBtnDeshabilitar] = useState("#CCCCCC");
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);


    if (error) {
      return <div>Error al cargar datos de cupones</div>; // Manejar errores de obtención de datos
    }
    return (
      
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }} >
        <div>
      <h1>Crea un nuevo cupón</h1>
      {/* Otro contenido de la página de creación de cupón */}
    </div>
      </Container>
    );
  }