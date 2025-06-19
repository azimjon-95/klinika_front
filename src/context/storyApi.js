import { api } from "./api";

export const storyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllStories: builder.query({
            query: ({ startDay, endDay } = {}) => {
                const params = new URLSearchParams({
                    startDay: startDay,
                    endDay: endDay,
                });
                return `/story/all?${params.toString()}`;
            },
        }),
        getStoriesByPatientId: builder.query({
            query: (id) => `/story/patient/${id}`,
        }),
        getStoriesByDoctorId: builder.query({
            query: (id) => `/story/doctor/${id}`,
        }),
        updateStory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/story/update/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        //.get("/story/patients-by-doctor",
        getStoriesByDoctor: builder.query({
            query: (doctorId) => `/story/patients-by-doctor/${doctorId}`,
            providesTags: (result, error, doctorId) => [{ type: 'DoctorStories', id: doctorId }],
        }),
        getTodaysStoryVisit: builder.query({
            query: ({ workerId, userId } = {}) => {
                const doctorId = `doctorId=${workerId}`;
                const id = `_id=${userId}`;
                return `/story/todayVisit?${doctorId}&${id}`;
            },
        }),

        visitPatient: builder.mutation({
            query: ({ id, consultationData, files }) => {
                const formData = new FormData();

                // Append text fields
                formData.append("diagnosis", consultationData.diagnosis);
                formData.append("prescription", consultationData.prescription);
                formData.append("recommendations", consultationData.recommendations);
                formData.append("description", consultationData.description);

                // Append files
                files.forEach((file, index) => {
                    formData.append("uploadedFiles", file);
                });

                return {
                    url: `/story/visit/${id}`,
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { workerId }) => [
                { type: "DoctorStories", id: workerId },
            ],
        }),

        getRedirectedPatients: builder.query({
            query: () => `/story/redirected`,
        }),
        updateRedirectedPatient: builder.mutation({
            query: (data) => ({
                url: `/story/updateRedirect`,
                method: 'POST',
                body: data,
            }),
        }),
        redirectPatient: builder.mutation({
            query: (data) => ({
                url: `/story/redirect`,
                method: 'POST',
                body: data,
            }),
        }),

        //=======================
        // New endpoints for the requested routes
        getAllPatientsStory: builder.query({
            query: () => `/patientsStory`,
            providesTags: ["PatientsStory"],
        }),
        getPatientStoryById: builder.query({
            query: (patientId) => `/patientsStory/${patientId}`,
            providesTags: (result, error, patientId) => [
                { type: "PatientStory", id: patientId },
            ],
        }),
        getPatientsStoryByDoctorId: builder.query({
            query: (doctorId) => `/doctors/${doctorId}/patientsStory`,
            providesTags: (result, error, doctorId) => [
                { type: "DoctorPatientsStory", id: doctorId },
            ],
        }),
        submitAnalis: builder.mutation({
            query: (data) => ({
                url: 'analis/submit', // Replace with your endpoint
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetAllStoriesQuery,
    useGetStoriesByPatientIdQuery,
    useGetStoriesByDoctorIdQuery,
    useUpdateStoryMutation,
    useGetStoriesByDoctorQuery,
    useGetTodaysStoryVisitQuery,
    useVisitPatientMutation,
    useGetRedirectedPatientsQuery,
    useUpdateRedirectedPatientMutation,
    useRedirectPatientMutation,

    // New hooks for the added endpoints
    useGetAllPatientsStoryQuery,
    useGetPatientStoryByIdQuery,
    useGetPatientsStoryByDoctorIdQuery,
    useSubmitAnalisMutation
} = storyApi;

