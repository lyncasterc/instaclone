import {
  useLocation, Navigate, Link, useNavigate,
} from 'react-router-dom';
import Cropper, { Area, Point } from 'react-easy-crop';
import { useState } from 'react';
import {
  Button, Title, UnstyledButton,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import baseStyles from '../../../common/components/Navbars/mobile-nav-styles';
import getCroppedImage from './getCroppedImage';
import getErrorMessage from '../../../common/utils/getErrorMessage';
import useStyles from './EditPostImage.styles';

interface EditPostImageProps {
  setAlertText: React.Dispatch<React.SetStateAction<string>>
}

function EditPostImage({ setAlertText }: EditPostImageProps) {
  interface LocationState {
    image?: string
  }

  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line prefer-destructuring
  const state = location.state as LocationState;
  const { classes: baseClasses } = baseStyles();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const isSmallOrWider = useMediaQuery('(min-width: 768px)');
  const ismediumOrWider = useMediaQuery('(min-width: 992px)');
  const { classes } = useStyles();

  const onNextClick = async (imageSrc: string) => {
    try {
      if (!croppedAreaPixels) return;

      const croppedImage = await getCroppedImage(imageSrc, croppedAreaPixels);

      navigate('/create/details', {
        state: {
          croppedImage,
        },
      });
    } catch (error) {
      setAlertText('Error creating post. Try again.');
      navigate('/');
      console.error(getErrorMessage(error));
    }
  };

  if (state && state?.image) {
    return (
      <>
        <nav
          className={`${baseClasses.baseStyles}`}
        >

          <div className={baseClasses.threeItemNavContainer}>
            <Link to="/" className={baseClasses.closeButton} data-cy="edit-post-image-mobile-cancel-btn">
              <IconX size={35} strokeWidth={1.5} />
            </Link>
            <Title order={4} className={baseClasses.header}>New Post Photo</Title>

            <UnstyledButton
              className={baseClasses.nextButton}
              onClick={() => onNextClick(state.image!)}
              data-cy="edit-post-image-mobile-next-btn"
            >
              Next
            </UnstyledButton>
          </div>
        </nav>
        <div className={classes.cropperContainer}>
          <Cropper
            image={state.image}
            crop={crop}
            onCropChange={setCrop}
            onCropComplete={(_, croppedArea) => setCroppedAreaPixels(croppedArea)}
            aspect={1 / 1}
            objectFit={isSmallOrWider ? 'contain' : 'horizontal-cover'}
          />
        </div>

        {ismediumOrWider && (
          <div className={classes.desktopBtns}>
            <Button size="xs" onClick={() => navigate('/')} color="gray">Cancel</Button>
            <Button size="xs" onClick={() => onNextClick(state.image!)} data-cy="edit-post-image-desktop-next-btn">Next</Button>
          </div>
        )}
      </>
    );
  }

  return (
    <Navigate to="/" />
  );
}

export default EditPostImage;
