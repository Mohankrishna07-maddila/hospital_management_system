/*
  # Hospital Management System Schema

  1. New Tables
    - patients
      - id (uuid, primary key)
      - full_name (text)
      - mobile (text)
      - location (text)
      - symptoms (text)
      - is_emergency (boolean)
      - payment_reference (text)
      - status (text)
      - created_at (timestamp)
      - doctor_id (uuid, foreign key)
    
    - doctors
      - id (uuid, primary key)
      - full_name (text)
      - specialty (text)
      - is_available (boolean)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  mobile text NOT NULL,
  location text NOT NULL,
  symptoms text NOT NULL,
  is_emergency boolean DEFAULT false,
  payment_reference text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  doctor_id uuid REFERENCES doctors(id),
  CONSTRAINT valid_mobile CHECK (length(mobile) = 10)
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  specialty text NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for patients
CREATE POLICY "Anyone can create patients"
  ON patients
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can update patients"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for doctors
CREATE POLICY "Anyone can view doctors"
  ON doctors
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Staff can manage doctors"
  ON doctors
  FOR ALL
  TO authenticated
  USING (true);