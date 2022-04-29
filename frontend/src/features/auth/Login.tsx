import { Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import {
  Container,
  Title,
  Anchor,
  Text,
  createStyles,
} from '@mantine/core';
import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import type { LoginFields } from '../../app/types';
import FormikTextInput from '../../common/components/FormikTextInput';
import Button from '../../common/components/Button';
import FormContainer from '../../common/components/FormContainer';
import useAuth from '../../common/hooks/useAuth';
import getErrorMessage from '../../common/utils/getErrorMessage';

// exported for use in SignUp.tsx, which follows the same structure and design.
export const useStyles = createStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // height: '40vh',
    padding: 50,
  },
}));

interface LocationState {
  path: string,
}

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const [, { login }] = useAuth();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  return (

    <Container
      className={classes.container}
    >
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={async (values: LoginFields) => {
          try {
            await login(values);
            navigate(state?.path || '/');
          } catch (error) {
            const message = getErrorMessage(error);
            console.error(message);
            setErrorMessage(message);
          }
        }}
        validationSchema={Yup.object({
          username: Yup.string().required(),
          password: Yup.string().required(),
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

              <FormikTextInput
                name="username"
                placeholder="Username"
                variant="filled"
                aria-label="Username"
                sx={{
                  width: '80%',
                }}
              />
              <FormikTextInput
                name="password"
                placeholder="Password"
                variant="filled"
                aria-label="password"
                sx={{
                  width: '80%',
                }}
                type="password"
              />
              <Button
                type="submit"
                text="Log In"
                disabled={!dirty || !isValid}
                style={{ marginTop: 10 }}
              />

              {
                errorMessage && <Text sx={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>
              }

              <Text sx={{ marginTop: 10 }}>
                Don&apos;t have an account?
                {' '}
                <Anchor
                  component={Link}
                  to="/signup"
                >
                  Sign up
                </Anchor>
              </Text>
            </FormContainer>
          )
        }
      </Formik>
    </Container>
  );
}

export default Login;
