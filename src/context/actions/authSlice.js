import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminFullname: localStorage.getItem("admin_fullname") || null,
    role: localStorage.getItem("role") || null,
    token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { adminFullname, role, token } = action.payload;
            state.adminFullname = adminFullname;
            state.role = role;
            state.token = token;
            localStorage.setItem("admin_fullname", adminFullname);
            localStorage.setItem("role", role);
            localStorage.setItem("token", token);
        },
        logout: (state) => {
            state.adminFullname = null;
            state.role = null;
            state.token = null;
            ["token", "role", "admin_fullname"].forEach((item) =>
                localStorage.removeItem(item)
            );
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;