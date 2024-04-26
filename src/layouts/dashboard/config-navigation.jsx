import SvgColor from 'src/components/svg-color';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Stack from '@mui/material/Stack';

import ListItemButton from '@mui/material/ListItemButton';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';



import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Collapse } from '@mui/material';
import PropTypes from 'prop-types';
import { usePathname } from '../../routes/hooks';
import { useAuth } from '../../utils/AuthContext';
// ----------------------------------------------------------------------


function NavItem({ item }) {
  const pathname = usePathname();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const active = item.path === pathname;
  const handleClick = () => {
    if (item.onClick) {
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
              <NavItem key={subItem.title} item={subItem} />
            ))}
          </Stack>
        </Collapse>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func
};



export default function NavBar() {
  const { logoutUser } = useAuth(); // Asegúrate de que tu hook useAuth proporcione la función logout

  const handleLogout = () => {
    console.log("cerrar sesion")
    logoutUser();
    // Llama a la función logout proporcionada por useAuth para cerrar sesión
  };

  const icon = (name) => (
    <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  );

  const navConfig = [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
    },

    {
      title: 'Mantenimiento',

      icon: icon('ic_config'),
      subMenu: [
        {
          title: 'Gestión de Usuarios',
          path: '/user',
          icon: icon('ic_user'),
        },
        {
          title: 'Gestión de Cupones',
          path: '/user',
          icon: icon('ic_cupon'),
        },
        {
          title: 'Gestión de Eventos',
          path: '/user',
          icon: icon('ic_evento'),
        },
        {
          title: 'Gestión de Clientes',
          path: '/user',
          icon: icon('ic_cliente'),
        },
        {
          title: 'Gestión de Categorías',
          path: '/user',
          icon: icon('ic_categoria'),
        },
        {
          title: 'Gestión de Tiendas',
          path: '/tienda',
          icon: icon('ic_tienda'),
        },
        // Otras opciones de submenú...
      ],
    },{
      title: 'Cerrar sesión',
      icon: <ExitToAppIcon />,
      onClick: () => handleLogout(), // Define la función handleLogout para cerrar sesión
    },

  ];
  return (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );
}

