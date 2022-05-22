import { useState } from 'react';
import {
  Container,
  Button,
  Textarea,
  Avatar,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import FormikTextInput from '../../../../common/components/FormikTextInput';
import { useAppSelector } from '../../../../common/hooks/selector-dispatch-hooks';
import {
  selectUserByUsername,
  useEditUserMutation,
} from '../../../../app/apiSlice';
import useStyles from './UserProfileEdit.styles';
import { UpdatedUserFields } from '../../../../app/types';
import placeholderIcon from '../../../../assets/placeholder-icon.jpeg';
import ChangeAvatarModal from './ChangeAvatarModal/ChangeAvatarModal';

interface UserProfileEditProps {
  user: string | null
}

function UserProfileEdit({ user }: UserProfileEditProps) {
  const userObject = useAppSelector((state) => selectUserByUsername(state, user as string));
  const { classes } = useStyles();
  const [editUser] = useEditUserMutation();
  const [avatarPreview, setAvatarPreview] = useState(userObject?.image);
  const [modalOpened, setModalOpened] = useState(false);

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<void>['setFieldValue'],
  ) => {
    if (!e.target.files) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        setFieldValue('image', fileReader.result);
        setAvatarPreview(fileReader.result as string);
        setModalOpened(false);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  if (userObject) {
    const { id } = userObject;

    return (
      <Container
        size="md"
        className={classes.container}
      >
        <Formik
          initialValues={{
            email: userObject?.email ?? '',
            image: userObject?.image,
            name: userObject?.fullName ?? '',
            username: userObject?.username ?? '',
            bio: userObject?.bio ?? '',
          }}
          onSubmit={async (values: UpdatedUserFields) => {
            try {
              await editUser({ updatedUserFields: values, id }).unwrap();
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
            image: Yup.string()
              .notRequired(),
          })}
        >
          {
            ({ isValid, getFieldProps, setFieldValue }) => (
              <Form>
                <ChangeAvatarModal
                  opened={modalOpened}
                  onClose={() => setModalOpened(false)}
                  handleFileInputChange={handleFileInputChange}
                  setFieldValue={setFieldValue}
                  setModalOpened={setModalOpened}
                />

                <div
                  className={classes.usernameAvatarContainer}
                >

                  <UnstyledButton
                    onClick={() => (!userObject.image ? setModalOpened(true) : null)}
                  >
                    <label htmlFor="imageUpload">
                      <Avatar
                        radius="xl"
                        size="md"
                        classNames={{
                          root: classes.avatarRoot,
                        }}
                        src={avatarPreview || null}
                      >
                        <img
                          className={classes.placeholderIcon}
                          src={placeholderIcon}
                          alt="Placeholder icon"
                        />
                      </Avatar>
                    </label>
                  </UnstyledButton>
                  {/* TODO: should be !userObject.image */}
                  {
                      userObject.image && (
                        <input
                          type="file"
                          name="image"
                          id="imageUpload"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileInputChange(e, setFieldValue)}
                          accept="image/gif, image/png, image/jpeg"
                        />
                      )
                    }

                  <Text size="xl">{user}</Text>
                </div>

                <FormikTextInput
                  name="name"
                  placeholder="Name"
                  label="Name"
                  classNames={{
                    label: classes.inputLabel,
                    input: classes.input,
                  }}
                />

                <FormikTextInput
                  name="username"
                  placeholder="Username"
                  label="Username"
                  classNames={{
                    label: classes.inputLabel,
                    input: classes.input,
                  }}
                />

                <Textarea
                  label="Bio"
                  classNames={{
                    label: classes.inputLabel,
                    input: classes.input,
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
                  }}
                />

                <Button
                  type="submit"
                  disabled={!isValid}
                >
                  Submit
                </Button>
              </Form>
            )
          }
        </Formik>
      </Container>
    );
  }

  return (null);
}

export default UserProfileEdit;
