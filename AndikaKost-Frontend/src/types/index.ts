export type Role = "admin" | "tenant";

export type ApiSuccess<T> = { data: T; message: string };

export type UserMe = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: Role;
};

export type Room = {
  id: number;
  room_number: string;
  room_type: string | null;
  floor: string | null;
  price_idr: number;
  facilities: string | null;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Tenant = {
  id: number;
  user_id: number;
  room_id: number | null;
  email: string;
  full_name: string;
  phone: string | null;
  identity_number: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  move_in_date: string;
  move_out_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: number;
  tenant_id: number;
  room_id: number;
  billing_month: string;
  amount_idr: number;
  due_date: string;
  payment_date: string | null;
  payment_method: string | null;
  proof_file_url: string | null;
  status: string;
  admin_note: string | null;
  verified_by: number | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Complaint = {
  id: number;
  tenant_id: number;
  room_id: number;
  category: string;
  description: string;
  photo_file_url: string | null;
  status: string;
  priority: string;
  admin_response: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

