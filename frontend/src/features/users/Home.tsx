import useAuth from '../../common/hooks/useAuth';

function Home() {
  const [user] = useAuth();
  return (
    <p>{user}</p>
  );
}

export default Home;
