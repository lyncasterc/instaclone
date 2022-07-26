import {
  Modal,
  ModalProps,
  Divider,
  UnstyledButton,
} from '@mantine/core';
import { FormikHelpers } from 'formik';
import useStyles from './ChangeAvatarModal.styles';

interface ChangeAvatarModalProps extends ModalProps {
  setFieldValue: FormikHelpers<void>['setFieldValue'],
  handleFileInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<void>['setFieldValue']
  ) => void,
  setModalOpened: (value: React.SetStateAction<boolean>) => void,
  onRemoveBtnClick: () => void,
}

function ChangeAvatarModal({
  handleFileInputChange,
  setFieldValue,
  setModalOpened,
  onRemoveBtnClick,
  ...props
}: ChangeAvatarModalProps) {
  const { cx, classes } = useStyles();

  return (
    <Modal
      title="Change Profile Photo"
      withCloseButton={false}
      {...props}
      classNames={{
        title: classes.title,
        header: classes.header,
        modal: classes.modal,
        inner: classes.inner,
      }}
      padding={0}
    >

      <UnstyledButton
        className={cx(classes.modalBtn, classes.modalUploadBtn)}
      >
        <label htmlFor="modalImageUpload">
          Upload Photo
        </label>
      </UnstyledButton>

      <input
        type="file"
        name="image"
        id="modalImageUpload"
        style={{ display: 'none' }}
        onChange={(e) => handleFileInputChange(e, setFieldValue)}
        accept="image/gif, image/png, image/jpeg"
      />

      <Divider />

      <UnstyledButton
        className={cx(classes.modalBtn, classes.modalRemoveBtn)}
        onClick={onRemoveBtnClick}
      >
        Remove Current Photo
      </UnstyledButton>
      <Divider />

      <UnstyledButton
        className={cx(classes.modalBtn, classes.modalCancelBtn)}
        onClick={() => setModalOpened(false)}
      >
        Cancel
      </UnstyledButton>

    </Modal>
  );
}

export default ChangeAvatarModal;
