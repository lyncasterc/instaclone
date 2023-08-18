import {
  Group,
  Text,
} from '@mantine/core';
import useStyles from './UserProfileInfoBar.styles';
import numberFormatter from './numberFormatter';

interface UserProfileInfoBarProps {
  postCount: number,
  followerCount: number,
  followingCount: number,
}

function UserProfileInfoBar({
  postCount,
  followerCount,
  followingCount,

}: UserProfileInfoBarProps) {
  const { classes } = useStyles();

  return (
    <Group
      position="apart"
      className={classes.container}
    >
      <div
        className={classes.item}
      >
        <Text
          weight={600}
        >
          {numberFormatter(postCount)}
        </Text>
        <Text
          className={classes.itemLabel}
        >
          posts
        </Text>
      </div>

      <div
        className={classes.item}
      >
        <Text
          weight={600}
        >
          {numberFormatter(followerCount)}
        </Text>
        <Text
          className={classes.itemLabel}
        >
          followers
        </Text>
      </div>

      <div
        className={classes.item}
      >
        <Text
          weight={600}
        >
          {numberFormatter(followingCount)}
        </Text>
        <Text
          className={classes.itemLabel}
        >
          following
        </Text>
      </div>
    </Group>

  );
}

export default UserProfileInfoBar;
