import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import sanitizeHtml from 'sanitize-html';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma']
}));
app.use(express.json());

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {}
        });
      }
    });
  }
  next();
};

// Apply sanitization to all routes
app.use(sanitizeInput);

// Add rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Allow more requests
});

// Apply rate limiting to login route
// app.use('/api/staff/login', loginLimiter);

console.log('Attempting to connect to MongoDB...');

// Define Schemas
const patientSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  location: String,
  disease: String,
  emergency: Boolean,
  paymentReference: String,
  status: { type: String, default: 'pending' },
  assignedDoctor: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

const staffSchema = new mongoose.Schema({
  username: String,
  password: String,
  userType: String
});

// Create Models
const Patient = mongoose.model('Patient', patientSchema);
const Staff = mongoose.model('Staff', staffSchema);

// Create initial staff accounts
const createInitialStaff = async () => {
  try {
    console.log('Starting staff creation process...');
    
    // First, clear any existing staff
    await Staff.deleteMany({});
    console.log('Cleared existing staff accounts');

    // Create receptionist account first
    try {
      const receptionist = await Staff.create({
        username: 'rec123',
        password: 'receptionist123',
        userType: 'receptionist'
      });
      console.log('Created receptionist account:', receptionist);
    } catch (receptionistError) {
      console.error('Error creating receptionist account:', receptionistError);
    }

    // Create doctor accounts
    try {
      const doctors = await Staff.create([
        {
          username: 'manoj',
          password: 'manoj1223',
          userType: 'doctor'
        },
        {
          username: 'mahesh',
          password: 'mahesh1223',
          userType: 'doctor'
        }
      ]);
      console.log('Created doctor accounts:', doctors);
    } catch (doctorError) {
      console.error('Error creating doctor accounts:', doctorError);
    }

    // Verify all accounts were created
    const allStaff = await Staff.find();
    console.log('All staff accounts in database:', allStaff);

    // Specifically check for receptionist
    const receptionistCheck = await Staff.findOne({ userType: 'receptionist' });
    if (!receptionistCheck) {
      console.error('Receptionist account was not created successfully');
      // Try to create it again
      try {
        const newReceptionist = await Staff.create({
          username: 'rec123',
          password: 'receptionist123',
          userType: 'receptionist'
        });
        console.log('Re-created receptionist account:', newReceptionist);
      } catch (retryError) {
        console.error('Failed to create receptionist account on retry:', retryError);
      }
    }

  } catch (error) {
    console.error('Error in createInitialStaff:', error);
  }
};

// Create initial test patients
const createInitialPatients = async () => {
  try {
    console.log('Starting createInitialPatients function...');
    const existingPatients = await Patient.find();
    console.log(`Found ${existingPatients.length} existing patients`);
    
    if (existingPatients.length === 0) {
      console.log('No patients found, creating test patients...');
      const testPatients = [
        {
          name: 'John Doe',
          mobile: '9876543210',
          location: 'City Hospital',
          disease: 'Fever',
          emergency: false,
          status: 'pending',
          assignedDoctor: null,
          createdAt: new Date()
        },
        {
          name: 'Jane Smith',
          mobile: '9876543211',
          location: 'Town Clinic',
          disease: 'Headache',
          emergency: true,
          status: 'pending',
          assignedDoctor: null,
          createdAt: new Date()
        }
      ];
      
      const createdPatients = await Patient.create(testPatients);
      console.log('Successfully created test patients:', createdPatients);
    } else {
      console.log('Patients already exist in the database');
    }
  } catch (error) {
    console.error('Error in createInitialPatients:', error);
  }
};

// MongoDB Connection
mongoose.connect('mongodb+srv://maddilamohankrishna32:manoj4462@cluster0.jn72y.mongodb.net/users?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas');
    // Create initial staff and patients after successful connection
    await createInitialStaff();
    await createInitialPatients();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Test route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Route to check staff accounts
app.get('/api/staff/check', async (req, res) => {
  try {
    console.log('Checking staff accounts...');
    const staff = await Staff.find();
    console.log('Found staff:', staff);
    res.json(staff);
  } catch (error) {
    console.error('Error checking staff:', error);
    res.status(500).json({ error: error.message });
  }
});

