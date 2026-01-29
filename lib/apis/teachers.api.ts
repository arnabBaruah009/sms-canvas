import { apiSetup } from "./api-setup";
import type {
  GetTeachersResponse,
  GetTeacherResponse,
  Teacher,
} from "@/app/dashboard/teachers/types/teacher.types";

const MOCK_TEACHERS: Teacher[] = [
  {
    id: "T001",
    firstName: "John",
    lastName: "Williams",
    name: "John Williams",
    year: 2018,
    gender: "Male",
    subjects: ["Mathematics", "Physics"],
    experience: [
      {
        yearFrom: 2012,
        yearTo: 2015,
        description: "Senior Teacher at ABC High School, Mumbai.",
      },
      {
        yearFrom: 2015,
        yearTo: 2018,
        description: "Head of Science at XYZ Academy, Delhi.",
      },
    ],
    education: [
      {
        yearFrom: 2004,
        yearTo: 2008,
        description: "B.Sc. Mathematics at State University.",
      },
      {
        yearFrom: 2008,
        yearTo: 2010,
        description: "M.Sc. Physics at Central College.",
      },
    ],
    email: "john.williams@school.com",
    mobile: "+247 555 100",
    department: "Science",
    about: "Dedicated to making mathematics and physics accessible and engaging.",
  },
  {
    id: "T002",
    firstName: "Sarah",
    lastName: "Chen",
    name: "Sarah Chen",
    year: 2019,
    gender: "Female",
    subjects: ["English", "Literature"],
    experience: [
      {
        yearFrom: 2016,
        yearTo: 2019,
        description: "English Teacher at Riverside School, Bangalore.",
      },
    ],
    education: [
      {
        yearFrom: 2012,
        yearTo: 2014,
        description: "M.A. English Literature at University of Arts.",
      },
      {
        yearFrom: 2014,
        yearTo: 2015,
        description: "B.Ed. at National College of Education.",
      },
    ],
    email: "sarah.chen@school.com",
    mobile: "+247 555 101",
    department: "Humanities",
    about: "Passionate about literature and creative writing.",
  },
  {
    id: "T003",
    firstName: "Raj",
    lastName: "Kumar",
    name: "Raj Kumar",
    year: 2017,
    gender: "Male",
    subjects: ["Computer Science", "Programming"],
    experience: [
      {
        yearFrom: 2010,
        yearTo: 2014,
        description: "Software Engineer at Tech Corp.",
      },
      {
        yearFrom: 2014,
        yearTo: 2017,
        description: "IT Teacher at Digital School, Hyderabad.",
      },
    ],
    education: [
      {
        yearFrom: 2006,
        yearTo: 2010,
        description: "B.Tech Computer Science at Engineering College.",
      },
    ],
    email: "raj.kumar@school.com",
    mobile: "+247 555 102",
    department: "Computer Science",
    about: "Industry experience in software development; now teaching CS and programming.",
  },
];

export const teachersApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<GetTeachersResponse, void>({
      queryFn: async () => {
        return { data: { data: MOCK_TEACHERS } };
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({ type: "Teacher" as const, id })),
            { type: "Teacher", id: "LIST" },
          ]
          : [{ type: "Teacher", id: "LIST" }],
    }),
    getTeacherById: builder.query<GetTeacherResponse, string>({
      queryFn: async (id) => {
        const teacher = MOCK_TEACHERS.find((t) => t.id === id) ?? null;
        return { data: { data: teacher } };
      },
      providesTags: (_result, _error, id) => [{ type: "Teacher", id }],
    }),
  }),
});

export const { useGetTeachersQuery, useGetTeacherByIdQuery } = teachersApi;
