import {
  Avatar,
  Menu,
  Divider,
} from '@mantine/core';
import {
  IconUserCircle,
  IconSettings,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import useStyles from './UserMenu.styles';
import useAuth from '../../hooks/useAuth';
import { useAppSelector } from '../../hooks/selector-dispatch-hooks';
import { selectUserByUsername } from '../../../app/apiSlice';

// TODO: add user prop
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
      <Menu.Item icon={<IconSettings size={18} />}>Settings</Menu.Item>

      <Divider />

      <Menu.Item
        onClick={() => logout()}
        sx={{ backGroundColor: 'white' }}
      >
        Log Out
      </Menu.Item>

    </Menu>
  );
}

export default UserMenu;
