import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ViewMoreText from './ViewMoreText';

test('when text is less than 100 characters, it should not display view more button', () => {
  const text = 'This is a short text';
  render(<ViewMoreText text={text} />);
  const viewMoreButton = screen.queryByRole('button');

  expect(viewMoreButton).not.toBeInTheDocument();
});

test('when text is less than 100 characters, it should display the text', () => {
  const text = 'This is a short text';
  render(<ViewMoreText text={text} />);
  const textElement = screen.getByText(text);

  expect(textElement).toBeVisible();
});

test('when text is greater than 100 characters, it should display view more button', () => {
  const text = 'This is a long text'.repeat(10);
  render(<ViewMoreText text={text} />);
  const viewMoreButton = screen.getByRole('button');

  expect(viewMoreButton).toBeVisible();
});

test('when text is greater than 100 characters, it should display the first 100 characters', () => {
  const text = 'This is a long text'.repeat(10);
  render(<ViewMoreText text={text} />);
  const textElement = screen.getByText(text.slice(0, 100).trim());

  expect(textElement).toBeVisible();
});

test('when view more button is clicked, it should display the full text', async () => {
  const text = 'This is a long text'.repeat(10);
  render(<ViewMoreText text={text} />);
  const viewMoreButton = screen.getByRole('button');
  const user = userEvent.setup();

  await user.click(viewMoreButton);

  const textElement = await screen.findByText(text);

  expect(textElement).toBeVisible();
});

test('when view more button is clicked, it should hide the view more button', async () => {
  const text = 'This is a long text'.repeat(10);
  render(<ViewMoreText text={text} />);
  const viewMoreButton = screen.getByRole('button');
  const user = userEvent.setup();

  await user.click(viewMoreButton);

  const viewMoreButtonAfterClick = screen.queryByRole('button');

  expect(viewMoreButtonAfterClick).not.toBeInTheDocument();
});
