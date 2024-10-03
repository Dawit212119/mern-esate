import { app } from "../firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleGoogleAuth() {
    try {
      dispatch(signInStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();

      if (data.success === false) throw new Error(data.message);
      dispatch(signInSuccess(data));

      navigate("/");
    } catch (error) {
      console.log(error.message);
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <button
      type="button"
      className="text-white bg-red-700 p-3 uppercase rounded-lg hover:opacity-95"
      onClick={handleGoogleAuth}
    >
      continue with google
    </button>
  );
}

export default OAuth;
