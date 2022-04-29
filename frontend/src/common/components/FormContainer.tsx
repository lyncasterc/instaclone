import { Box, Container, createStyles } from '@mantine/core';
import { Form } from 'formik';
import { ReactNode } from 'react';

const useStyles = createStyles(() => ({
  box: {
    // backgroundColor: 'white',
    width: 320,
    // padding: '25px 15px',
    // border: '1px solid',
    // borderColor: theme.colors.gray[4],
    // borderColor: 'red',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

// TODO: change type of this to FC
function FormContainer({ children }: { children: ReactNode }) {
  const { classes } = useStyles();
  return (
    <Container>

      <Box className={classes.box}>
        <Form
          className={classes.form}
        >
          {children}
        </Form>
      </Box>
    </Container>
  );
}

export default FormContainer;
