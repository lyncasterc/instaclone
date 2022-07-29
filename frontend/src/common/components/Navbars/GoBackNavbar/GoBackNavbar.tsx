import { Title } from '@mantine/core';
import { ChevronLeft } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import baseStyles from '../mobile-nav-styles';
import useStyles from './GoBackNavbar.styles';

interface GoBackNavbarProps {
  isCurrentUserProfile?: boolean,
  text: string
}

function GoBackNavbar({ isCurrentUserProfile, text }: GoBackNavbarProps) {
  const { classes: baseClasses } = baseStyles();
  const { classes } = useStyles();
  const navigate = useNavigate();

  // TODO: write tests for the going back logic when possible
  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <nav
      className={`${classes.container} ${baseClasses.baseStyles}`}
    >
      {
        !isCurrentUserProfile && (
          <ChevronLeft
            className={`${classes.backBtn}`}
            size={35}
            strokeWidth={1.5}
            onClick={handleGoBack}
          />
        )
      }
      <Title order={4} className={`${classes.text}`}>{text}</Title>
    </nav>
  );
}

GoBackNavbar.defaultProps = {
  isCurrentUserProfile: false,
};

export default GoBackNavbar;
