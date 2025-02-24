import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB7gG1qr-AdyqaDqkDp_Tw1dVj6-NHy9e8",
  authDomain: "myauthapp-9c735.firebaseapp.com",
  projectId: "myauthapp-9c735",
  storageBucket: "myauthapp-9c735.firebasestorage.app",
  messagingSenderId: "526238519996",
  appId: "1:526238519996:web:7ca1c25500e64f6cf176b9",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }

