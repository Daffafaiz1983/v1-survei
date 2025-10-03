import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'mahasiswa' | 'dosen' | 'staff' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  nim_nip: string | null;
  created_at: string;
}

export interface SurveyResponse {
  id: string;
  user_id: string;
  role: UserRole;
  q1_fasilitas: number;
  q2_pelayanan_akademik: number;
  q3_kualitas_pengajaran: number;
  q4_lingkungan_kampus: number;
  q5_teknologi_informasi: number;
  saran: string;
  submitted_at: string;
}
