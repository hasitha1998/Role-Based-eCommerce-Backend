import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth.js';



export const login = async (req, res) => {
  try {
    console.log('\n🔐 LOGIN ATTEMPT');
    console.log('━'.repeat(50));
    
    const { email, password } = req.body;
    console.log('📧 Email:', email);
    console.log('🔑 Password received:', password ? '***' : 'MISSING');

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    console.log('👤 User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('📝 User details:');
    console.log('   - ID:', user.id);
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);
    console.log('   - Has password:', user.password ? 'YES' : 'NO');
    console.log('   - Password hash preview:', user.password ? user.password.substring(0, 20) + '...' : 'NULL');

    // CHANGED: Use bcrypt.compare directly
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔓 Password valid:', isValidPassword ? 'YES ✅' : 'NO ❌');

    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Active status:', user.isActive);
    if (!user.isActive) {
      console.log('❌ Account inactive');
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const token = generateToken(user);
    console.log('🎫 Token generated:', token ? 'YES' : 'NO');
    console.log('✅ LOGIN SUCCESSFUL');
    console.log('━'.repeat(50) + '\n');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profilePicture: user.profilePicture,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('\n💥 LOGIN ERROR');
    console.error('━'.repeat(50));
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.error('━'.repeat(50) + '\n');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'user'
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
