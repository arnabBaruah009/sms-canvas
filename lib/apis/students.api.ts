import { apiSetup } from "./api-setup";
import type {
  GetStudentsResponse,
  GetStudentResponse,
  Student,
} from "@/app/dashboard/students/types/student.types";

const MOCK_STUDENTS: Student[] = [
  {
    id: "245689",
    firstName: "Rolles",
    lastName: "Duk",
    name: "Rolles Duk",
    mobile: "+247 890 320",
    email: "rolles@gmail.com",
    gender: "Male",
    dob: "15/08/1997",
    address: "10/B Mumbai, MH, India",
    department: "General Computer Science",
    about:
      "Focused on software engineering and system design. Active in open source and campus tech events.",
    education: [
      {
        yearFrom: 2006,
        yearTo: 2007,
        description: "Secondary Schooling at xyz school of secondary education, Mumbai.",
      },
      {
        yearFrom: 2010,
        yearTo: 2011,
        description: "Bachelor of Science at Abc College of Art and Science, Chennai.",
      },
    ],
  },
  {
    id: "245690",
    firstName: "Marke Angel",
    lastName: "Smith",
    name: "Marke Angel Smith",
    mobile: "+247 890 321",
    email: "Smith@gmail.com",
    gender: "Male",
    dob: "20/12/1998",
    address: "12/A California, CA, USA",
    department: "General Computer Science",
    about:
      "Research interest in machine learning and data science. Published papers in college journal.",
    education: [
      {
        yearFrom: 2008,
        yearTo: 2009,
        description: "Secondary Schooling at xyz school of secondary education, Mumbai.",
      },
      {
        yearFrom: 2011,
        yearTo: 2012,
        description: "Bachelor of Science at Abc College of Art and Science, Chennai.",
      },
      {
        yearFrom: 2012,
        yearTo: 2015,
        description: "Master of Science at Cdm College of Engineering and Technology.",
      },
    ],
  },
  {
    id: "245691",
    firstName: "Jane",
    lastName: "Doe",
    name: "Jane Doe",
    mobile: "+247 890 322",
    email: "jane.doe@gmail.com",
    gender: "Female",
    dob: "05/03/1999",
    address: "7/C Bangalore, KA, India",
    department: "Information Technology",
    about: "Specializing in full-stack development and cloud technologies.",
    education: [
      {
        yearFrom: 2009,
        yearTo: 2010,
        description: "Higher Secondary at ABC School, Bangalore.",
      },
      {
        yearFrom: 2012,
        yearTo: 2016,
        description: "B.Tech at XYZ Engineering College, Karnataka.",
      },
    ],
  },
];

export const studentsApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<GetStudentsResponse, void>({
      queryFn: async () => {
        return { data: { data: MOCK_STUDENTS } };
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({ type: "Student" as const, id })),
            { type: "Student", id: "LIST" },
          ]
          : [{ type: "Student", id: "LIST" }],
    }),
    getStudentById: builder.query<GetStudentResponse, string>({
      queryFn: async (id) => {
        const student = MOCK_STUDENTS.find((s) => s.id === id) ?? null;
        return { data: { data: student } };
      },
      providesTags: (_result, _error, id) => [{ type: "Student", id }],
    }),
  }),
});

export const { useGetStudentsQuery, useGetStudentByIdQuery } = studentsApi;
