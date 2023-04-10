import { app } from "../../firebase/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { authSlice } from "./auth-slice";
const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;

const auth = getAuth(app);

export const authSignUpUser =
  ({ nickname, userImage, email, password }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: nickname,
        photoURL: userImage,
      });

      console.log(auth.currentUser);

      const { displayName, photoURL, uid } = auth.currentUser;

      dispatch(
        updateUserProfile({
          userId: uid,
          nickName: displayName,
          userBgImage: photoURL,
        })
      );
      console.log(updateUserProfile);
    } catch (error) {
      console.log("error.message", error.message);
    }
  };
export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("error.message", error.message);
    }
  };
export const authRemoveUserImg = () => async (dispatch, getState) => {
  try {
    await updateProfile(auth.currentUser, {
      photoURL: "",
    });
    console.log(auth.currentUser);
    const { displayName, photoURL, uid } = auth.currentUser;

    dispatch(
      updateUserProfile({
        userId: uid,
        nickName: displayName,
        userBgImage: photoURL,
      })
    );
    console.log(updateUserProfile);
  } catch (error) {
    console.log("error.message", error.message);
  }
};

export const authSignOutUser = () => async (dispatch, getState) => {
  await signOut(auth);
  dispatch(authSignOut());
};

export const authAddUserImg = (userImage) => async (dispatch, getState) => {
  try {
    await updateProfile(auth.currentUser, {
      photoURL: userImage,
    });
    console.log(auth.currentUser);
    const { displayName, photoURL, uid } = auth.currentUser;

    dispatch(
      updateUserProfile({
        userId: uid,
        nickName: displayName,
        userBgImage: photoURL,
      })
    );
    console.log(updateUserProfile);
  } catch (error) {
    console.log("error.message", error.message);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        updateUserProfile({
          userId: user.uid,
          nickName: user.displayName,
          userBgImage: user.photoURL,
        })
      );

      dispatch(
        authStateChange({
          stateChange: true,
        })
      );
    }
  });
};
