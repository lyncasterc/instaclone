import { Global } from '@mantine/core';
import DamionFont from '../../fonts/Damion-Regular.tff';

// Loads Damion font in Mantine
function Damion() {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'Damion',
            src: `url('${DamionFont}')`,
            fontStyle: 'normal',
          },
        },
      ]}
    />
  );
}

export default Damion;
