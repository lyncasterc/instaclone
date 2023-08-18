import { Group } from '@mantine/core';
import { BrandMessenger } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
// import useStyles from './HomeNavbar.styles';
import baseStyles from '../../../../common/components/Navbars/mobile-nav-styles';
import NavbarBrand from '../../../../common/components/Navbars/NavbarBrand/NavbarBrand';

function HomeNavbar() {
  // const { classes } = useStyles();
  const { classes: baseClasses } = baseStyles();

  return (
    <Group
      position="apart"
      className={`${baseClasses.baseStyles}`}
      data-testid="home-nav"
    >
      <NavbarBrand />

      <Link
        to="/"
      >
        <BrandMessenger
          size={30}
          strokeWidth={1.5}
          color="black"
        />
      </Link>
    </Group>
  );
}

export default HomeNavbar;
