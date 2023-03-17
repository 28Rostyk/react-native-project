import db from "../../firebase/config";
import { authSlice } from "./auth-slice";

const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;

export const authSignUpUser =
  ({ nickname, email, password }) =>
  async (dispatch, getState) => {
    try {
      await db.auth().createUserWithEmailAndPassword(email, password);

      const user = await db.auth().currentUser;

      await user.updateProfile({
        displayName: nickname,
      });

      const { displayName, uid } = await db.auth().currentUser;

      const userUpdateProfile = {
        nickName: displayName,
        userId: uid,
      };

      dispatch(updateUserProfile(userUpdateProfile));
      // dispatch(updateUserProfile({ userId: user.uid }));
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      await db.auth().signInWithEmailAndPassword(email, password);
      const user = await db.auth().currentUser;
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  await db.auth().signOut();
  dispatch(authSignOut());
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  await db.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const userUpdateProfile = {
        nickName: user.displayName,
        userId: user.uid,
      };

      try {
        await dispatch(authStateChange({ stateChange: true }));
        await dispatch(updateUserProfile(userUpdateProfile));
      } catch (error) {
        console.error(error);
      }
    }
  });
};
