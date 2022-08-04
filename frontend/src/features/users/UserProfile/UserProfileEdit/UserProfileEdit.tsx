import { useState } from 'react';
import {
  Container,
  Button,
  Textarea,
  Avatar,
  Text,
  UnstyledButton,
  Loader,
} from '@mantine/core';
import {
  Formik,
  Form,
  FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import FormikTextInput from '../../../../common/components/FormikTextInput';
import { useAppSelector } from '../../../../common/hooks/selector-dispatch-hooks';
import useAuth from '../../../../common/hooks/useAuth';
import {
  selectUserByUsername,
  useEditUserMutation,
  useDeleteUserImageMutation,
} from '../../../../app/apiSlice';
import useStyles from './UserProfileEdit.styles';
import { UpdatedUserFields } from '../../../../app/types';
import placeholderIcon from '../../../../assets/placeholder-icon.jpeg';
import ChangeAvatarModal from './ChangeAvatarModal/ChangeAvatarModal';
import GoBackNavbar from '../../../../common/components/Navbars/GoBackNavbar/GoBackNavbar';

interface UserProfileEditProps {
  user: string | null
}

function UserProfileEdit({ user }: UserProfileEditProps) {
  const userObject = useAppSelector((state) => selectUserByUsername(state, user as string));
  const { classes } = useStyles();
  const [editUser, { isLoading: isUpdating }] = useEditUserMutation();
  const [updateImage, { isLoading: isImageUpdating }] = useEditUserMutation();
  const [deleteUserImage, { isLoading: isDeleting }] = useDeleteUserImageMutation();
  const [modalOpened, setModalOpened] = useState(false);
  const [, { updateTokenUsername }] = useAuth();

  if (userObject) {
    const { id } = userObject;
    const handleFileInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      if (!e.target.files) return;

      const fileReader = new FileReader();
      fileReader.onload = async () => {
        if (fileReader.readyState === 2) {
          try {
            await updateImage(
              {
                updatedUserFields: {
                  imageDataUrl: fileReader.result as string,
                },
                id: userObject.id,
              },
            ).unwrap();
            setModalOpened(false);
          } catch (error) {
            console.log(error);
          }
        }
      };
      fileReader.readAsDataURL(e.target.files[0]);
    };

    const onRemoveBtnClick = async () => {
      try {
        await deleteUserImage(userObject.id).unwrap();
        setModalOpened(false);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <>
        <GoBackNavbar text="Edit Profile" />
        <Container
          size="md"
          className={classes.container}
        >
          <Formik
            initialValues={{
              email: userObject?.email ?? '',
              name: userObject?.fullName ?? '',
              username: userObject?.username ?? '',
              bio: userObject?.bio ?? '',
            }}
            onSubmit={async (
              values: UpdatedUserFields,
              actions: FormikHelpers<UpdatedUserFields>,
            ) => {
              try {
                await editUser({ updatedUserFields: values, id }).unwrap();
                if (values.username) updateTokenUsername(values.username);
                triggerAlert('Profile saved.');
                actions.resetForm({ values });
              } catch (error) {
                console.log(error);
              }
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .required(),
              name: Yup.string()
                .required(),
              username: Yup.string()
                .required(),
              bio: Yup.string()
                .notRequired(),
            })}
          >
            {
            ({
              isValid,
              getFieldProps,
              setFieldValue,
              dirty,
            }) => (
              <Form className={classes.form}>
                <ChangeAvatarModal
                  opened={modalOpened}
                  onClose={() => setModalOpened(false)}
                  handleFileInputChange={handleFileInputChange}
                  setFieldValue={setFieldValue}
                  setModalOpened={setModalOpened}
                  onRemoveBtnClick={onRemoveBtnClick}
                />

                <div
                  className={classes.usernameAvatarContainer}
                >

                  <UnstyledButton
                    onClick={() => (userObject.image && setModalOpened(true))}
                    data-testid="avatar"
                  >
                    <label htmlFor="imageUpload">
                      <div className={classes.loadingAvatar}>

                        <Avatar
                          radius="xl"
                          size="md"
                          classNames={{
                            root: classes.avatarRoot,
                          }}
                          src={userObject.image?.url || null}
                        >
                          <div data-testid="avatar-image">
                            <img
                              className={classes.placeholderIcon}
                              src={placeholderIcon}
                              alt={`${userObject.username}'s profile`}
                            />
                          </div>
                        </Avatar>
                        {
                        (isImageUpdating || isDeleting) && (
                          <Loader
                            className={classes.loader}
                            color="gray"
                            sx={{
                              opacity: isImageUpdating ? 1 : 0.5,
                            }}
                          />
                        )
                      }
                      </div>
                    </label>
                  </UnstyledButton>

                  <div className={classes.usernameAvatarRight} id="usernameAvatarRight">
                    <Text
                      size="xl"
                    >
                      {user}
                    </Text>
                    <UnstyledButton
                      onClick={() => (userObject.image && setModalOpened(true))}
                    >
                      <label htmlFor="imageUpload">
                        <Text size="sm" className={classes.changeAvatarText}>
                          Change Profile Photo
                        </Text>
                      </label>
                    </UnstyledButton>
                  </div>
                  {
                      !userObject.image && (
                        <input
                          type="file"
                          name="image"
                          id="imageUpload"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileInputChange(e)}
                          accept="image/gif, image/png, image/jpeg"
                        />
                      )
                  }
                </div>

                <FormikTextInput
                  name="name"
                  placeholder="Name"
                  label="Name"
                  classNames={{
                    label: classes.inputLabel,
                    input: classes.input,
                    root: classes.formControlRoot,
                  }}
                />

                <FormikTextInput
                  name="username"
                  placeholder="Username"
                  label="Username"
                  classNames={{
                    label: classes.inputLabel,
                    input: classes.input,
                    root: classes.formControlRoot,
                  }}
                />

                <Textarea
                  label="Bio"
                  classNames={{
                    label: classes.inputLabel,
                    input: classes.input,
                    root: classes.formControlRoot,
                  }}
                  {...getFieldProps('bio')}
                  autosize
                  minRows={2}
                  maxRows={4}
                />

                <FormikTextInput
                  name="email"
                  placeholder="Email"
                  label="Email"
                  classNames={{
                    label: classes.inputLabel,
                    input: classes.input,
                    root: classes.formControlRoot,
                  }}
                />

                <Button
                  type="submit"
                  disabled={!isValid || !dirty}
                  size="xs"
                  className={classes.submitButton}
                >
                  {
                    isUpdating ? (
                      <Loader
                        color="white"
                        size="xs"
                        variant="dots"
                      />
                    ) : 'Submit'
                  }
                </Button>
              </Form>
            )
          }
          </Formik>
        </Container>
      </>
    );
  }

  return (null);
}

export default UserProfileEdit;
