import {
  Avatar,
  Menu,
  Divider,
} from '@mantine/core';
import {
  UserCircle,
  Settings,
} from 'tabler-icons-react';
import useStyles from './UserMenu.styles';
import useAuth from '../../hooks/useAuth';

// TODO: add user prop
function UserMenu() {
  const { classes } = useStyles();
  const [, { logout }] = useAuth();
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
    >
      <Menu.Item icon={<UserCircle size={18} />}>Profile</Menu.Item>
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
