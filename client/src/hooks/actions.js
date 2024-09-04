import axios from "axios";
import { api } from "./apis";

export const Actions = {
    Login: async (data) => {
        return await axios.post(`${api}/login`, { ...data });
    },
    Register: async (data) => {
        const endpoint = data.accountType === "Student"
            ? `/register/student?refrelid=${data.refrelid}`
            : `/register`;
        return await axios.post(`${api}${endpoint}`, { ...data });
    },
    VerifyAccount: async (data) => {
        return await axios.post(`${api}/verifyaccount?token=${data.accountid}`);
    },
    VerifyMentorAccount: async (data) => {
        return await axios.post(`${api}/verifyaccount?token=${data.accountid}`);
    },

    fetchMentor: async () => {
        return await axios.get(`${api}/mentordata`);
    },

    updateMentor: async (data) => {
        return await axios.post(`${api}/updatementor`, { ...data });
    },
    resetPassword: async (data) => {
        return await axios.post(`${api}/resetpassword`, { ...data });
    },
    forgotPassword: async (data) => {
        return await axios.post(`${api}/forgotpassword`, { ...data });
    },
    resendVerification: async (data) => {
        return await axios.post(`${api}/resendverification`, { ...data });
    },
    reportIncident: async (data) => {
        return await axios.post(`${api}/reportincident`, { ...data });
    },
    fetchCourse: async (data) => {
        return await axios.get(`${api}/course?courseid=${data.courseid}`);
    }
};

export const getApplicationStatistics = async (userId) => {
    try {
        const response = await axios.get(`${api}/statistics/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch application statistics');
    }
};