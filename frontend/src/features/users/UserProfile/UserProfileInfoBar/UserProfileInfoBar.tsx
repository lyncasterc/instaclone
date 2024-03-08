import {
  Group,
  Text,
} from '@mantine/core';
import { Link } from 'react-router-dom';
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
  const { classes, cx } = useStyles();

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
          {postCount === 1 ? 'post' : 'posts'}
        </Text>
      </div>

      <div
        className={classes.item}
      >
        <Link to="followers" className={cx(classes.link)}>

          <Text
            weight={600}
          >
            {numberFormatter(followerCount)}
          </Text>
          <Text
            className={classes.itemLabel}
          >
            {followerCount === 1 ? 'follower' : 'followers'}
          </Text>
        </Link>
      </div>

      <div
        className={classes.item}
      >
        <Link to="following" className={cx(classes.link)}>
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
        </Link>
      </div>
    </Group>

  );
}

export default UserProfileInfoBar;
