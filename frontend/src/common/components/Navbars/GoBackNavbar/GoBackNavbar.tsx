import { Title } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import baseStyles from '../mobile-nav-styles';
import useStyles from './GoBackNavbar.styles';
import useGoBack from '../../../hooks/useGoBack';

interface GoBackNavbarProps {
  isCurrentUserProfile?: boolean,
  rightComponent?: JSX.Element,
  text: string,
}

function GoBackNavbar({ isCurrentUserProfile, text, rightComponent }: GoBackNavbarProps) {
  const { classes: baseClasses } = baseStyles();
  const { classes } = useStyles();
  const goBack = useGoBack();

  return (
    <nav
      className={`${classes.container} ${baseClasses.baseStyles}`}
    >
      {
        !isCurrentUserProfile && (
          <div className={classes.backBtnContainer}>
            <IconChevronLeft
              className={`${classes.backBtn}`}
              size={35}
              strokeWidth={1.5}
              onClick={goBack}
              data-testid="goBackNavBtn"
            />
          </div>
        )
      }
      <Title order={4} className={baseClasses.header}>{text}</Title>

      {rightComponent}
    </nav>
  );
}

GoBackNavbar.defaultProps = {
  isCurrentUserProfile: false,
  rightComponent: null,
};

export default GoBackNavbar;
