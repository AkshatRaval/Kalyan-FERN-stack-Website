import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
    baseURL: "http://localhost:5000"
})

api.interceptors.request.use(async (config) => {
  try {
    const user = getAuth().currentUser;
    if (user) {
      const token = await user.getIdToken(); // get current fresh ID token
      config.headers.Authorization = `Bearer ${token}`;
      // console.log(token
    }
  } catch (err) {
    console.error("Failed to attach token", err);
  }
  return config;
});

export default api