import { Gender, UserRole } from "../types/profile.types";

export const roleLabels: Record<UserRole, string> = {
    admin: "Admin",
    teacher: "Teacher",
    staff: "Staff",
    student: "Student",
};

export const genderLabels: Record<Gender, string> = {
    male: "Male",
    female: "Female",
    other: "Other",
};