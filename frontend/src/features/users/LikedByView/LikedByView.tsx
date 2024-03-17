import { Container } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import UsersPreviewList from '../../../common/components/UsersPreviewList/UsersPreviewList';
import GoBackNavbar from '../../../common/components/Navbars/GoBackNavbar/GoBackNavbar';
import { selectAllUsers, useGetEntityLikeUsersByIDQuery } from '../../../app/apiSlice';
import { useAppSelector } from '../../../common/hooks/selector-dispatch-hooks';
import useStyles from './LikedByView.styles';

interface LikedByViewProps {
  entityModel: 'Post' | 'Comment',
}

function LikedByView({ entityModel }: LikedByViewProps) {
  const { postId, commentId } = useParams();
  const entityId = (entityModel === 'Post' ? postId : commentId) as string;
  const { data, isSuccess } = useGetEntityLikeUsersByIDQuery(entityId, {
    refetchOnMountOrArgChange: true,
  });
  const likedByUsernames = (isSuccess ? data.likes : []).map((user) => user.username);
  const allUsers = useAppSelector(selectAllUsers);
  const likedByUsers = allUsers.filter((user) => likedByUsernames.includes(user.username));
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');
  const { classes } = useStyles();

  return (
    <>
      <GoBackNavbar text="Likes" />

      <Container
        size={isMediumScreenOrWider ? 'xs' : 'md'}
        className={classes.container}
      >
        <UsersPreviewList users={likedByUsers} />
      </Container>
    </>
  );
}

export default LikedByView;
