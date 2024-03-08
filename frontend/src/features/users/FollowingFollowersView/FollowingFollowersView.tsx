import { useParams, useLocation } from 'react-router-dom';
import { TextInput, Container } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import useStyles from './FollowingFollowersView.styles';
import { selectAllUsers, selectUserByUsername } from '../../../app/apiSlice';
import { useAppSelector } from '../../../common/hooks/selector-dispatch-hooks';
import GoBackNavbar from '../../../common/components/Navbars/GoBackNavbar/GoBackNavbar';
import UsersPreviewList from '../../../common/components/UsersPreviewList/UsersPreviewList';

function FollowingFollowersView() {
  const { classes } = useStyles();
  const { username } = useParams();
  const selectedUser = username ? useAppSelector(
    (state) => selectUserByUsername(state, username),
  ) : undefined;
  const users = useAppSelector(selectAllUsers);
  const location = useLocation();
  const mode = /following/i.test(location.pathname) ? 'following' : 'followers';
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');

  // doing it this way because the user's followers and following don't have the image populated
  const followersFollowingUsernames = selectedUser ? selectedUser[mode]?.map(
    (user) => user.username,
  ) : [];
  const filteredUsers = users.filter(
    (user) => followersFollowingUsernames?.includes(user.username),
  );
  const [filter, setFilter] = useState('');
  const newFilteredUsers = filteredUsers.filter(
    (user) => `${user.username}${user.fullName}`.toLowerCase().includes(filter.toLowerCase().trim()),
  );

  if (!selectedUser) {
    return (
      <>
        Sorry, this page isn&apos;t available.
      </>
    );
  }

  return (
    <>
      <GoBackNavbar text={username!} />

      <Container size={isMediumScreenOrWider ? 'xs' : 'md'} className={classes.container}>
        <TextInput
          icon={<IconSearch />}
          placeholder="Search"
          classNames={{
            input: classes.searchInput,
            root: classes.searchInputRoot,
          }}
          onChange={(e) => setFilter(e.currentTarget.value)}
        />

        <UsersPreviewList users={newFilteredUsers} />

        {
          newFilteredUsers.length === 0 && (
            <div className={classes.noResultsContainer}>
              No results found
            </div>
          )
        }
      </Container>
    </>
  );
}

export default FollowingFollowersView;
