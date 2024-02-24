import { screen, renderWithRouter } from '../../../../test/utils/test-utils';
import GoBackNavbar from './GoBackNavbar';

test('if right component is passed, it is rendered', async () => {
  renderWithRouter(<GoBackNavbar text="test" rightComponent={<div>test of right component</div>} />);

  const right = await screen.findByText(/test of right component/i);

  expect(right).toBeVisible();
});

test('right component performs action when clicked on', async () => {
  let clicked = false;
  const handleClick = () => {
    clicked = true;
  };

  const { user } = renderWithRouter(
    <GoBackNavbar
      text="test"

      // eslint-disable-next-line max-len
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, react/jsx-props-no-multi-spaces
      rightComponent={<div onClick={handleClick}>test of right component</div>}
    />,
  );

  const right = await screen.findByText(/test of right component/i);
  await user.click(right);

  expect(clicked).toBe(true);
});
