const Profile = require('../models/Profile.js');

// Controller function for creating a profile
const createProfile = async (req, res) => {
  try {
    const { user, bio, website, socialMedia } = req.body;

    // Create a new profile
    const profile = new Profile({ user, bio, website, socialMedia });
    await profile.save();

    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

// Controller function for updating a profile
const updateProfile = async (req, res) => {
  try {
    const { bio, website, socialMedia } = req.body;
    const { profileId } = req.params;

    // Find the profile by ID
    const profile = await Profile.findByIdAndUpdate(profileId, { bio, website, socialMedia }, { new: true });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Controller function for retrieving a profile
const getProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    // Find the profile by ID
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};
// Get all profiles with filters
const getAllProfiles = async (req, res) => {
  try {
    let filters = {};
    
    // Apply filters based on request query parameters
    if (req.query.name) {
      filters.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.age) {
      filters.age = req.query.age;
    }
    // Add more filters as per your schema fields
    
    // Fetch profiles based on the filters
    const profiles = await Profile.find(filters);

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
};
const deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    // Find the profile by ID
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Delete the profile
    await profile.remove();

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};
 
module.exports = {
  createProfile,
  updateProfile,
  getProfile,
  getAllProfiles,
  deleteProfile
};
