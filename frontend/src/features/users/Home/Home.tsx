import useAuth from '../../../common/hooks/useAuth';
import HomeNavbar from './HomeNavbar/HomeNavbar';

function Home() {
  const [user] = useAuth();
  return (
    <>
      <HomeNavbar />
      <p>{user}</p>
    </>
  );
}

export default Home;
