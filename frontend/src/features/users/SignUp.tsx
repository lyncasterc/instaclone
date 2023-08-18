import * as Yup from 'yup';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Anchor,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import SignUpLogInTextInput from '../../common/components/SignUpLogInTextInput/SignUpLogInTextInput';
import { NewUserFields } from '../../app/types';
import { useAddUserMutation } from '../../app/apiSlice';
import useAuth from '../../common/hooks/useAuth';
import FormContainer from '../../common/components/FormContainer';
import Button from '../../common/components/Button';
import { useStyles } from '../auth/Login';
import getErrorMessage from '../../common/utils/getErrorMessage';

function SignUp() {
  const [errorMessage, setErrorMessage] = useState('');
  const [addUser] = useAddUserMutation();
  const [, { login }] = useAuth();
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <Container
      className={classes.container}
    >
      <Formik
        initialValues={{
          email: '',
          fullName: '',
          username: '',
          password: '',
        }}
        onSubmit={async (values: NewUserFields) => {
          try {
            await addUser(values).unwrap();
            await login({
              username: values.username,
              password: values.password,
            });
            navigate('/');
          } catch (error) {
            const message = getErrorMessage(error);
            console.error(message);
            setErrorMessage(message);
          }
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
                fontSize: '3rem',
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
                width: '80%',
              })}
              mb="sm"
            >
              Sign up to see photos from people you don&apos;t really care about.
            </Title>

            <SignUpLogInTextInput
              name="email"
              placeholder="Email"
              variant="filled"
              aria-label="Email"
              type="email"
              sx={{
                width: '80%',
              }}
            />
            <SignUpLogInTextInput
              name="fullName"
              placeholder="Full Name"
              variant="filled"
              aria-label="full name"
              sx={{
                width: '80%',
              }}
            />
            <SignUpLogInTextInput
              name="username"
              placeholder="Username"
              variant="filled"
              aria-label="username"
              sx={{
                width: '80%',
              }}
            />
            <SignUpLogInTextInput
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

            {
              errorMessage && <Text sx={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>
            }

            <Text sx={{ marginTop: 10 }}>
              Have an account?
              {' '}
              <Anchor
                component={Link}
                to="/login"
              >
                Log in
              </Anchor>
            </Text>
          </FormContainer>
        )
      }
      </Formik>
    </Container>
  );
}

export default SignUp;
