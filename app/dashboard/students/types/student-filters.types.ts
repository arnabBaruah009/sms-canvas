export interface StudentDobRangeDto {
    from?: string;
    to?: string;
}

export interface StudentFiltersOps {
    searchQuery?: string;
    gender?: string;
    dobRange?: StudentDobRangeDto;
    class?: string;
    section?: string;
    rollNumber?: string;
}