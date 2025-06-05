
import './App.css'
import UsernamePrompt from './components/UsernamePrompt';
import Editor from './components/Editor';
import { useUser } from './context/UserContext';
// import { doc, setDoc } from 'firebase/firestore';
// import { db } from './firebase/firebase';

function App() {
   const { username } = useUser();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-tr from-black  to-green-800">
      {username ? <Editor /> : <UsernamePrompt />}
    </div>
    
    {/* <button
  className="bg-blue-500  px-4 py-1 rounded mt-4"
  onClick={async () => {
    await setDoc(doc(db, "documents", "main-room"), {
      content: "Hello from debug button",
      lastEditedBy: "debug-user",
      timestamp: Date.now(),
    });
    console.log("✅ Document written!");
  }}
>
  Debug Write
</button> */}

    </>
  )
}

export default App
