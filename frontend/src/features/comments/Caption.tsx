import { Text, Group, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import Avatar from '../../common/components/Avatar/Avatar';
import useStyles from './comments-captions.styles';
import ViewMoreText from '../../common/components/ViewMoreText/ViewMoreText';

interface CaptionProps {
  username: string,
  caption: string,
  postTimeStamp: string,
  creatorImage: string,
}

function Caption({
  username,
  caption,
  postTimeStamp,
  creatorImage,
}: CaptionProps) {
  const { classes } = useStyles();

  return (
    <Group spacing="sm">
      <Link to={`/users/${username}`} className={classes.avatarLink}>
        <Avatar src={creatorImage} alt={username} />
      </Link>
      <Stack
        spacing={0}
        styles={{
          root: {
            flex: '1 !important',
          },
        }}
      >
        <div>
          <span>
            <Text
              component={Link}
              to={`/users/${username}`}
              color="black"
              weight={700}
              size="sm"
              className={classes.activeOpacityLight}
            >
              {username}
            </Text>
          </span>
          {' '}
          <span>
            <ViewMoreText
              text={caption}
              size="sm"
              color="black"
              styles={{
                root: {
                  display: 'inline',
                  lineHeight: 1,
                },
              }}
            />
          </span>
        </div>
        <Text size="xs">{postTimeStamp}</Text>
      </Stack>
    </Group>
  );
}

export default Caption;
