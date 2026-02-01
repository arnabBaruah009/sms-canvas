/** Populated when backend uses .populate('createdBy') */
export interface AllowListCreatedBy {
  name?: string;
  phone_number?: string;
}

export interface AllowList {
  _id: string;
  phone: string;
  createdBy: AllowListCreatedBy;
  deleted_at?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllowListResponse {
  data: AllowList[];
  message?: string;
}

export interface CreateAllowListDto {
  phone: string;
}

export interface CreateAllowListResponse {
  data: AllowList;
  message?: string;
}