// Staff login route
app.post('/api/staff/login', async (req, res) => {
  try {
    // Normalize input
    let { role, id, password } = req.body;
    role = typeof role === 'string' ? role.trim().toLowerCase() : '';
    id = typeof id === 'string' ? id.trim() : '';
    password = typeof password === 'string' ? password : '';

    console.log('Login attempt received:', { role, id }); // Don't log password for security

    // Log all staff in database for debugging
    const allStaff = await Staff.find();
    console.log('All staff in database:', allStaff.map(staff => ({
      username: staff.username,
      userType: staff.userType
    })));

    // First try exact match (normalized)
    let staff = await Staff.findOne({ 
      username: id,
      userType: role
    });

    console.log('Exact username match result:', staff ? 'Found' : 'Not found');

    if (staff) {
      // Compare passwords
      if (staff.password === password) {
        console.log('Password match successful');
        res.json({ success: true, role: staff.userType, name: staff.username });
        return;
      } else {
        console.log('Password mismatch');
        console.log('Expected:', staff.password);
        console.log('Received:', password);
        res.status(401).json({ error: 'Incorrect password' });
        return;
      }
    }

    // If not found, try case-insensitive match
    console.log('Trying case-insensitive match...');
    staff = await Staff.findOne({ 
      username: { $regex: new RegExp(`^${id}$`, 'i') },
      userType: { $regex: new RegExp(`^${role}$`, 'i') }
    });

    if (staff) {
      console.log('Case-insensitive username match found');
      if (staff.password === password) {
        console.log('Password match successful');
        res.json({ success: true, role: staff.userType, name: staff.username });
        return;
      } else {
        console.log('Password mismatch');
        console.log('Expected:', staff.password);
        console.log('Received:', password);
        res.status(401).json({ error: 'Incorrect password' });
        return;
      }
    }
    
    // Check if username exists but password is wrong
    const usernameExists = await Staff.findOne({ 
      username: { $regex: new RegExp(`^${id}$`, 'i') }
    });
    
    if (usernameExists) {
      console.log('Username exists but password is incorrect');
      console.log('Expected password:', usernameExists.password);
      res.status(401).json({ error: 'Incorrect password' });
    } else {
      console.log('Username not found');
      res.status(401).json({ error: 'Username not found' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.post('/api/patients', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/patients', async (req, res) => {
  try {
    console.log('Fetching all patients...');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    // First, count all patients
    const totalCount = await Patient.countDocuments();
    console.log(`Total patients in database: ${totalCount}`);
    
    // Then fetch all patients
    const patients = await Patient.find().sort({ emergency: -1, createdAt: 1 });
    console.log(`Found ${patients.length} patients in query`);
    
    // Log each patient's details
    patients.forEach((patient, index) => {
      console.log(`Patient ${index + 1}:`, {
        id: patient._id,
        name: patient.name,
        emergency: patient.emergency,
        status: patient.status,
        assignedDoctor: patient.assignedDoctor
      });
    });
    
    // Send the response
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/patients/:id/assign', async (req, res) => {
  try {
    console.log('Doctor assignment request received:', {
      patientId: req.params.id,
      body: req.body
    });

    const { doctorUsername } = req.body;
    
    if (!doctorUsername) {
      console.log('No doctor username provided');
      return res.status(400).json({ error: 'Doctor username is required' });
    }

    if (!req.params.id) {
      console.log('No patient ID provided');
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    console.log('Updating patient with doctor:', doctorUsername);
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id },
      { assignedDoctor: doctorUsername },
      { new: true }
    );

    if (!patient) {
      console.log('Patient not found with ID:', req.params.id);
      return res.status(404).json({ error: 'Patient not found' });
    }

    console.log('Successfully assigned doctor:', patient);
    res.json(patient);
  } catch (error) {
    console.error('Error in doctor assignment:', error);
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/patients/:id/status', async (req, res) => {
  try {
    console.log('Status update request received:', {
      patientId: req.params.id,
      body: req.body
    });

    const { status } = req.body;
    
    if (!status) {
      console.log('No status provided');
      return res.status(400).json({ error: 'Status is required' });
    }

    if (!req.params.id) {
      console.log('No patient ID provided');
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    console.log('Updating patient status:', status);
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!patient) {
      console.log('Patient not found with ID:', req.params.id);
      return res.status(404).json({ error: 'Patient not found' });
    }

    console.log('Successfully updated patient status:', patient);
    res.json(patient);
  } catch (error) {
    console.error('Error updating patient status:', error);
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/patients/:id/emergency', async (req, res) => {
  try {
    const { emergency } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { emergency },
      { new: true }
    );
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/staff/doctors', async (req, res) => {
  try {
    console.log('Fetching doctors...');
    const doctors = await Staff.find({ userType: 'doctor' });
    console.log('Found doctors:', JSON.stringify(doctors, null, 2));
    
    if (!doctors || doctors.length === 0) {
      console.log('No doctors found in the database');
      // Create doctors if none exist
      const newDoctors = await Staff.create([
        {
          username: 'manoj',
          password: 'manoj1223',
          userType: 'doctor'
        },
        {
          username: 'mahesh',
          password: 'mahesh1223',
          userType: 'doctor'
        }
      ]);
      console.log('Created new doctors:', JSON.stringify(newDoctors, null, 2));
      res.json(newDoctors);
    } else {
      res.json(doctors);
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create test patients route
app.post('/api/patients/create-test', async (req, res) => {
  try {
    await createInitialPatients();
    const patients = await Patient.find();
    res.json({ message: 'Test patients created successfully', patients });
  } catch (error) {
    console.error('Error creating test patients:', error);
    res.status(500).json({ error: 'Failed to create test patients' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});