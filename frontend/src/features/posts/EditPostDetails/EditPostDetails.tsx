import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  UnstyledButton,
  Textarea,
  Container,
  Avatar,
  Image,
  TextareaProps,
  Title,
  Button,
  Group,
} from '@mantine/core';
import { useRef } from 'react';
import * as Yup from 'yup';
import {
  Formik, Form, useField, FormikProps,
} from 'formik';
import { useMediaQuery } from '@mantine/hooks';
import { useAddPostMutation, selectUserByUsername } from '../../../app/apiSlice';
import placeholderIcon from '../../../assets/placeholder-icon.jpeg';
import { useAppSelector } from '../../../common/hooks/selector-dispatch-hooks';
import GoBackNavbar from '../../../common/components/Navbars/GoBackNavbar/GoBackNavbar';
import baseStyles from '../../../common/components/Navbars/mobile-nav-styles';
import useStyles from './EditPostDetails.styles';
import { NewPostFields } from '../../../app/types';
import useGoBack from '../../../common/hooks/useGoBack';

interface EditPostDetailsProps {
  username: string;
  setAlertText: React.Dispatch<React.SetStateAction<string>>
}

function CaptionTextArea({ ...props }: TextareaProps) {
  const [field] = useField('caption');

  return (
    <Textarea
      {...field}
      {...props}
    />
  );
}

function EditPostDetails({ username, setAlertText }: EditPostDetailsProps) {
  interface LocationState {
    croppedImage?: string;
  }

  const location = useLocation();
  const user = useAppSelector((state) => selectUserByUsername(state, username));
  const [addPost, { isLoading: isPosting }] = useAddPostMutation();
  const navigate = useNavigate();
  const formRef = useRef<FormikProps<NewPostFields>>(null);
  const state = location.state as LocationState;
  const { classes: baseClasses } = baseStyles();
  const { classes } = useStyles();
  const isMediumOrWider = useMediaQuery('(min-width: 992px)');
  const goBack = useGoBack();

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  if (state && state?.croppedImage && user) {
    return (
      <>

        {
          (isPosting && !isMediumOrWider) && (
            <div
              className={`${baseClasses.baseStyles}`}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Title order={4} className={baseClasses.header}>Sharing...</Title>

            </div>
          )
        }

        {
          !isPosting && (
            <GoBackNavbar
              text="New Post"
              rightComponent={(
                <UnstyledButton
                  className={baseClasses.nextButton}
                  onClick={handleSubmit}
                >
                  Share
                </UnstyledButton>
              )}
            />
          )
        }
        <Container px={0} size={isMediumOrWider ? 'xs' : 'md'}>
          <Formik
            innerRef={formRef}
            initialValues={{
              caption: '',
              imageDataUrl: state.croppedImage,
            }}
            onSubmit={async (values) => {
              try {
                await addPost(values).unwrap();
                setAlertText('Post added.');
                navigate('/');
              } catch (error) {
                setAlertText('Error creating post. Try again.');
                navigate('/');
                console.error(error);
              }
            }}
            validationSchema={Yup.object({
              caption: Yup.string()
                .notRequired()
                .max(2200),
            })}
          >
            {() => (
              <Form className={classes.form}>
                <div className={classes.captionContainer}>
                  <div style={{
                    height: 63.39,
                  }}
                  >
                    <Avatar
                      src={user.image?.url}
                      radius="xl"
                      size="md"
                    >
                      <div>
                        <img
                          src={placeholderIcon}
                          alt={`${user.username}'s profile`}
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </div>
                    </Avatar>
                  </div>
                  <div className={classes.captionInputContainer}>
                    <CaptionTextArea
                      name="caption"
                      maxLength={2200}
                      classNames={{
                        input: classes.captionInput,
                      }}
                      maxRows={4}
                      aria-label="Write a caption..."
                    />
                  </div>
                  <div className={classes.postImage}>
                    <Image
                      src={state.croppedImage}
                      alt="Image to be posted"
                    />
                  </div>
                </div>

                {
                  isMediumOrWider && (
                    <Group
                      position="apart"
                      sx={{
                        marginTop: 20,
                      }}
                    >
                      <Button
                        color="gray"
                        onClick={goBack}
                        size="xs"
                        disabled={isPosting}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        size="xs"
                        disabled={isPosting}
                        data-cy="edit-post-details-desktop-share-btn"
                      >
                        {
                      isPosting ? (
                        'Sharing...'
                      ) : 'Share'
                    }
                      </Button>

                    </Group>
                  )
                }

              </Form>
            )}
          </Formik>
        </Container>
      </>
    );
  }

  return (
    <Navigate to="/" />
  );
}

export default EditPostDetails;
