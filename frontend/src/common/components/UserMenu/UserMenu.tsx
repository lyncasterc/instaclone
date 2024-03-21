import {
  Avatar,
  Menu,
  Divider,
} from '@mantine/core';
import {
  IconUserCircle,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import useStyles from './UserMenu.styles';
import useAuth from '../../hooks/useAuth';
import { useAppSelector } from '../../hooks/selector-dispatch-hooks';
import { selectUserByUsername } from '../../../app/apiSlice';

function UserMenu() {
  const { classes } = useStyles();
  const [user, { logout }] = useAuth();
  const selectedUser = user ? useAppSelector(
    (state) => selectUserByUsername(state, user),
  ) : undefined;
  const avatar = (
    <Avatar
      radius="xl"
      classNames={{
        root: classes.avatarRoot,
      }}
      data-testid="desktop-nav-avatar"
      src={selectedUser?.image?.url}
      size="sm"
    />
  );

  return (
    <Menu
      control={avatar}
      data-testid="usermenu"
      sx={{
        cursor: 'pointer',
      }}
    >
      <Menu.Item icon={<IconUserCircle size={18} />} component={Link} to={`/${user}`}>
        Profile
      </Menu.Item>

      <Divider />

      <Menu.Item
        onClick={async () => {
          await logout();
        }}
        sx={{ backGroundColor: 'white', color: 'red' }}
      >
        Log Out
      </Menu.Item>

    </Menu>
  );
}

export default UserMenu;
