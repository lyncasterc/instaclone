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

interface DesktopNavbarProps {
  displayOnMobile?: boolean,
}

function DesktopNavbar({ displayOnMobile }: DesktopNavbarProps) {
  const [user] = useAuth();
  const { classes, cx } = useStyles();

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
    <nav
      className={cx(classes.navContainer, { [classes.hideOnMobile]: !displayOnMobile })}
      data-cy="desktop-nav"
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

    </nav>
  );
}

DesktopNavbar.defaultProps = {
  displayOnMobile: false,
};

export default DesktopNavbar;
