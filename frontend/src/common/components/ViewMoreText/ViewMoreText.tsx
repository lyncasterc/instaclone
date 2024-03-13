import { Text, TextProps, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import useStyles from './ViewMoreText.styles';

interface ViewMoreTextProps extends TextProps<'div'> {
  text: string;
}

function ViewMoreText({ text, ...rest }: ViewMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldDisplayViewMore = text.length > 100 && !isExpanded;
  const { classes } = useStyles();

  return (
    <Text {...rest}>
      {
        shouldDisplayViewMore ? (
          <>
            <span>
              {text.slice(0, 100).trim()}
            </span>
            ...&nbsp;&nbsp;
            <UnstyledButton
              onClick={() => setIsExpanded(true)}
              className={classes.viewMoreBtn}
            >
              more
            </UnstyledButton>
          </>
        ) : text
      }
    </Text>
  );
}

export default ViewMoreText;
