import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import useStyles from './Alert.styles';

interface AlertProps {
  alertText: string,
  setAlertText: (alertText: string) => void,
}

function Alert({ alertText, setAlertText }: AlertProps) {
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

export default Alert;
