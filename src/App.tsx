
import { UserProvider, useUser } from './context/UserContext';
import Login from './components/Login';
import Editor from './components/Editor';

const App = () => (
  <UserProvider>
    <Main />
  </UserProvider>
);

const Main = () => {
  const { username } = useUser();
  return <>{username ? <Editor /> : <Login />}</>;
};

export default App;
