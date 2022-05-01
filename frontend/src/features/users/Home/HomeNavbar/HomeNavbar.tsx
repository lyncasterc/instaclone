import { Group, Title } from '@mantine/core';
import { BrandMessenger } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import useStyles from './HomeNavbar.styles';
import baseStyles from '../../../../common/utils/mobile-nav-styles';

function HomeNavbar() {
  const { classes } = useStyles();
  const { classes: baseClasses } = baseStyles();

  return (
    <Group
      position="apart"
      className={`${baseClasses.baseStyles}`}
      data-testid="home-nav"
    >
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
