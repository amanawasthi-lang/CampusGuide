import axios from "axios";

const API = axios.create({
  baseURL: "https://amanawasthi-campusguide-ai.hf.space",
});

export default API;