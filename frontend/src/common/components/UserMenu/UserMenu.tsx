import {
  Avatar,
  Menu,
  Divider,
} from '@mantine/core';
import {
  UserCircle,
  Settings,
} from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import useStyles from './UserMenu.styles';
import useAuth from '../../hooks/useAuth';

// TODO: add user prop
function UserMenu() {
  const { classes } = useStyles();
  const [user, { logout }] = useAuth();
  const avatar = (
    <Avatar
      radius="xl"
      classNames={{
        root: classes.avatarRoot,
      }}
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
      <Menu.Item icon={<UserCircle size={18} />} component={Link} to={`/${user}`}>
        Profile
      </Menu.Item>
      <Menu.Item icon={<Settings size={18} />}>Settings</Menu.Item>

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
