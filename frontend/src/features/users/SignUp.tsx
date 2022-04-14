import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  // Center,
  Container,
  Title,
} from '@mantine/core';
import FormikTextInput from '../../common/components/FormikTextInput';
import { NewUserFields } from '../../app/types';
import { useAddUserMutation } from '../../app/apiSlice';
import FormContainer from '../../common/components/FormContainer';
import Button from '../../common/components/Button';

function SignUp() {
  const [addUser] = useAddUserMutation();

  // FIXME: make this properly centered
  return (
    <Container
      sx={{
        // backgroundColor: 'red',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      fluid
    >
      <Formik
        initialValues={{
          email: '',
          fullName: '',
          username: '',
          password: '',
        }}
        onSubmit={async (values: NewUserFields) => {
          console.log('boop');

          await addUser(values);
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .required(),
          fullName: Yup.string()
            .required(),
          username: Yup.string()
            .required(),
          password: Yup.string()
            .required(),
        })}
      >

        {
        ({ dirty, isValid }) => (
          <FormContainer>
            <Title
              align="center"
              order={1}
              sx={{
                fontFamily: 'Damion',
                fontSize: '3.5rem',
              }}
              mb="sm"
            >
              Instaclone
            </Title>
            <Title
              align="center"
              order={4}
              sx={(theme) => ({
                color: theme.colors.gray[6],
                fontSize: 17,
              })}
              mb="sm"
            >
              Sign up to see photos from people you don&apos;t really care about.
            </Title>

            <FormikTextInput
              name="email"
              placeholder="Email"
              variant="filled"
              aria-label="Email"
              type="email"
              sx={{
                width: '80%',
              }}
            />
            <FormikTextInput
              name="fullName"
              placeholder="Full Name"
              variant="filled"
              aria-label="full name"
              sx={{
                width: '80%',
              }}
            />
            <FormikTextInput
              name="username"
              placeholder="Username"
              variant="filled"
              aria-label="username"
              sx={{
                width: '80%',
              }}
            />
            <FormikTextInput
              name="password"
              placeholder="Password"
              variant="filled"
              aria-label="password"
              type="password"
              sx={{
                width: '80%',
                marginBottom: 15,
              }}
            />
            <Button
              type="submit"
              text="Sign Up"
              disabled={!dirty || !isValid}
            />
          </FormContainer>
        )
      }
      </Formik>
    </Container>
  );
}

export default SignUp;
