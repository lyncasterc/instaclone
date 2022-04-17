import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Title,
  Anchor,
  Text,
  createStyles,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import type { LoginFields } from '../../app/types';
import FormikTextInput from '../../common/components/FormikTextInput';
import Button from '../../common/components/Button';
import FormContainer from '../../common/components/FormContainer';
import useAuth from '../../common/hooks/useAuth';

// exported for use in SignUp.tsx, which follows the same structure and design.
export const useStyles = createStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '40vh',
    padding: 50,
  },
}));

// TODO: redirect user to feed if already logged in
function Login() {
  const [, { login }] = useAuth();
  const { classes } = useStyles();
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
          console.log('login boop');
          await login(values);
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
