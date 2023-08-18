import { Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import useStyles from './NavbarBrand.styles';

function NavbarBrand() {
  const { classes } = useStyles();

  return (
    <Link
      to="/"
      className={classes.navBrandLink}
    >
      <Title
        order={1}
        className={classes.navBrandTitle}
      >
        Instaclone
      </Title>
    </Link>
  );
}

export default NavbarBrand;
