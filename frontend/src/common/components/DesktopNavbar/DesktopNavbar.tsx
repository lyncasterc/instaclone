import {
  Title,
  Button,
} from '@mantine/core';
import {
  Home,
  SquarePlus,
} from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import useStyles from './DesktopNavbar.styles';
import useAuth from '../../hooks/useAuth';
import UserMenu from '../UserMenu/UserMenu';

function DesktopNavbar() {
  const [user] = useAuth();
  const { classes } = useStyles();

  const rightNavSection = () => (
    <div
      className={classes.navBarButtonGroup}
    >
      {
        (!user ? (
          <>
            <Button
              component={Link}
              to="/login"
            >
              Log In
            </Button>
            <Button
              variant="white"
              component={Link}
              to="/signup"
            >
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/"
            >
              <Home
                size={30}
                strokeWidth={2}
                color="black"
              />
            </Link>
            <Link
              to="/"
            >
              <SquarePlus
                size={30}
                strokeWidth={2}
                color="black"
              />
            </Link>
            <UserMenu />
          </>

        ))
      }
    </div>
  );

  return (
    <div
      className={classes.navContainer}
    >
      <div>

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

      </div>

      <div>

        <div>
          {rightNavSection()}
        </div>

      </div>

    </div>
  );
}

export default DesktopNavbar;
