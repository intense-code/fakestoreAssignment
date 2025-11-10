// src/utils/auth.js
export const isAuthed = () => Boolean(localStorage.getItem("token"));
export const login = (token) => localStorage.setItem("token", token);
export const logout = () => localStorage.removeItem("token");
