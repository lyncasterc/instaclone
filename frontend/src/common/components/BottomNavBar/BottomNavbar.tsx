import {
  Home,
  SquarePlus,
  Search,
  Heart,
} from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import { Avatar, Group } from '@mantine/core';
import useStyles from './BottomNavbar.styles';

// TODO: add user prop
function BottomNavBar() {
  const { classes } = useStyles();

  return (
    <Group
      className={classes.container}
      position="apart"
    >

      <Link
        to="/"
      >
        <Home
          size={30}
          strokeWidth={1.5}
          color="black"
        />
      </Link>

      <Link
        to="/"
      >
        <Search
          size={30}
          strokeWidth={1.5}
          color="black"
        />
      </Link>

      <Link
        to="/"
      >
        <SquarePlus
          size={30}
          strokeWidth={1.5}
          color="black"
        />
      </Link>

      <Link
        to="/"
      >
        <Heart
          size={30}
          strokeWidth={1.5}
          color="black"
        />
      </Link>

      <Avatar
        component={Link}
        to="/"
        radius="xl"
      />

    </Group>
  );
}

export default BottomNavBar;
