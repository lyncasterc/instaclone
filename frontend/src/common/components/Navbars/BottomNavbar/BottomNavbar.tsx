import {
  Home,
  SquarePlus,
  Search,
  Heart,
} from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import { Avatar, Group } from '@mantine/core';
import useStyles from './BottomNavbar.styles';

interface BottomNavBarProps {
  user: string | null,
}

// TODO: render a blank bar when not logged in
function BottomNavBar({ user }: BottomNavBarProps) {
  const { classes } = useStyles();

  return (
    <Group
      className={classes.container}
      position="apart"
      data-cy="bottom-nav"
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
        to={`/${user}`}
        radius="xl"
      />

    </Group>
  );
}

export default BottomNavBar;
