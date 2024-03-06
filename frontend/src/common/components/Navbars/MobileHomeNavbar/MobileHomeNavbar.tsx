import { Group } from '@mantine/core';
import { IconBrandMessenger } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import baseStyles from '../mobile-nav-styles';
import NavbarBrand from '../NavbarBrand/NavbarBrand';

function MobileHomeNavBar() {
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
        <IconBrandMessenger
          size={30}
          strokeWidth={1.5}
          color="black"
        />
      </Link>
    </Group>
  );
}

export default MobileHomeNavBar;
