/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  // Modal,
  UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import useStyles from './GridImage.styles';

interface GridImageProps {
  src: string,
  alt: string,
}

function GridImage({ src, alt }: GridImageProps) {
  const { classes } = useStyles();
  const location = useLocation();
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');
  const navigate = useNavigate();
  // TODO: take user to gridimage page if not on desktop
  // const [opened, setOpened] = useState(false);

  // const onClick = () => {
  //   if (!isMediumScreenOrWider) {
  //     navigate('/');
  //   }
  // };

  return (
    <Link
      to="/p/d2afadf"
      state={{
        background: location,
      }}
    >
      <UnstyledButton
        className={classes.imageWrapper}
        // onClick={onClick}
      >
        <img
          src={src}
          alt={alt}
          className={classes.img}
        />

      </UnstyledButton>
    </Link>
  );
}

export default GridImage;
