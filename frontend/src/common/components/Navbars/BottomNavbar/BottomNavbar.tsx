import {
  IconHome,
  IconSquarePlus,
  IconSearch,
  IconHeart,
} from '@tabler/icons-react';
import { Link, Navigate } from 'react-router-dom';
import { Avatar, Group, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import useStyles from './BottomNavbar.styles';

interface BottomNavBarProps {
  user: string | null,
}

// TODO: render a blank bar when not logged in
function BottomNavBar({ user }: BottomNavBarProps) {
  const { classes } = useStyles();
  const [image, setImage] = useState('');

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        setImage(fileReader.result as string);
      }
    };

    fileReader.onloadend = () => {
      setImage('');
    };

    fileReader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Group
      className={classes.container}
      position="apart"
      data-cy="bottom-nav"
    >

      <Link
        to="/"
      >
        <IconHome
          size={30}
          strokeWidth={1.5}
          color="black"
        />
      </Link>

      <Link
        to="/"
      >
        <IconSearch
          size={30}
          strokeWidth={1.5}
          color="black"
        />
      </Link>

      <UnstyledButton>
        <label htmlFor="postImageUpload">
          <IconSquarePlus
            size={30}
            strokeWidth={1.5}
            color="black"
          />
        </label>
      </UnstyledButton>

      <input
        type="file"
        name="image"
        id="postImageUpload"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        accept="image/gif, image/png, image/jpeg"
        data-testid="postImageUpload"
      />

      {
        image && (
          <Navigate
            to="/create/edit"
            state={{
              image,
            }}
          />
        )
      }

      <Link
        to="/"
      >
        <IconHeart
          size={30}
          strokeWidth={1.5}
          color="black"
        />
      </Link>

      <Avatar
        component={Link}
        to={`/${user}`}
        radius="xl"
        data-testid="bottom-nav-avatar"
      />

    </Group>
  );
}

export default BottomNavBar;
