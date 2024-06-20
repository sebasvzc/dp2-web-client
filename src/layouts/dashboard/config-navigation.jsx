import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Collapse, Modal, Typography, Button,IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SvgColor from 'src/components/svg-color';
import BasicBreadcrumbs from '../../routes/BasicBreadcrumbs'; // Ruta corregida
import { usePathname } from '../../routes/hooks';
import { useAuth } from '../../utils/AuthContext';

// ----------------------------------------------------------------------

function NavItem({ item, handleOpenQR }) {
  const pathname = usePathname();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const active = item.path === pathname;
  
  const handleClick = () => {
    if (item.title === 'Ver QR') {
      handleOpenQR();
    } else if (item.onClick) {
      item.onClick(); // Llama al onClick específico del ítem, si existe
    } else if (item.subMenu) {
      setOpen(!open);
    } else {
      navigate(item.path);
    }
  };
  
  return (
    <>
      <ListItemButton onClick={handleClick} sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        color:"white",
        ...(item.path === usePathname() && {
          color: 'white',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}>
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          {item.icon}
        </Box>
        <Box component="span">{item.title}</Box>
        {item.subMenu && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      {item.subMenu && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
            {item.subMenu.map((subItem) => (
              <NavItem key={subItem.title} item={subItem} handleOpenQR={handleOpenQR} />
            ))}
          </Stack>
        </Collapse>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  handleOpenQR: PropTypes.func
};

export default function NavBar() {
  const { logoutUser, getPermissions } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [openQR, setOpenQR] = useState(false);

  const handleOpenQR = () => setOpenQR(true);
  const handleCloseQR = () => setOpenQR(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const perms = await getPermissions();
        console.log("Raw permissions:", perms);
        setPermissions(perms.permissions.map(perm => perm.permission.nombre));
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, [getPermissions]);

  const handleLogout = () => {
    console.log("cerrar sesion");
    logoutUser();
  };

  const icon = (name) => (
    <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  );

  const navConfig = [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
      permission: 'Dashboard',
    },
    {
      title: 'Gestión de Usuarios',
      path: '/user',
      icon: icon('ic_user'),
      permission: 'Gestion de Usuarios',
    },
    {
      title: 'Gestión de Cupones',
      path: '/cupon',
      icon: icon('ic_cupon'),
      permission: 'Gestion de Cupones',
    },
    {
      title: 'Gestión de Eventos',
      path: '/evento',
      icon: icon('ic_evento'),
      permission: 'Gestion de Eventos',
    },
    {
      title: 'Gestión de Clientes',
      path: '/clientes',
      icon: icon('ic_cliente'),
      permission: 'Gestion de Clientes',
    },
    {
      title: 'Gestión de Categorías',
      path: '/categorias',
      icon: icon('ic_categoria'),
      permission: 'Gestion de Categorías',
    },
    {
      title: 'Gestión de Tiendas',
      path: '/tienda',
      icon: icon('ic_tienda'),
      permission: 'Gestion de Tiendas',
    },
    {
      title: 'Gestión de Notificaciones',
      path: '/notificacion',
      icon: icon('ic_notificacion'),
    },
    {
      title: 'Ver QR',
      path: '/verqr',
      icon: icon('ic_qr'),
    },
    {
      title: 'Cerrar sesión',
      icon: <ExitToAppIcon />,
      onClick: () => handleLogout(),
    },
  ];

  const filteredNavConfig = navConfig.filter(item =>
    !item.permission || permissions.includes(item.permission)
  );

  return (
    <>
      <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
        {filteredNavConfig.map((item) => (
          <NavItem key={item.title} item={item} handleOpenQR={handleOpenQR} />
        ))}
      </Stack>

      <Modal
        open={openQR}
        onClose={handleCloseQR}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...modalStyle, width: 400 }}>
        <IconButton
            aria-label="close"
            onClick={handleCloseQR}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Ver QR
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Aquí puedes ver tu QR.
          </Typography>
          <Button onClick={handleCloseQR}>Cerrar</Button>
        </Box>
      </Modal>
    </>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
