import {
  Avatar,
  Text,
  Container,
  Button,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import useStyles from './UserProfileInfo.styles';
import { User } from '../../../app/types';
import UserProfileInfoBar from './UserProfileInfoBar/UserProfileInfoBar';

interface UserProfileInfoProps {
  user: User,
  isCurrentUserLoggedIn: boolean,
  isCurrentUserProfile?: boolean,
}

function UserProfileInfo({
  user,
  isCurrentUserProfile,
  isCurrentUserLoggedIn,
}: UserProfileInfoProps) {
  const { classes, cx } = useStyles();
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');

  const buttons = () => {
    if (isCurrentUserProfile) {
      return (
        <Button
          classNames={{
            root: cx(classes.buttonRoot, classes.editButtonRoot),
            outline: classes.buttonOutline,
          }}
          variant="outline"
          component={Link}
          to="/accounts/edit"
        >
          Edit Profile
        </Button>
      );
    }

    if (isCurrentUserLoggedIn) {
      return (
        <div
          className={classes.mainSectionButtonGroup}
        >
          <Button
            classNames={{
              root: classes.buttonRoot,
              outline: classes.buttonOutline,
            }}
            variant="outline"
            component={Link}
            to="/"
          >
            Message
          </Button>
          <Button
            classNames={{
              root: cx(classes.buttonRoot, classes.followButtonRoot),
            }}
            component={Link}
            to="/"
          >
            Follow
          </Button>
        </div>
      );
    }

    return (null);
  };

  // TODO: replace lorem with real bio (have to add bio field to user backend?)
  const bio = () => (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      <Text weight={600}>
        {user.fullName}
      </Text>
      <Text>
        Lorem ipsum dolor
        sit amet consectetur adipisicing elit.
        Reprehenderit, facere?
      </Text>
    </div>
  );

  return (
    <Container
      size="md"
      className={classes.container}
    >
      <div className={classes.mainSection}>
        <Avatar
          src={user.image}
          radius="xl"
          classNames={{
            root: classes.avatarRoot,
            placeholder: classes.avatarPlaceholder,
          }}
        />

        <div className={classes.mainSectionRight}>
          <div
            className={classes.mainSectionNameBtns}
          >
            <Text
              className={classes.mainSectionUsername}
            >
              {user.username}
            </Text>
            {buttons()}
          </div>
          {
            isMediumScreenOrWider && (
              <>
                <UserProfileInfoBar
                  postCount={user.posts?.length ?? 0}
                  followerCount={user.followers?.length ?? 0}
                  followingCount={user.following?.length ?? 0}
                />
                {bio()}
              </>
            )
          }
        </div>

      </div>

      {
        !isMediumScreenOrWider && bio()
      }

    </Container>
  );
}

UserProfileInfo.defaultProps = {
  isCurrentUserProfile: false,
};

export default UserProfileInfo;
