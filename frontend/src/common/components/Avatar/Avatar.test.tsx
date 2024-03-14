import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';
import '@testing-library/jest-dom/extend-expect';
import placeHolderIcon from '../../../assets/placeholder-icon.jpeg';

test('renders placeholder icon when no image is provided', () => {
  render(<Avatar />);
  const avatar = screen.getByRole('img');
  expect(avatar).toHaveAttribute('src', placeHolderIcon);
  expect(avatar).toHaveAttribute('alt', '');
});

test('renders placeholder icon when src is empty', () => {
  render(<Avatar src="" />);
  const avatar = screen.getByRole('img');
  expect(avatar).toHaveAttribute('src', placeHolderIcon);
  expect(avatar).toHaveAttribute('alt', '');
});

test('renders image when image is provided', () => {
  const image = 'https://example.com/image.png';

  render(<Avatar src={image} alt="example" />);

  const avatar = screen.getByRole('img');
  expect(avatar).toHaveAttribute('src', image);
  expect(avatar).toHaveAttribute('alt', 'example');
});
