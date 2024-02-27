import { Button, Container, UnstyledButton } from '@mantine/core';
import {
  IconHome,
  IconSquarePlus,
  IconBrandMessenger,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import useStyles from './DesktopNavbar.styles';
import useAuth from '../../../hooks/useAuth';
import UserMenu from '../../UserMenu/UserMenu';
import NavbarBrand from '../NavbarBrand/NavbarBrand';

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
              classNames={{
                root: classes.buttonRoot,
              }}
            >
              Log In
            </Button>
            <Button
              variant="white"
              component={Link}
              to="/signup"
              classNames={{
                root: cx(classes.buttonRoot, classes.signupButtonRoot),
              }}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/"
            >
              <IconHome
                size={30}
                strokeWidth={2}
                color="black"
              />
            </Link>

            <UnstyledButton>
              <label htmlFor="postImageUpload">
                <IconSquarePlus
                  size={30}
                  strokeWidth={2}
                  color="black"
                  style={{
                    cursor: 'pointer',
                  }}
                />
              </label>
            </UnstyledButton>

            <Link
              to="/"
            >
              <IconBrandMessenger
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
      <Container
        size="md"
        className={classes.navInnerContainer}
      >
        <div>
          <NavbarBrand />
        </div>

        <div>
          <div>
            {rightNavSection()}
          </div>
        </div>
      </Container>
    </nav>
  );
}

DesktopNavbar.defaultProps = {
  displayOnMobile: false,
};

export default DesktopNavbar;
