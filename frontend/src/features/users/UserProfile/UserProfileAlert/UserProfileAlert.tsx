import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import useStyles from './UserProfileAlert.styles';

interface UserProfileAlertProps {
  alertText: string,
  setAlertText: (alertText: string) => void,
}

function UserProfileAlert({ alertText, setAlertText }: UserProfileAlertProps) {
  if (!alertText) return null;

  const { classes } = useStyles();

  useEffect(() => {
    setTimeout(() => {
      setAlertText('');
    }, 5500);
  });

  return (
    <div
      className={classes.alert}
      key={nanoid()}
    >
      {alertText}
    </div>
  );
}

export default UserProfileAlert;
