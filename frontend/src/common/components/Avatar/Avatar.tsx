import { Avatar as MantineAvatar, AvatarProps as MantineAvatarProps } from '@mantine/core';
import placeholderIcon from '../../../assets/placeholder-icon.jpeg';

function Avatar({ ...props }: MantineAvatarProps<'div'>) {
  return (
    <MantineAvatar
      {...props}
      radius={props.radius || 'xl'}
    >
      <div>
        <img
          src={placeholderIcon}
          alt=""
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </MantineAvatar>
  );
}

export default Avatar;
