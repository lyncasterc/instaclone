import useStyles from './GridImage.styles';

interface GridImageProps {
  src: string,
  alt: string,
}

function GridImage({ src, alt }: GridImageProps) {
  const { classes } = useStyles();

  return (
    <div
      className={classes.imageWrapper}
    >
      <img
        src={src}
        alt={alt}
        className={classes.img}
      />
    </div>
  );
}

export default GridImage;
