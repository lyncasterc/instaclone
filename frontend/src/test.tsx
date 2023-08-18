import { Modal } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Test() {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
        navigate(-1);
      }}
    >
      lol
    </Modal>
  );
}

export default Test;
