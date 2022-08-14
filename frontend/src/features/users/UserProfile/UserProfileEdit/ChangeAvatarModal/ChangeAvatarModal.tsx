import {
  Modal,
  ModalProps,
  Divider,
  UnstyledButton,
} from '@mantine/core';
import useStyles from './ChangeAvatarModal.styles';

interface ChangeAvatarModalProps extends ModalProps {
  handleFileInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void,
  setModalOpened: (value: React.SetStateAction<boolean>) => void,
  onRemoveBtnClick: () => void,
}

function ChangeAvatarModal({
  handleFileInputChange,
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
        onChange={(e) => handleFileInputChange(e)}
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
