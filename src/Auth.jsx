import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "./firebase";

export default function Auth({ setUser, close }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const signup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser(userCred.user);
      alert("Account created successfully!");
      close();

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  
  const login = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser(userCred.user);
      alert("Login successful!");
      close();

    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };


  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      setUser(result.user);
      alert("Google login successful!");
      close();

    } catch (error) {
      alert("Google login failed. Try again.");
    }
  };

  return (
    <div
      className="modal show fade"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Login / Signup</h5>

            <button
              type="button"
              className="btn-close"
              onClick={close}
            />
          </div>

          <div className="modal-body">

            <input
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="btn btn-primary w-100 mb-2"
              onClick={login}
            >
              Login
            </button>

            <button
              className="btn btn-success w-100 mb-2"
              onClick={signup}
            >
              Signup
            </button>

            <button
              className="btn btn-danger w-100"
              onClick={googleLogin}
            >
              Sign in with Google
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}