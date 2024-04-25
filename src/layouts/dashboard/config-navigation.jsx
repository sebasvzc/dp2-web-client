import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

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
        path: '/user',
        icon: icon('ic_tienda'),
      },
      // Otras opciones de submenú...
    ],
  }

];

export default navConfig;
