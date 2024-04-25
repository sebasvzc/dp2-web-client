import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';


import obtenerUsuarios  from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import UserTableToolbar from '../user-table-toolbar';
import {  applyFilter, getComparator } from '../utils';
import { useAuth } from '../../../utils/AuthContext';


// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('userName');

  const [filterName, setFilterName] = useState('');
  const {user, loginUser} = useAuth()

// Llama a la función obtenerUsuarios para obtener y mostrar los datos de usuarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerUsuarios(); // Obtener los datos de usuarios
        console.log(data.users)
        if(data.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");

        }
        setUserData(data.users); // Actualizar el estado con los datos obtenidos
        setLoading(false); // Indicar que la carga ha finalizado
      } catch (err) {
        setError(err); // Manejar errores de obtención de datos
        setLoading(false); // Indicar que la carga ha finalizado (incluso en caso de error)
      }
    };

    fetchData(); // Llamar a la función para obtener los datos al montar el componente
  }, []);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const handleEnviar = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data); // Maneja la respuesta de la API según sea necesario
      if(data.success==="true"){
        console.log("entre a true")
        toast.success('Usuario invitado exitosamente a través de correo', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
      }
      handleCloseModal(); // Cierra el modal después de enviar
    } catch (e) {
      console.error('Error al enviar correo electrónico:', e);
    }
  };
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    console.log("Este es el id que ordena")
    console.log(id)
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };
  const dataFiltered = applyFilter({
    inputData: userData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userData.map((n) => n.userName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    console.log("newSelected");
    console.log(newSelected);
    console.log(typeof newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const notFound = !userData.length && !!filterName;
  if (loading) {
    return <div>Cargando...</div>; // Mostrar un indicador de carga mientras se obtienen los datos
  }

  if (error) {
    return <div>Error al cargar datos de usuarios</div>; // Manejar errores de obtención de datos
  }
  return (
    <Container>
      <Typography variant="h2">Gestión de Usuarios</Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          />
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="inherit" sx={{ marginRight: '8px' }} onClick={handleOpenModal}>
            + Invitar
          </Button>
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Invitar usuario</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Correo electrónico"
                type="email"
                fullWidth
                value={email}
                onChange={handleEmailChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleEnviar} color="primary">
                Enviar
              </Button>
            </DialogActions>
          </Dialog>
          <Button variant="contained" color="inherit" sx={{ marginRight: '8px' }}>
            Deshabilitar
          </Button>
          <Button variant="contained" color="inherit" >
            Habilitar
          </Button>
        </Stack>
      </Stack>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={userData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[

                  { id: 'userName', label: 'User' },
                  { id: 'role', label: 'Role' },
                  { id: 'email', label: 'Email'},
                  { id: '' },
                ]}
              />
              <TableBody>
                {userData && userData.length > 0 ? (
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        nombre={row.nombre}
                        rol={row.rol}
                        emailX={row.email}
                        selected={selected.indexOf(row.nombre) !== -1}
                        handleClick={(event) => handleClick(event, row.nombre)}
                      />
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>No hay datos disponibles</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={userData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </Card>
    </Container>
  );
}
