  import { useState, useEffect } from 'react';
  import { toast } from 'react-toastify';
  import TableRow from '@mui/material/TableRow';
  import TableCell from '@mui/material/TableCell';
  import Grid from '@mui/material/Grid';
  import Card from '@mui/material/Card';
  import Box from '@mui/material/Box';
  import CircularProgress from '@mui/material/CircularProgress';
  import NewScrollbar from 'src/components/scrollbar';
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


  import TableNoData from '../table-no-data';
  import UserTableRow from '../user-table-row';
  import UserTableHead from '../user-table-head';
  import UserTableToolbar from '../user-table-toolbar';
  import {  applyFilter, getComparator } from '../utils';
  import { useAuth } from '../../../utils/AuthContext';


  // ----------------------------------------------------------------------
  const scrollContainerStyle = {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 470px)',
    paddingRight: '5%',
    boxSizing: 'border-box', // Añade esta propiedad para incluir el padding en el ancho total
  };
  export default function UserView() {
    const [order, setOrder] = useState('asc');
    const [searchName, setSearchName] = useState("all");
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [habilitarUsuarios, setHabilitarUsuarios] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [orderBy, setOrderBy] = useState('id');

    const [filterName, setFilterName] = useState('');
    const {user, loginUser} = useAuth()
    const [totalUsers, setTotalUsers] = useState(10);
  // Llama a la función obtenerUsuarios para obtener y mostrar los datos de usuarios
    useEffect(() => {

    const fetchData = async () => {
        try {
          const data = await obtenerUsuarios(page+1,pageSize,searchName); // Obtener los datos de usuarios
          console.log(data.users)
          if(data.newToken){
            const storedUser = localStorage.getItem('user');
            const userX = JSON.parse(storedUser);
            userX.token = data.newToken;
            localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
            console.log("He puesto un nuevo token");
          }
          if(data.totalUsers){
            setTotalUsers(data.totalUsers);
          }
          setUserData(data.users); // Actualizar el estado con los datos obtenidos
          setLoading(false); // Indicar que la carga ha finalizado

        } catch (err) {
          setError(err); // Manejar errores de obtención de datos
          setLoading(false); // Indicar que la carga ha finalizado (incluso en caso de error)
        }
      };

      fetchData(); // Llamar a la función para obtener los datos al montar el componente
    }, [page, pageSize,totalUsers, habilitarUsuarios,searchName]);

    const [rowsPerPage, setRowsPerPage] = useState(8);

    const [openModal, setOpenModal] = useState(false);
    const [openModalDesactivar, setOpenModalDesactivar] = useState(false);
    const [openModalActivar, setOpenModalActivar] = useState(false);
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
    const handleDeshabilitar = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/deshabilitar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ selected }),
        });

        const data = await response.json();

        console.log(data); // Maneja la respuesta de la API según sea necesario
        setOpenModalDesactivar(false);
        setHabilitarUsuarios(!habilitarUsuarios);
        toast.success('Usuario deshabilitado exitosamente', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        // handleCloseModal(); // Cierra el modal después de enviar
      } catch (e) {
        console.error('Error al deshabilitar usuarios:', e);
      }
    };
    const handleHabilitar = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/habilitar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ selected }),
        });
        const data = await response.json();
        console.log(data); // Maneja la respuesta de la API según sea necesario
        setHabilitarUsuarios(!habilitarUsuarios);
        setOpenModalActivar(false);
        toast.success('Usuario habilitado exitosamente', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        // handleCloseModal(); // Cierra el modal después de enviar
      } catch (e) {
        console.error('Error al habilitar usuarios:', e);
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


    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = userData.map((n) => n.id);
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
      console.log("new page", newPage)
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setPage(0);
      setPageSize(parseInt(event.target.value, 10));
    };

    const handleSearch = (e) => {
      setSearchName(e)
      // setPage(0);
      console.log(e);
    };
    const handleOpenModalDesactivar = () => {
      setOpenModalDesactivar(true);
    };
    const handleCloseModalDesactivar = () => {
      console.log("desactivar")
      setOpenModalDesactivar(false);
    };
    const handleOpenModalActivar = () => {
      setOpenModalActivar(true);
    };
    const handleCloseModalActivar = () => {
      console.log("desactivar")
      setOpenModalActivar(false);
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
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '25%',
            marginTop: '15%', // Ajusta la distancia desde la parte superior
          }}
        >
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return <div>Error al cargar datos de usuarios</div>; // Manejar errores de obtención de datos
    }
    return (
      <Container>
        <Typography variant="h2">Gestión de Usuarios</Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0}>

          <UserTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleSearch}
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
            <Dialog open={openModalDesactivar} onClose={handleCloseModalDesactivar} >
              <DialogTitle sx={{ alignItems: 'center',textAlign:'center'}}>¿Estás seguro de que deseas deshabilitar el usuario seleccionado?</DialogTitle>

              <DialogActions sx={{ alignSelf: 'center',textAlign:'center'}}>
                <Button onClick={handleDeshabilitar} sx={{ backgroundColor: '#DFE0E0', color:"black" }}>
                  Sí
                </Button>
                <Button onClick={handleCloseModalDesactivar} sx={{ backgroundColor: '#DFE0E0', color:"black" }}>
                  No
                </Button>

              </DialogActions>
            </Dialog>
            <Dialog open={openModalActivar} onClose={handleCloseModalActivar}  sx={{ alignItems: 'center'}}>
              <DialogTitle>¿Estás seguro de que deseas habilitar el usuario seleccionado?</DialogTitle>

              <DialogActions sx={{ alignSelf: 'center',textAlign:'center'}}>
                <Button onClick={handleHabilitar} sx={{ backgroundColor: '#DFE0E0', color:"black" }}>
                  Sí
                </Button>
                <Button onClick={handleCloseModalActivar} sx={{ backgroundColor: '#DFE0E0', color:"black" }}>
                  No
                </Button>

              </DialogActions>
            </Dialog>
            <Button variant="contained"  sx={{ marginRight: '8px' , backgroundColor: '#DFE0E0', color:"black" }}  onClick={handleOpenModalDesactivar}>
              Deshabilitar
            </Button>
            <Button variant="contained"  sx={{ backgroundColor: '#DFE0E0', color:"black" }} onClick={handleOpenModalActivar}>
              Habilitar
            </Button>
          </Stack>

        </Stack>
        <UserTableHead
          order={order}
          orderBy={orderBy}
          rowCount={userData.length}
          numSelected={selected.length}
          onRequestSort={handleSort}
          onSelectAllClick={handleSelectAllClick}
          headLabel={[

            { id: '' },
          ]}
        />
        <Box sx={scrollContainerStyle}>
          <Grid container spacing={3}>
            {userData && userData.length > 0 ? (
              userData.map((row) => (
                <Grid item xs={12} sm={6} md={4} key={row.id}>
                  <Card>
                    <UserTableRow
                      nombre={row.nombre}
                      rol={row.rol}
                      emailX={row.email}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      activo={row.activo}
                    />
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" align="center" sx={{ marginTop: '20px' }}>
                No hay datos disponibles
              </Typography>
            )}
          </Grid>
      </Box>
        <TablePagination
          page={page}
          component="div"
          count={totalUsers}
          rowsPerPage={pageSize}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[6, 12, 18]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Usuarios por página"
        />
      </Container>
    );
  }
