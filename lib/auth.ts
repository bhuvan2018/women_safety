import { auth } from "./firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"

export const signUpUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

export const loginWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error("Error logging in with Google:", error)
    throw error
  }
}

export const loginAdmin = async (email: string, password: string): Promise<User | null> => {
  try {
    if (email === "officialpolice@gmail.com" && password === "officialpolice123@") {
      // For demo purposes, we're using the same auth instance
      // In a real app, you might want to use a separate auth instance for admins
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } else {
      console.log("Invalid admin credentials")
      return null
    }
  } catch (error) {
    console.error("Error logging in as admin:", error)
    throw error
  }
}

