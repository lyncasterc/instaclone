/* eslint-disable no-param-reassign */
import { useParams } from 'react-router-dom';
import {
  Container,
  Divider,
  Text,
  Group,
  UnstyledButton,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import * as Yup from 'yup';
import {
  Formik, Form, Field, FormikHelpers,
} from 'formik';
import { useRef, useState, useEffect } from 'react';
import {
  useGetPostByIdQuery,
  useGetParentCommentsByPostIdQuery,
  useAddCommentMutation,
  selectUserByUsername,
} from '../../../app/apiSlice';
import GoBackNavbar from '../../../common/components/Navbars/GoBackNavbar/GoBackNavbar';
import getTimeSinceDate from '../../../common/utils/getTimeSinceDate';
import Caption from '../Caption';
import ParentComment from '../ParentComment';
import Avatar from '../../../common/components/Avatar/Avatar';
import useStyles from './CommentsView.styles';
import useAuth from '../../../common/hooks/useAuth';
import { useAppSelector } from '../../../common/hooks/selector-dispatch-hooks';
import DesktopNavbar from '../../../common/components/Navbars/DesktopNavbar/DesktopNavbar';

function CommentsView() {
  const { postId } = useParams();
  const { data: post, error } = useGetPostByIdQuery(postId!);
  const { data: parentComments } = useGetParentCommentsByPostIdQuery(postId!);
  const [addComment] = useAddCommentMutation();
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');
  const [currentUsername] = useAuth();
  const currentUser = currentUsername ? useAppSelector(
    (state) => selectUserByUsername(state, currentUsername),
  ) : null;
  const { classes } = useStyles();
  const [replyRecipientUsername, setReplyRecipientUsername] = useState('');
  const textarea = useRef<HTMLTextAreaElement>();

  // focuses on the textarea whenever the component mounts
  // or when user clicks on reply or the x button
  useEffect(() => {
    if (textarea.current) {
      textarea.current.focus();
    }
  }, [replyRecipientUsername]);

  if (post && !error) {
    const {
      caption, creator: { image, username }, createdAt,
    } = post;
    const postTimeStamp = getTimeSinceDate(new Date(createdAt), { isCommentFormat: true });
    const creatorImage = image?.url || '';
    const doesPostHaveComments = parentComments && parentComments.length > 0;
    const formattedParentComments = doesPostHaveComments ? [...parentComments]
      .sort((commentA, commentB) => {
        const isCurrentUserCommentAAuthor = commentA.author.username === currentUsername;
        const isCurrentUserCommentBAuthor = commentB.author.username === currentUsername;

        if (isCurrentUserCommentAAuthor && !isCurrentUserCommentBAuthor) {
          return -1;
        }

        if (isCurrentUserCommentBAuthor && !isCurrentUserCommentAAuthor) {
          return 1;
        }

        return commentB.createdAt.localeCompare(commentA.createdAt);
      }) : [];

    return (

      <>
        <GoBackNavbar text="Comments" />
        {
          !currentUsername && (
            <DesktopNavbar />
          )
        }
        <Container
          size={isMediumScreenOrWider ? 'xs' : 'md'}
          py="md"
          className={classes.container}
          sx={(theme) => ({
            height: !currentUsername && !isMediumScreenOrWider ? `calc(100vh - ${theme.other.topMobileNavHeight}px)` : 'auto',
            maxHeight: currentUsername && !isMediumScreenOrWider ? `calc(100vh - ${theme.other.topMobileNavHeight}px - ${theme.other.bottomMobileNavHeight}px - 71px)` : 'auto',
          })}
        >
          {
            caption && (
              <>
                <Caption
                  username={username}
                  caption={caption}
                  postTimeStamp={postTimeStamp}
                  creatorImage={creatorImage}
                />
                <Divider my="sm" />
              </>
            )
          }

          <Formik
            initialValues={{
              body: '',
            }}
            validationSchema={Yup.object({
              body: Yup.string()
                .required()
                .max(2200),
            })}
            onSubmit={async (
              values: { body: string, parentComment?: string },
              actions: FormikHelpers<{ body: string, parentComment?: string }>,
            ) => {
              try {
                await addComment({
                  body: values.body,
                  postId: postId!,
                  ...(values.parentComment && { parentComment: values.parentComment }),
                }).unwrap();
                setReplyRecipientUsername('');
                actions.resetForm();
              } catch (e) {
                console.error(e);
              }
            }}
          >
            {
              ({
                isValid,
                dirty,
                resetForm,
                submitForm,
              }) => (
                <>
                  {
                    !formattedParentComments.length ? (
                      <div className={classes.commentsContainer}>
                        <Text
                          align="center"
                          weight={700}
                          size="xl"
                          mt={10}
                          mb={5}
                        >
                          No comments yet.
                        </Text>
                        <Text
                          align="center"
                          size="sm"
                        >
                          Start the conversation.
                        </Text>
                      </div>
                    ) : (
                      <div className={classes.commentsContainer}>
                        {formattedParentComments.map((comment) => (
                          <ParentComment
                            key={comment.id}
                            comment={comment}
                            setReplyRecipientUsername={setReplyRecipientUsername}
                          />
                        ))}
                      </div>
                    )
                  }

                  {
                    currentUser && (

                      <Group className={classes.avatarFormContainer} spacing="xs">
                        <Avatar
                          src={currentUser.image?.url}
                          alt={username}
                        />
                        <Form className={classes.formContainer}>

                          {
                            replyRecipientUsername && (
                              <>
                                <Group px={5} position="apart">
                                  <Text
                                    size="sm"
                                    className={classes.replyingToText}
                                  >
                                    Replying to
                                    {' '}
                                    {replyRecipientUsername}
                                  </Text>

                                  <UnstyledButton
                                    onClick={() => {
                                      resetForm();
                                      setReplyRecipientUsername('');
                                    }}
                                  >
                                    <IconX size={18} />
                                  </UnstyledButton>
                                </Group>
                                <Divider my={8} />

                              </>
                            )
                          }

                          <Group>
                            <Field
                              innerRef={textarea}
                              as="textarea"
                              name="body"
                              className={classes.textarea}
                              rows="1"
                              placeholder="Add a comment..."
                              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                // auto-grows the textarea's height as the user types
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight + 2}px`;
                              }}
                              autoFocus
                              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  submitForm();
                                }
                              }}
                            />

                            {
                              (replyRecipientUsername || (isValid && dirty)) && (
                                <UnstyledButton type="submit">
                                  <Text
                                    className={classes.submitButtonText}
                                  >
                                    Post
                                  </Text>
                                </UnstyledButton>
                              )
                            }
                          </Group>

                        </Form>
                      </Group>
                    )
                  }
                </>
              )
            }
          </Formik>

        </Container>
      </>

    );
  }

  return (
    <>
      Sorry, this page isn&apos;t available.
    </>
  );
}

export default CommentsView;
