import {
  Modal,
  ModalProps,
  UnstyledButton,
  Stack,
  Text,
} from '@mantine/core';
import useStyles from './DeleteModal.styles';

interface DeleteModalPropsBase extends ModalProps {
  onDelete: () => void;
}

interface DeleteModalPropsWithLabels extends DeleteModalPropsBase {
  primaryLabel: string;
  secondaryLabel?: string;
}

interface DeleteModalPropsWithoutLabels extends DeleteModalPropsBase {
  primaryLabel?: never;
  secondaryLabel?: never;
}

type DeleteModalProps = DeleteModalPropsWithLabels | DeleteModalPropsWithoutLabels;

function DeleteModal({
  onDelete,
  primaryLabel,
  secondaryLabel,
  ...props
}: DeleteModalProps) {
  const { classes } = useStyles();

  return (
    <Modal
      withCloseButton={props.withCloseButton || false}
      padding={props.padding || 0}
      centered={props.centered || true}
      {...props}
      classNames={{
        modal: classes.modal,
      }}
    >

      {
        primaryLabel && (

          <Stack p={25} spacing={0}>

            <Text
              weight={600}
              color="black"
              size="xl"
              align="center"
            >
              {primaryLabel}
            </Text>

            {
              secondaryLabel && (
                <Text
                  size="sm"
                  color="gray"
                  align="center"
                >
                  {secondaryLabel}
                </Text>
              )
            }
          </Stack>
        )
      }

      <UnstyledButton className={classes.modalBtn} onClick={onDelete}>
        Delete
      </UnstyledButton>
      <UnstyledButton
        className={classes.modalBtn}
        onClick={props.onClose}
      >
        Cancel
      </UnstyledButton>
    </Modal>
  );
}

export default DeleteModal;
