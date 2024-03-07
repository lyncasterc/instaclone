import { createStyles, keyframes } from '@mantine/core';

const alertAnimation = keyframes({
  '7%, 90%': { transform: 'translate(-50%, -49px)' },
  '97%': { transform: 'translate(-50%, 100px)' },
});

const alertAnimationDesktop = keyframes({
  '7%, 90%': { transform: 'translate(-50%, 0px)' },
  '97%': { transform: 'translate(-50%, 100px)' },
});

export default createStyles((theme) => ({
  alert: {
    backgroundColor: 'black',
    opacity: 0.8,
    color: 'white',
    fontSize: '.875rem',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%, 100px)',
    padding: '1rem',
    animation: `${alertAnimation} 5500ms`,
    animationFillMode: 'forwards',
    zIndex: 1000,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      maxWidth: 500,
      animation: `${alertAnimationDesktop} 5500ms`,
    },
  },
}));
