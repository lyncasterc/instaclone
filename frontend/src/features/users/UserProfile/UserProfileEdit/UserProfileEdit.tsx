import { useState } from 'react';
import {
  Container,
  Button,
  Textarea,
  Avatar,
  Text,
  UnstyledButton,
  Loader,
  TextareaProps,
} from '@mantine/core';
import {
  Formik,
  Form,
  FormikHelpers,
  useField,
} from 'formik';
import * as Yup from 'yup';
import FormikTextInput from '../../../../common/components/FormikTextInput';
import { useAppSelector } from '../../../../common/hooks/selector-dispatch-hooks';
import useAuth from '../../../../common/hooks/useAuth';
import {
  selectUserByUsername,
  useEditUserMutation,
} from '../../../../app/apiSlice';
import useUserProfileImageUpload from '../../../../common/hooks/useUserProfileImageUpload';
import useStyles from './UserProfileEdit.styles';
import { UpdatedUserFields } from '../../../../app/types';
import placeholderIcon from '../../../../assets/placeholder-icon.jpeg';
import ChangeAvatarModal from './ChangeAvatarModal/ChangeAvatarModal';
import GoBackNavbar from '../../../../common/components/Navbars/GoBackNavbar/GoBackNavbar';
import UserProfileAlert from '../UserProfileAlert/UserProfileAlert';

interface UserProfileEditProps {
  user: string | null
}

interface BioTextAreaProps extends TextareaProps {
  name: string,
}
function BioTextArea({ name, ...props }: BioTextAreaProps) {
  const [field] = useField(name);

  return (
    <>
      <Textarea
        label="Bio"
        {...field}
        {...props}
        autosize
        minRows={2}
        maxRows={4}
        mb={5}
      />
      <Text
        size="xs"
        sx={{
          color: field.value.length > 150 ? 'red' : '#737373',
          fontWeight: field.value.length > 150 ? 'bold' : 'inherit',
        }}
      >
        {field.value.length}
        {' '}
        / 150
      </Text>
    </>
  );
}

function UserProfileEdit({ user }: UserProfileEditProps) {
  const userObject = useAppSelector((state) => selectUserByUsername(state, user as string));
  const { classes } = useStyles();
  const [editUser, { isLoading: isUpdating }] = useEditUserMutation();
  const [alertText, setAlertText] = useState('');
  const [handleFileInputChange, onRemoveBtnClick, {
    isDeleting,
    isImageUpdating,
    modalOpened,
    setModalOpened,
  }] = useUserProfileImageUpload(setAlertText);
  const [, { updateTokenUsername }] = useAuth();
  // const [bioValue, setBioValue] = useState(userObject?.bio ?? '');

  if (userObject) {
    const { id: userId } = userObject;
    return (
      <>
        {(alertText && !modalOpened) && (
          <UserProfileAlert alertText={alertText} setAlertText={setAlertText} />
        )}
        <GoBackNavbar text="Edit Profile" />
        <ChangeAvatarModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          handleFileInputChange={(e) => handleFileInputChange(e, userId)}
          setModalOpened={setModalOpened}
          onRemoveBtnClick={() => onRemoveBtnClick(userId)}
        />
        <Container
          size="md"
          className={classes.container}
        >
          <Formik
            initialValues={{
              email: userObject?.email ?? '',
              fullName: userObject?.fullName ?? '',
              username: userObject?.username ?? '',
              bio: userObject?.bio ?? '',
            }}
            onSubmit={async (
              values: UpdatedUserFields,
              actions: FormikHelpers<UpdatedUserFields>,
            ) => {
              try {
                await editUser({ updatedUserFields: values, id: userId }).unwrap();
                setAlertText('Profile saved.');
                actions.resetForm({ values });
                if (values.username) updateTokenUsername(values.username);
              } catch (error) {
                console.log(error);
              }
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .required(),
              fullName: Yup.string()
                .required(),
              username: Yup.string()
                .required(),
              bio: Yup.string()
                .notRequired()
                .max(150),
            })}
          >
            {
            ({
              isValid,
              dirty,
            }) => (
              <Form className={classes.form}>
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
                          onChange={(e) => handleFileInputChange(e, userId)}
                          accept="image/gif, image/png, image/jpeg"
                        />
                      )
                  }
                </div>

                <FormikTextInput
                  name="fullName"
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

                <div className={classes.formControlRoot}>
                  <BioTextArea
                    name="bio"
                    classNames={{
                      label: classes.inputLabel,
                      input: classes.input,
                    }}
                  />
                </div>

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
