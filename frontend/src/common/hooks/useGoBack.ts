import { useNavigate } from 'react-router-dom';

const useGoBack = () => {
  const navigate = useNavigate();

  /**
   * Navigates back to the previous page in the history stack.
   * If there is no previous page, navigates to the home page.
   */
  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return goBack;
};

export default useGoBack;
