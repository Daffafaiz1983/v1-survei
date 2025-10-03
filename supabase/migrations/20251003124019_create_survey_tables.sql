/*
  # Survey System for FISIP UI

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `role` (text) - mahasiswa, dosen, staff, admin
      - `nim_nip` (text) - NIM for students, NIP for staff/lecturers
      - `created_at` (timestamp)
      
    - `survey_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `role` (text) - respondent role
      - `q1_fasilitas` (integer) - rating 1-5
      - `q2_pelayanan_akademik` (integer) - rating 1-5
      - `q3_kualitas_pengajaran` (integer) - rating 1-5
      - `q4_lingkungan_kampus` (integer) - rating 1-5
      - `q5_teknologi_informasi` (integer) - rating 1-5
      - `saran` (text) - feedback text
      - `submitted_at` (timestamp)
      
  2. Security
    - Enable RLS on all tables
    - Users can read/update their own profile
    - Users can create survey responses
    - Users can read their own responses
    - Admin can read all responses
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('mahasiswa', 'dosen', 'staff', 'admin')),
  nim_nip text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL,
  q1_fasilitas integer NOT NULL CHECK (q1_fasilitas BETWEEN 1 AND 5),
  q2_pelayanan_akademik integer NOT NULL CHECK (q2_pelayanan_akademik BETWEEN 1 AND 5),
  q3_kualitas_pengajaran integer NOT NULL CHECK (q3_kualitas_pengajaran BETWEEN 1 AND 5),
  q4_lingkungan_kampus integer NOT NULL CHECK (q4_lingkungan_kampus BETWEEN 1 AND 5),
  q5_teknologi_informasi integer NOT NULL CHECK (q5_teknologi_informasi BETWEEN 1 AND 5),
  saran text DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create survey responses"
  ON survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own responses"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can read all responses"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON survey_responses(submitted_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);