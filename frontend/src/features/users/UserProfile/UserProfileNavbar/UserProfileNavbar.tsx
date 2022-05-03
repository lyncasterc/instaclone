import { Title } from '@mantine/core';
import { ChevronLeft } from 'tabler-icons-react';
import baseStyles from '../../../../common/utils/mobile-nav-styles';
import useStyles from './UserProfileNavbar.styles';

interface UserProfileNavbarProps {
  isCurrentUserProfile?: boolean,
  username: string
}

function UserProfileNavbar({ isCurrentUserProfile, username }: UserProfileNavbarProps) {
  const { classes: baseClasses } = baseStyles();
  const { classes } = useStyles();
  return (
    <nav
      className={`${baseClasses.baseStyles} ${classes.container}`}
    >
      {
        isCurrentUserProfile && (
          <ChevronLeft
            className={`${classes.backBtn}`}
            size={35}
            strokeWidth={1.5}
          />
        )
      }
      <Title order={4} className={`${classes.username}`}>{username}</Title>
    </nav>
  );
}

UserProfileNavbar.defaultProps = {
  isCurrentUserProfile: false,
};

export default UserProfileNavbar;
