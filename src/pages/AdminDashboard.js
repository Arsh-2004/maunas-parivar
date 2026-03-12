import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import MembershipCertificate from '../components/MembershipCertificate';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [gallery, setGallery] = useState([]);
  const [oathAgreements, setOathAgreements] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [nonMembers, setNonMembers] = useState([]);
  const [viewNmRecord, setViewNmRecord] = useState(null);
  const [nmSearch, setNmSearch] = useState('');
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', category: 'general', image: null });
  const [donors, setDonors] = useState([]);
  const [donorForm, setDonorForm] = useState({ fullName: '', city: '', state: '', donationAmount: '', donationPurpose: '', message: '', photo: null });
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateUser, setCertificateUser] = useState(null);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [familyModalUser, setFamilyModalUser] = useState(null);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [communityForm, setCommunityForm] = useState({
    fullName: '', designation: '', occupation: '', city: '', state: '',
    bio: '', awards: '', publications: '', honoraryTitle: '', prakosth: '', photo: null
  });
  const [communityMemberType, setCommunityMemberType] = useState('upadhi'); // 'upadhi' | 'prakosht'

  // Committee member management
  const [committeeMembersData, setCommitteeMembersData] = useState([]);
  const [committeeSubTab, setCommitteeSubTab] = useState('sanrakshak');
  const [committeeForm, setCommitteeForm] = useState({
    fullName: '', designation: '', position: '', city: '', state: '',
    committee: 'sanrakshak', displayPage: 'about', photo: null
  });
  const [committeeSubmitting, setCommitteeSubmitting] = useState(false);
  const [committeeStatus, setCommitteeStatus] = useState(null);
  const [editingCommittee, setEditingCommittee] = useState(null); // { ...member, newPhoto: null }

  // Edit modals for existing sections
  const [editingGallery, setEditingGallery] = useState(null);
  const [editGalleryForm, setEditGalleryForm] = useState({});
  const [editingDonor, setEditingDonor] = useState(null);
  const [editDonorForm, setEditDonorForm] = useState({});
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [editCommunityForm, setEditCommunityForm] = useState({});

  // Heritage posts management
  const [heritageData, setHeritageData] = useState([]);
  const [heritageForm, setHeritageForm] = useState({ titleHi: '', titleEn: '', descriptionHi: '', descriptionEn: '', imageCaption: '', photo: null });
  const [heritageSubmitting, setHeritageSubmitting] = useState(false);
  const [heritageStatus, setHeritageStatus] = useState(null);
  const [editingHeritage, setEditingHeritage] = useState(null);
  const [editHeritageForm, setEditHeritageForm] = useState({});

  // Search states for admin sections
  const [upadhiSearch, setUpadhiSearch] = useState('');
  const [prakosthSearch, setPrakosthSearch] = useState('');
  const [committeeSearch, setCommitteeSearch] = useState('');

  // Submitting / status states for forms
  const [gallerySubmitting, setGallerySubmitting] = useState(false);
  const [galleryStatus, setGalleryStatus] = useState(null); // {type:'success'|'error', msg:''}
  const [donorSubmitting, setDonorSubmitting] = useState(false);
  const [donorStatus, setDonorStatus] = useState(null);
  const [communitySubmitting, setCommunitySubmitting] = useState(false);
  const [communityStatus, setCommunityStatus] = useState(null);
  
  // New state for district/block filtering and sorting
  const [districtFilter, setDistrictFilter] = useState('all');
  const [blockFilter, setBlockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setAdminPassword(password);
        localStorage.setItem('adminPassword', password);
        fetchUsers();
        fetchStats();
        fetchGallery();
        fetchOathAgreements();
        fetchContacts();
        fetchNonMembers();
        fetchDonors();
        fetchCommunityMembers();
        fetchCommitteeMembersData();
        fetchHeritageData();
        setError(language === 'en' ? 'Invalid admin password' : 'गलत व्यवस्थापक पासवर्ड');
      }
    } catch (err) {
      setError(language === 'en' ? 'Connection error' : 'कनेक्शन त्रुटि');
    }
  };

  // Fetch oath agreements
  const fetchOathAgreements = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/admin/oath-agreements`, {
        headers: { 'x-admin-password': adminPassword }
      });
      const data = await response.json();
      if (data.success) {
        setOathAgreements(data.agreements);
      }
    } catch (err) {
      console.error('Error fetching oath agreements:', err);
    }
  }, [adminPassword]);

  // Fetch contact messages
  const fetchContacts = useCallback(async () => {
    try {
      const storedPassword = localStorage.getItem('adminPassword');
      const response = await fetch(`${API_URL}/admin/contacts`, {
        headers: { 'x-admin-password': storedPassword || adminPassword }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  }, [adminPassword]);

  const fetchNonMembers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/users/non-members`);
      const data = await res.json();
      if (data.success) setNonMembers(data.records);
    } catch (err) {
      console.error('Error fetching non-members:', err);
    }
  }, []);

  // Check stored admin session
  useEffect(() => {
    const storedPassword = localStorage.getItem('adminPassword');
    if (storedPassword) {
      setAdminPassword(storedPassword);
      setIsLoggedIn(true);
      fetchUsers();
      fetchStats();
      fetchGallery();
      fetchOathAgreements();
      fetchContacts();
      fetchNonMembers();
      fetchDonors();
      fetchCommunityMembers();
      fetchCommitteeMembersData();
      fetchHeritageData();
    }
  }, [fetchOathAgreements, fetchContacts, fetchNonMembers]);

  // Fetch users
  const fetchUsers = async (searchTerm = '') => {
    setLoading(true);
    const storedPassword = localStorage.getItem('adminPassword');
    
    try {
      const url = searchTerm 
        ? `${API_URL}/admin/search?query=${encodeURIComponent(searchTerm)}`
        : `${API_URL}/admin/users`;
        
      const response = await fetch(url, {
        headers: { 'x-admin-password': storedPassword },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    setLoading(false);
  };

  // Fetch stats
  const fetchStats = async () => {
    const storedPassword = localStorage.getItem('adminPassword');
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'x-admin-password': storedPassword },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Approve user
  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/approve/${userId}`, {
        method: 'PUT',
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('Error approving user:', err);
    }
  };

  // Reject user
  const handleReject = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/reject/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
        setSelectedUser(null);
        setRejectReason('');
      }
    } catch (err) {
      console.error('Error rejecting user:', err);
    }
  };

  // Set to pending
  const handleSetPending = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/set-pending/${userId}`, {
        method: 'PUT',
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('Error setting pending:', err);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this user?' : 'क्या आप वाकई इस उपयोगकर्ता को हटाना चाहते हैं?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/admin/delete/${userId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Gallery management
  const fetchGallery = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/gallery`);
      const data = await response.json();
      if (data.success) {
        setGallery(data.photos);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  // Community Members management
  const fetchCommunityMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/community-members`);
      const data = await response.json();
      if (data.success) setCommunityMembers(data.members);
    } catch (err) {
      console.error('Error fetching community members:', err);
    }
  };

  const fetchCommitteeMembersData = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/committee-members`);
      const data = await response.json();
      if (data.success) setCommitteeMembersData(data.members);
    } catch (err) {
      console.error('Error fetching committee members:', err);
    }
  };

  const fetchHeritageData = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/heritage-posts`);
      const data = await response.json();
      if (data.success) setHeritageData(data.posts);
    } catch (err) {
      console.error('Error fetching heritage posts:', err);
    }
  };

  const handleAddHeritage = async (e) => {
    e.preventDefault();
    setHeritageSubmitting(true);
    setHeritageStatus(null);
    const formData = new FormData();
    formData.append('titleHi', heritageForm.titleHi);
    formData.append('titleEn', heritageForm.titleEn);
    formData.append('descriptionHi', heritageForm.descriptionHi);
    formData.append('descriptionEn', heritageForm.descriptionEn);
    formData.append('imageCaption', heritageForm.imageCaption);
    if (heritageForm.photo) formData.append('photo', heritageForm.photo);
    try {
      const res = await fetch(`${API_URL}/admin/heritage-posts`, {
        method: 'POST',
        headers: { 'x-admin-password': localStorage.getItem('adminPassword') || '' },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchHeritageData();
        setHeritageForm({ titleHi: '', titleEn: '', descriptionHi: '', descriptionEn: '', imageCaption: '', photo: null });
        setHeritageStatus({ type: 'success', msg: language === 'en' ? 'Heritage post added!' : '\u0927\u0930\u094b\u0939\u0930 \u092a\u094b\u0938\u094d\u091f \u091c\u094b\u0921\u093c \u0926\u093f\u092f\u093e \u0917\u092f\u093e!' });
      } else {
        setHeritageStatus({ type: 'error', msg: data.message || 'Error' });
      }
    } catch {
      setHeritageStatus({ type: 'error', msg: language === 'en' ? 'Server error.' : '\u0938\u0930\u094d\u0935\u0930 \u0924\u094d\u0930\u0941\u091f\u093f\u0964' });
    } finally {
      setHeritageSubmitting(false);
    }
  };

  const handleUpdateHeritage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titleHi', editHeritageForm.titleHi);
    formData.append('titleEn', editHeritageForm.titleEn || '');
    formData.append('descriptionHi', editHeritageForm.descriptionHi);
    formData.append('descriptionEn', editHeritageForm.descriptionEn || '');
    formData.append('imageCaption', editHeritageForm.imageCaption || '');
    if (editHeritageForm.newPhoto) formData.append('photo', editHeritageForm.newPhoto);
    try {
      const res = await fetch(`${API_URL}/admin/heritage-posts/${editingHeritage._id}`, {
        method: 'PUT',
        headers: { 'x-admin-password': localStorage.getItem('adminPassword') || '' },
        body: formData,
      });
      const data = await res.json();
      if (data.success) { setEditingHeritage(null); fetchHeritageData(); }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHeritage = async (id) => {
    if (!window.confirm(language === 'en' ? 'Delete this heritage post?' : 'इस धरोहर पोस्ट को हटाएं?')) return;
    try {
      await fetch(`${API_URL}/admin/heritage-posts/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': localStorage.getItem('adminPassword') || '' },
      });
      fetchHeritageData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedStaticHeritage = async () => {
    if (!window.confirm(language === 'en'
      ? 'Initialize the 10 built-in heritage sites into the database? This enables editing them here.'
      : '10 मूल धरोहर स्थलों को डेटाबेस में जोड़ें? इससे आप उन्हें यहाँ से संपादित कर सकेंगे।'
    )) return;
    try {
      const res = await fetch(`${API_URL}/admin/heritage-posts/seed-static`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': localStorage.getItem('adminPassword') || '' },
      });
      const data = await res.json();
      if (data.success) {
        fetchHeritageData();
        setHeritageStatus({ type: 'success', msg: language === 'en' ? `${data.inserted} static sites initialized!` : `${data.inserted} मूल धरोहर स्थल जोड़ दिए गए!` });
      } else {
        setHeritageStatus({ type: 'error', msg: data.message });
      }
    } catch {
      setHeritageStatus({ type: 'error', msg: language === 'en' ? 'Server error.' : 'सर्वर त्रुटि।' });
    }
  };

  const handleCommunityMemberSubmit = async (e) => {
    e.preventDefault();
    setCommunitySubmitting(true);
    setCommunityStatus(null);
    const formData = new FormData();
    formData.append('fullName', communityForm.fullName);
    formData.append('designation', communityForm.designation);
    formData.append('occupation', communityForm.occupation);
    formData.append('city', communityForm.city);
    formData.append('state', communityForm.state);
    formData.append('bio', communityForm.bio);
    formData.append('awards', communityForm.awards);
    formData.append('publications', communityForm.publications);
    if (communityMemberType === 'upadhi') {
      formData.append('honoraryTitle', communityForm.honoraryTitle);
    } else {
      formData.append('prakosth', communityForm.prakosth);
    }
    if (communityForm.photo) formData.append('photo', communityForm.photo);
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      const response = await fetch(`${API_URL}/admin/community-members`, {
        method: 'POST',
        headers: { 'x-admin-password': pwd },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setCommunityStatus({ type: 'success', msg: language === 'en' ? '✅ Member added successfully!' : '✅ सदस्य सफलतापूर्वक जोड़ा गया!' });
        fetchCommunityMembers();
        setCommunityForm({ fullName: '', designation: '', occupation: '', city: '', state: '', bio: '', awards: '', publications: '', honoraryTitle: '', prakosth: '', photo: null });
        document.querySelectorAll('#community-form input[type="file"]').forEach(i => { i.value = ''; });
        setTimeout(() => setCommunityStatus(null), 4000);
      } else {
        setCommunityStatus({ type: 'error', msg: language === 'en' ? `❌ Failed: ${data.message}` : `❌ विफल: ${data.message}` });
      }
    } catch (err) {
      console.error('Error adding community member:', err);
      setCommunityStatus({ type: 'error', msg: language === 'en' ? '❌ Network error. Please try again.' : '❌ नेटवर्क त्रुटि। पुनः प्रयास करें।' });
    } finally {
      setCommunitySubmitting(false);
    }
  };

  const handleDeleteCommunityMember = async (id) => {
    if (!window.confirm(language === 'en' ? 'Delete this member?' : 'इस सदस्य को हटाएं?')) return;
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      const response = await fetch(`${API_URL}/admin/community-members/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': pwd },
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Delete community member failed:', response.status, errData.message);
        alert(language === 'en' ? `Delete failed: ${errData.message || response.status}` : `हटाने में विफल: ${errData.message || response.status}`);
        return;
      }
      // Optimistically remove from state immediately, then confirm with server
      setCommunityMembers(prev => prev.filter(m => String(m._id) !== String(id)));
      await fetchCommunityMembers();
    } catch (err) {
      console.error('Error deleting community member:', err);
      alert(language === 'en' ? 'Network error while deleting.' : 'हटाने में नेटवर्क त्रुटि।');
    }
  };

  // Donors management
  const fetchDonors = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/donors`);
      const data = await response.json();
      if (data.success) setDonors(data.donors);
    } catch (err) {
      console.error('Error fetching donors:', err);
    }
  };

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    setDonorSubmitting(true);
    setDonorStatus(null);
    const formData = new FormData();
    formData.append('fullName', donorForm.fullName);
    formData.append('city', donorForm.city);
    formData.append('state', donorForm.state);
    formData.append('donationAmount', donorForm.donationAmount);
    formData.append('donationPurpose', donorForm.donationPurpose);
    formData.append('message', donorForm.message);
    if (donorForm.photo) formData.append('photo', donorForm.photo);
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      const response = await fetch(`${API_URL}/admin/donors`, {
        method: 'POST',
        headers: { 'x-admin-password': pwd },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setDonorStatus({ type: 'success', msg: language === 'en' ? '✅ Donor added successfully!' : '✅ सहयोगी सफलतापूर्वक जोड़ा गया!' });
        fetchDonors();
        setDonorForm({ fullName: '', city: '', state: '', donationAmount: '', donationPurpose: '', message: '', photo: null });
        document.querySelectorAll('#donor-form input[type="file"]').forEach(i => { i.value = ''; });
        setTimeout(() => setDonorStatus(null), 4000);
      } else {
        setDonorStatus({ type: 'error', msg: language === 'en' ? `❌ Failed: ${data.message}` : `❌ विफल: ${data.message}` });
      }
    } catch (err) {
      console.error('Error adding donor:', err);
      setDonorStatus({ type: 'error', msg: language === 'en' ? '❌ Network error. Please try again.' : '❌ नेटवर्क त्रुटि। पुनः प्रयास करें।' });
    } finally {
      setDonorSubmitting(false);
    }
  };

  const handleDeleteDonor = async (id) => {
    if (!window.confirm(language === 'en' ? 'Delete this donor record?' : 'इस सहयोगी रिकॉर्ड को हटाएं?')) return;
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      await fetch(`${API_URL}/admin/donors/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': pwd },
      });
      fetchDonors();
    } catch (err) {
      console.error('Error deleting donor:', err);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    
    if (!galleryForm.image) {
      setGalleryStatus({ type: 'error', msg: language === 'en' ? '❌ Please select an image to upload' : '❌ कृपया अपलोड करने के लिए एक छवि चुनें' });
      return;
    }

    setGallerySubmitting(true);
    setGalleryStatus(null);
    
    const formData = new FormData();
    formData.append('title', galleryForm.title);
    formData.append('description', galleryForm.description);
    formData.append('category', galleryForm.category);
    formData.append('image', galleryForm.image);

    try {
      const response = await fetch(`${API_URL}/admin/gallery`, {
        method: 'POST',
        headers: { 'x-admin-password': adminPassword },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setGalleryStatus({ type: 'success', msg: language === 'en' ? '✅ Photo uploaded successfully!' : '✅ फोटो सफलतापूर्वक अपलोड की गई!' });
        fetchGallery();
        setGalleryForm({ title: '', description: '', category: 'general', image: null });
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
        setTimeout(() => setGalleryStatus(null), 4000);
      } else {
        setGalleryStatus({ type: 'error', msg: language === 'en' ? `❌ Failed: ${data.message}` : `❌ विफल: ${data.message}` });
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      setGalleryStatus({ type: 'error', msg: language === 'en' ? '❌ Network error. Please try again.' : '❌ नेटवर्क त्रुटि। पुनः प्रयास करें।' });
    } finally {
      setGallerySubmitting(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      const response = await fetch(`${API_URL}/admin/gallery/${photoId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        fetchGallery();
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  // Get unique districts and blocks from users
  const uniqueDistricts = [...new Set(users.map(u => u.district).filter(Boolean))].sort();
  const uniqueBlocks = [...new Set(users.map(u => u.block).filter(Boolean))].sort();

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      // Status filter
      if (filter !== 'all' && user.status !== filter) return false;
      
      // District filter
      if (districtFilter !== 'all' && user.district !== districtFilter) return false;
      
      // Block filter
      if (blockFilter !== 'all' && user.block !== blockFilter) return false;
      
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchFields = [
          user.fullName,
          user.phone,
          user.district,
          user.block,
          user.village,
          user.tehsil,
          user.city,
          user.email,
          user.fatherName
        ].filter(Boolean).map(field => field.toLowerCase());
        
        const matches = searchFields.some(field => field.includes(query));
        if (!matches) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'name':
          comparison = (a.fullName || '').localeCompare(b.fullName || '');
          break;
        case 'district':
          comparison = (a.district || '').localeCompare(b.district || '');
          break;
        case 'block':
          comparison = (a.block || '').localeCompare(b.block || '');
          break;
        case 'date':
        default:
          comparison = new Date(a.registeredAt) - new Date(b.registeredAt);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // ===== Generic reorder helper =====
  const reorderItems = async (items, idx, direction, endpoint, fetchFn) => {
    const sorted = items.map((item, i) => ({ ...item, _eff: item.sortOrder !== undefined ? item.sortOrder : i }));
    sorted.sort((a, b) => a._eff - b._eff);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const updates = sorted.map((item, i) => ({ id: item._id, sortOrder: i }));
    // Swap the two targeted items
    const tmpOrder = updates[idx].sortOrder;
    updates[idx].sortOrder = updates[swapIdx].sortOrder;
    updates[swapIdx].sortOrder = tmpOrder;
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      await fetch(`${API_URL}/admin/${endpoint}`, {
        method: 'PUT',
        headers: { 'x-admin-password': pwd, 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      fetchFn();
    } catch (err) { console.error('Reorder error:', err); }
  };

  // ===== Committee Member Handlers =====
  const handleAddCommitteeMember = async (e) => {
    e.preventDefault();
    setCommitteeSubmitting(true);
    setCommitteeStatus(null);
    const formData = new FormData();
    formData.append('fullName', committeeForm.fullName);
    formData.append('designation', committeeForm.designation);
    formData.append('position', committeeForm.position);
    formData.append('city', committeeForm.city);
    formData.append('state', committeeForm.state);
    formData.append('committee', committeeSubTab);
    formData.append('displayPage', committeeSubTab === 'prabandhan' ? committeeForm.displayPage : 'about');
    if (committeeForm.photo) formData.append('photo', committeeForm.photo);
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      const res = await fetch(`${API_URL}/admin/committee-members-admin`, {
        method: 'POST', headers: { 'x-admin-password': pwd }, body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setCommitteeStatus({ type: 'success', msg: language === 'en' ? '✅ Member added!' : '✅ सदस्य जोड़ा गया!' });
        fetchCommitteeMembersData();
        setCommitteeForm({ fullName: '', designation: '', position: '', city: '', state: '', committee: committeeSubTab, displayPage: 'about', photo: null });
        document.querySelectorAll('#committee-form input[type="file"]').forEach(i => { i.value = ''; });
        setTimeout(() => setCommitteeStatus(null), 4000);
      } else { setCommitteeStatus({ type: 'error', msg: `❌ ${data.message}` }); }
    } catch (err) {
      setCommitteeStatus({ type: 'error', msg: language === 'en' ? '❌ Network error' : '❌ नेटवर्क त्रुटि' });
    } finally { setCommitteeSubmitting(false); }
  };

  const handleUpdateCommitteeMember = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullName', editingCommittee.fullName);
    formData.append('designation', editingCommittee.designation || '');
    formData.append('position', editingCommittee.position || '');
    formData.append('city', editingCommittee.city || '');
    formData.append('state', editingCommittee.state || '');
    formData.append('displayPage', editingCommittee.displayPage || 'about');
    if (editingCommittee.newPhoto) formData.append('photo', editingCommittee.newPhoto);
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      const res = await fetch(`${API_URL}/admin/committee-members-admin/${editingCommittee._id}`, {
        method: 'PUT', headers: { 'x-admin-password': pwd }, body: formData,
      });
      const data = await res.json();
      if (data.success) { setEditingCommittee(null); fetchCommitteeMembersData(); }
    } catch (err) { console.error('Update committee error:', err); }
  };

  const handleSeedCommitteeMembers = async (committee) => {
    if (!window.confirm(language === 'en'
      ? `Load existing ${committee} committee members into the database?`
      : `${committee === 'sanrakshak' ? 'संरक्षक' : committee === 'prabandhan' ? 'प्रबन्धन' : 'संचालक'} कमेटी के मौजूदा सदस्यों को डेटाबेस में लोड करें?`
    )) return;
    try {
      const res = await fetch(`${API_URL}/admin/committee-members-seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': localStorage.getItem('adminPassword') || '' },
        body: JSON.stringify({ committee }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCommitteeMembersData();
        setCommitteeStatus({ type: 'success', msg: language === 'en' ? `${data.inserted} members loaded successfully!` : `${data.inserted} सदस्य सफलतापूर्वक लोड किए गए!` });
      } else {
        setCommitteeStatus({ type: 'error', msg: data.message || (language === 'en' ? 'Could not load members.' : 'सदस्य लोड नहीं हो सके।') });
      }
    } catch {
      setCommitteeStatus({ type: 'error', msg: language === 'en' ? 'Server error.' : 'सर्वर त्रुटि।' });
    }
  };

  const handleDeleteCommitteeMemberAdm = async (id) => {
    if (!window.confirm(language === 'en' ? 'Delete this member?' : 'इस सदस्य को हटाएं?')) return;
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      await fetch(`${API_URL}/admin/committee-members-admin/${id}`, { method: 'DELETE', headers: { 'x-admin-password': pwd } });
      fetchCommitteeMembersData();
    } catch (err) { console.error('Delete committee error:', err); }
  };

  // ===== Gallery Edit Handler =====
  const handleUpdateGallery = async (e) => {
    e.preventDefault();
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      const res = await fetch(`${API_URL}/admin/gallery/${editingGallery._id}`, {
        method: 'PUT',
        headers: { 'x-admin-password': pwd, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editGalleryForm.title, description: editGalleryForm.description, category: editGalleryForm.category }),
      });
      const data = await res.json();
      if (data.success) { setEditingGallery(null); fetchGallery(); }
    } catch (err) { console.error('Update gallery error:', err); }
  };

  // ===== Donor Edit Handler =====
  const handleUpdateDonor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editDonorForm).forEach(([k, v]) => {
      if (v !== null && v !== undefined && k !== 'newPhoto') formData.append(k, String(v));
    });
    if (editDonorForm.newPhoto) formData.append('photo', editDonorForm.newPhoto);
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      const res = await fetch(`${API_URL}/admin/donors/${editingDonor._id}`, {
        method: 'PUT', headers: { 'x-admin-password': pwd }, body: formData,
      });
      const data = await res.json();
      if (data.success) { setEditingDonor(null); fetchDonors(); }
    } catch (err) { console.error('Update donor error:', err); }
  };

  // ===== Community Member Edit Handler =====
  const handleUpdateCommunityMember = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editCommunityForm).forEach(([k, v]) => {
      if (v !== null && v !== undefined && k !== 'newPhoto') formData.append(k, String(v));
    });
    if (editCommunityForm.newPhoto) formData.append('photo', editCommunityForm.newPhoto);
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      const res = await fetch(`${API_URL}/admin/community-members/${editingCommunity._id}`, {
        method: 'PUT', headers: { 'x-admin-password': pwd }, body: formData,
      });
      const data = await res.json();
      if (data.success) { setEditingCommunity(null); fetchCommunityMembers(); }
    } catch (err) { console.error('Update community error:', err); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminPassword('');
    localStorage.removeItem('adminPassword');
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h2>{language === 'en' ? 'Admin Login' : 'व्यवस्थापक लॉगिन'}</h2>
          <form onSubmit={handleAdminLogin}>
            <input
              type="password"
              placeholder={language === 'en' ? 'Enter Admin Password' : 'व्यवस्थापक पासवर्ड दर्ज करें'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{language === 'en' ? 'Login' : 'लॉगिन करें'}</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📊 {language === 'en' ? 'Admin Dashboard' : 'व्यवस्थापक डैशबोर्ड'}</h1>
        <button onClick={handleLogout} className="logout-btn">
          {language === 'en' ? 'Logout' : 'लॉगआउट'}
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          {language === 'en' ? 'Members' : 'सदस्य'}
        </button>
        <button 
          className={activeTab === 'oath' ? 'active' : ''}
          onClick={() => setActiveTab('oath')}
        >
          {language === 'en' ? 'Oath Agreements' : 'शपथ समझौते'}
        </button>
        <button 
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          {language === 'en' ? 'Gallery' : 'गैलरी'}
        </button>
        <button 
          className={activeTab === 'contacts' ? 'active' : ''}
          onClick={() => setActiveTab('contacts')}
        >
          {language === 'en' ? 'Contact Messages' : 'संदेश'}
          {contacts.filter(c => !c.isRead).length > 0 && (
            <span style={{ background: '#e07b39', color: '#fff', borderRadius: '50%', padding: '2px 7px', marginLeft: '6px', fontSize: '12px' }}>
              {contacts.filter(c => !c.isRead).length}
            </span>
          )}
        </button>
        <button
          className={activeTab === 'nonmembers' ? 'active' : ''}
          onClick={() => setActiveTab('nonmembers')}
        >
          {language === 'en' ? 'Non-Members' : 'अन्य सदस्य'}
          {nonMembers.length > 0 && (
            <span style={{ background: '#5678c9', color: '#fff', borderRadius: '50%', padding: '2px 7px', marginLeft: '6px', fontSize: '12px' }}>
              {nonMembers.length}
            </span>
          )}
        </button>
        <button
          className={activeTab === 'donors' ? 'active' : ''}
          onClick={() => setActiveTab('donors')}
        >
          {language === 'en' ? 'Sahyogi Sadashya' : 'सहयोगी सदस्य'}
        </button>
        <button
          className={activeTab === 'community' ? 'active' : ''}
          onClick={() => setActiveTab('community')}
        >
          {language === 'en' ? 'Upadhi & Prakosht' : 'उपाधि और प्रकोष्ठ'}
        </button>
        <button
          className={activeTab === 'committees' ? 'active' : ''}
          onClick={() => setActiveTab('committees')}
        >
          {language === 'en' ? 'Committees' : 'कमेटी सदस्य'}
        </button>
        <button
          className={activeTab === 'heritage' ? 'active' : ''}
          onClick={() => setActiveTab('heritage')}
        >
          {language === 'en' ? 'Heritage' : 'धरोहर'}
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          <div className="stats-grid">
            <div className="stat-card pending-card">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">{language === 'en' ? 'Pending' : 'लंबित'}</div>
            </div>
            <div className="stat-card approved-card">
              <div className="stat-number">{stats.approved}</div>
              <div className="stat-label">{language === 'en' ? 'Approved' : 'स्वीकृत'}</div>
            </div>
            <div className="stat-card rejected-card">
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">{language === 'en' ? 'Rejected' : 'अस्वीकृत'}</div>
            </div>
            <div className="stat-card total-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">{language === 'en' ? 'Total' : 'कुल'}</div>
            </div>
          </div>

          <div className="filter-tabs">
            <button 
              onClick={() => setFilter('pending')} 
              className={filter === 'pending' ? 'active' : ''}
            >
              {language === 'en' ? 'Pending' : 'लंबित'}
            </button>
            <button 
              onClick={() => setFilter('approved')} 
              className={filter === 'approved' ? 'active' : ''}
            >
              {language === 'en' ? 'Approved' : 'स्वीकृत'}
            </button>
            <button 
              onClick={() => setFilter('rejected')} 
              className={filter === 'rejected' ? 'active' : ''}
            >
              {language === 'en' ? 'Rejected' : 'अस्वीकृत'}
            </button>
          </div>

          <div className="search-bar-container">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder={language === 'en' 
                  ? 'Search by name, phone, district, block, village...' 
                  : 'नाम, फोन, जिला, खंड, गाँव से खोजें...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title={language === 'en' ? 'Clear search' : 'खोज साफ़ करें'}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="advanced-filters">
            <div className="filter-group">
              <label>{language === 'en' ? 'District:' : 'जिला:'}</label>
              <select 
                value={districtFilter} 
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setBlockFilter('all'); // Reset block when district changes
                }}
                className="filter-dropdown"
              >
                <option value="all">{language === 'en' ? 'All Districts' : 'सभी जिले'}</option>
                {uniqueDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{language === 'en' ? 'Block:' : 'खंड:'}</label>
              <select 
                value={blockFilter} 
                onChange={(e) => setBlockFilter(e.target.value)}
                className="filter-dropdown"
              >
                <option value="all">{language === 'en' ? 'All Blocks' : 'सभी खंड'}</option>
                {uniqueBlocks
                  .filter(block => {
                    if (districtFilter === 'all') return true;
                    return users.some(u => u.block === block && u.district === districtFilter);
                  })
                  .map(block => (
                    <option key={block} value={block}>{block}</option>
                  ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{language === 'en' ? 'Sort by:' : 'क्रमबद्ध करें:'}</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-dropdown"
              >
                <option value="date">{language === 'en' ? 'Registration Date' : 'पंजीकरण तिथि'}</option>
                <option value="name">{language === 'en' ? 'Name' : 'नाम'}</option>
                <option value="district">{language === 'en' ? 'District' : 'जिला'}</option>
                <option value="block">{language === 'en' ? 'Block' : 'खंड'}</option>
              </select>
            </div>

            <div className="filter-group">
              <label>{language === 'en' ? 'Order:' : 'क्रम:'}</label>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="filter-dropdown"
              >
                <option value="asc">{language === 'en' ? 'Ascending' : 'आरोही'}</option>
                <option value="desc">{language === 'en' ? 'Descending' : 'अवरोही'}</option>
              </select>
            </div>

            <button 
              className="reset-filters-btn"
              onClick={() => {
                setDistrictFilter('all');
                setBlockFilter('all');
                setSortBy('date');
                setSortOrder('desc');
                setSearchQuery('');
              }}
            >
              {language === 'en' ? '🔄 Reset All' : '🔄 सभी रीसेट करें'}
            </button>
          </div>

          <div className="results-summary">
            <p>
              {language === 'en' 
                ? `Showing ${filteredUsers.length} of ${users.length} members` 
                : `${users.length} में से ${filteredUsers.length} सदस्य दिखा रहे हैं`}
              {searchQuery && (
                <span className="active-search-indicator">
                  {' '}{language === 'en' ? '(Search active)' : '(खोज सक्रिय)'}
                </span>
              )}
              {(districtFilter !== 'all' || blockFilter !== 'all') && (
                <span className="active-filter-indicator">
                  {' '}{language === 'en' ? '(Filters active)' : '(फ़िल्टर सक्रिय)'}
                </span>
              )}
            </p>
          </div>

          {loading ? (
            <p className="loading-text">{language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}</p>
          ) : (
            <div className="members-table-container">
              {filteredUsers.length === 0 ? (
                <p className="no-data">{language === 'en' ? 'No registrations found' : 'कोई पंजीकरण नहीं मिला'}</p>
              ) : (
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>{language === 'en' ? 'Name' : 'नाम'}</th>
                      <th>{language === 'en' ? 'Phone' : 'फोन'}</th>
                      <th>{language === 'en' ? 'District' : 'जिला'}</th>
                      <th>{language === 'en' ? 'Block' : 'खंड'}</th>
                      <th>{language === 'en' ? 'Family' : 'परिवार'}</th>
                      <th>{language === 'en' ? 'Date' : 'तारीख'}</th>
                      <th>{language === 'en' ? 'Action' : 'कार्यवाई'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.fullName}</td>
                        <td>{user.phone}</td>
                        <td>{user.district || 'N/A'}</td>
                        <td>{user.block || 'N/A'}</td>
                        <td>
                          {user.familyMembers && user.familyMembers.length > 0
                            ? <button
                                onClick={() => { setFamilyModalUser(user); setShowFamilyModal(true); }}
                                title={language === 'en' ? 'Click to view family members' : 'परिवार की जानकारी देखें'}
                                style={{ background: '#e3f2fd', color: '#1565c0', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: '600', border: '1px solid #90caf9', cursor: 'pointer' }}
                              >👨‍👩‍👧‍👦 {user.familyMembers.length}</button>
                            : <span style={{ color: '#ccc', fontSize: '12px' }}>—</span>
                          }
                        </td>
                        <td>{new Date(user.registeredAt).toLocaleDateString('en-GB')}</td>
                        <td>
                          <button 
                            className="view-btn-inline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                          >
                            {language === 'en' ? 'View' : 'देखें'}
                          </button>
                          {user.status === 'approved' && (
                            <button
                              className="view-btn-inline"
                              style={{ marginLeft: '6px', background: 'linear-gradient(135deg, #d4a017, #e8c44a)', color: '#fff', border: 'none' }}
                              onClick={() => {
                                setCertificateUser(user);
                                setShowCertificate(true);
                              }}
                              title={language === 'en' ? 'View Certificate' : 'प्रमाण-पत्र'}
                            >
                              🏅
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Family Members Detail Modal */}
          {showFamilyModal && familyModalUser && (
            <div className="modal-overlay" onClick={() => setShowFamilyModal(false)}>
              <div className="modal-content family-detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowFamilyModal(false)}>×</button>
                <h2 style={{ marginBottom: '4px' }}>
                  👨‍👩‍👧‍👦 {language === 'en' ? 'Family Members' : 'पारिवारिक सदस्य'}
                </h2>
                <p style={{ color: '#666', fontSize: '14px', marginTop: 0, marginBottom: '16px' }}>
                  {familyModalUser.fullName} — {familyModalUser.familyMembers.length} {language === 'en' ? 'member(s)' : 'सदस्य'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {familyModalUser.familyMembers.map((member, idx) => (
                    <div key={member._id || idx} style={{
                      background: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      {member.photoPath
                        ? <img src={member.photoPath} alt={member.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #90caf9', flexShrink: 0 }} />
                        : <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>👤</div>
                      }
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#212529', marginBottom: '4px' }}>{member.name}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ background: '#e3f2fd', color: '#1565c0', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', fontWeight: '600' }}>{member.relation}</span>
                          {member.gender && (
                            <span style={{ background: '#f3e5f5', color: '#6a1b9a', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>
                              {member.gender === 'male' ? (language === 'en' ? '♂ Male' : '♂ पुरुष') : member.gender === 'female' ? (language === 'en' ? '♀ Female' : '♀ महिला') : (language === 'en' ? 'Other' : 'अन्य')}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#555', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {member.dateOfBirth && (
                            <span>🎂 {language === 'en' ? 'DOB:' : 'जन्म तिथि:'} {new Date(member.dateOfBirth).toLocaleDateString('en-IN')}</span>
                          )}
                          {member.occupation && (
                            <span>💼 {language === 'en' ? 'Occupation:' : 'व्यवसाय:'} {member.occupation}</span>
                          )}
                          {member.phone && (
                            <span>📞 {member.phone}</span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>
                          {member.addedFrom === 'registration'
                            ? (language === 'en' ? '📝 Added during registration' : '📝 पंजीकरण के समय जोड़ा गया')
                            : member.addedAt
                              ? (language === 'en' ? `✏️ Added on ${new Date(member.addedAt).toLocaleDateString('en-IN')}` : `✏️ ${new Date(member.addedAt).toLocaleDateString('en-IN')} को जोड़ा गया`)
                              : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showUserModal && selectedUser && (
            <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowUserModal(false)}>×</button>
                <h2>{selectedUser.fullName}</h2>
                <div className="modal-details">
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? "Father's Name:" : 'पिता का नाम:'}</span>
                    <span className="detail-value">{selectedUser.fatherName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Date of Birth:' : 'जन्म तिथि:'}</span>
                    <span className="detail-value">{new Date(selectedUser.dateOfBirth).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Gender:' : 'लिंग:'}</span>
                    <span className="detail-value">{selectedUser.gender}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Phone:' : 'फोन:'}</span>
                    <span className="detail-value">{selectedUser.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Email:' : 'ईमेल:'}</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Address:' : 'पता:'}</span>
                    <span className="detail-value">{selectedUser.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Village:' : 'गाँव:'}</span>
                    <span className="detail-value">{selectedUser.village}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Block:' : 'खंड:'}</span>
                    <span className="detail-value">{selectedUser.block}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Tehsil:' : 'तहसील:'}</span>
                    <span className="detail-value">{selectedUser.tehsil}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'District:' : 'जिला:'}</span>
                    <span className="detail-value">{selectedUser.district}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'City:' : 'शहर:'}</span>
                    <span className="detail-value">{selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Occupation:' : 'व्यवसाय:'}</span>
                    <span className="detail-value">{selectedUser.occupation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Education:' : 'शिक्षा:'}</span>
                    <span className="detail-value">{selectedUser.education}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'ID Proof:' : 'पहचान प्रमाण:'}</span>
                    <a href={selectedUser.idProofPath} target="_blank" rel="noreferrer" className="pdf-link">
                      PDF {language === 'en' ? 'View' : 'देखें'} 📄
                    </a>
                  </div>

                  {/* Family Members Section */}
                  {selectedUser.familyMembers && selectedUser.familyMembers.length > 0 && (
                    <div className="detail-row family-detail-row" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px' }}>
                      <span className="detail-label" style={{ marginBottom: '8px' }}>
                        👨‍👩‍👧‍👦 {language === 'en' ? `Family Members (${selectedUser.familyMembers.length}):` : `पारिवारिक सदस्य (${selectedUser.familyMembers.length}):`}
                      </span>
                      <div style={{ width: '100%' }}>
                        {selectedUser.familyMembers.map((member, idx) => (
                          <div key={member._id || idx} style={{
                            background: '#f8f9fa',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            marginBottom: '6px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}>
                            <span style={{ fontSize: '20px' }}>👤</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '600', color: '#333' }}>{member.name}</div>
                              <div style={{ fontSize: '13px', color: '#666' }}>
                                <span style={{ background: '#e3f2fd', color: '#1565c0', borderRadius: '4px', padding: '1px 6px', marginRight: '6px', fontSize: '12px' }}>{member.relation}</span>
                                {member.gender && <span style={{ marginRight: '6px' }}>{member.gender === 'male' ? (language === 'en' ? 'Male' : 'पुरुष') : member.gender === 'female' ? (language === 'en' ? 'Female' : 'महिला') : (language === 'en' ? 'Other' : 'अन्य')}</span>}
                                {member.dateOfBirth && <span style={{ marginRight: '6px' }}>DOB: {new Date(member.dateOfBirth).toLocaleDateString('en-IN')}</span>}
                                {member.occupation && <span style={{ marginRight: '6px' }}>{member.occupation}</span>}
                                {member.phone && <span>📞 {member.phone}</span>}
                              </div>
                              <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
                                {member.addedFrom === 'registration'
                                  ? (language === 'en' ? '📝 Added during registration' : '📝 पंजीकरण के समय जोड़ा गया')
                                  : (language === 'en' ? `✏️ Added from profile on ${new Date(member.addedAt).toLocaleDateString('en-IN')}` : `✏️ प्रोफ़ाइल से ${new Date(member.addedAt).toLocaleDateString('en-IN')} को जोड़ा गया`)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedUser.familyMembers && selectedUser.familyMembers.length === 0 && (
                    <div className="detail-row" style={{ marginTop: '8px' }}>
                      <span className="detail-label">👨‍👩‍👧‍👦 {language === 'en' ? 'Family Members:' : 'पारिवारिक सदस्य:'}</span>
                      <span className="detail-value" style={{ color: '#999', fontStyle: 'italic' }}>{language === 'en' ? 'None added' : 'कोई नहीं'}</span>
                    </div>
                  )}
                </div>
                
                {selectedUser.status === 'pending' && (
                  <div className="modal-actions">
                    <button className="approve-btn" onClick={() => { handleApprove(selectedUser._id); setShowUserModal(false); }}>
                      {language === 'en' ? 'Approve' : 'स्वीकृत करें'}
                    </button>
                    <button className="reject-btn" onClick={() => {
                      const reason = prompt(language === 'en' ? 'Enter rejection reason:' : 'अस्वीकृति कारण दर्ज करें:');
                      if (reason) {
                        handleReject(selectedUser._id, reason);
                        setShowUserModal(false);
                      }
                    }}>
                      {language === 'en' ? 'Reject' : 'अस्वीकृत करें'}
                    </button>
                  </div>
                )}

                {selectedUser.status === 'approved' && (
                  <div className="modal-actions">
                    <button
                      className="approve-btn"
                      style={{ background: 'linear-gradient(135deg, #d4a017, #e8c44a)', fontSize: '14px' }}
                      onClick={() => {
                        setCertificateUser(selectedUser);
                        setShowCertificate(true);
                        setShowUserModal(false);
                      }}
                    >
                      🏅 {language === 'en' ? 'View Certificate' : 'प्रमाण-पत्र देखें'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'oath' && (
        <div className="oath-agreements-section">
          <h2>{language === 'en' ? '📜 Oath Agreements' : '📜 शपथ समझौते'}</h2>
          <div className="stats-grid">
            <div className="stat-card total-card">
              <div className="stat-number">{oathAgreements.length}</div>
              <div className="stat-label">{language === 'en' ? 'Total Agreements' : 'कुल समझौते'}</div>
            </div>
          </div>

          {oathAgreements.length === 0 ? (
            <p className="no-data">{language === 'en' ? 'No oath agreements yet' : 'अभी तक कोई शपथ समझौता नहीं'}</p>
          ) : (
            <div className="members-table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>{language === 'en' ? 'Name' : 'नाम'}</th>
                    <th>{language === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}</th>
                    <th>{language === 'en' ? 'Agreed At' : 'सहमति दिनांक'}</th>
                    <th>{language === 'en' ? 'IP Address' : 'आईपी पता'}</th>
                  </tr>
                </thead>
                <tbody>
                  {oathAgreements.map((agreement) => (
                    <tr key={agreement._id}>
                      <td>{agreement.name}</td>
                      <td>{agreement.mobileNumber}</td>
                      <td>{new Date(agreement.agreedAt).toLocaleString()}</td>
                      <td>{agreement.ipAddress || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="gallery-management">
          <div className="gallery-form">
            <h2>{language === 'en' ? 'Upload Photo' : 'फोटो अपलोड करें'}</h2>
            <form onSubmit={handleGallerySubmit}>
              <input
                type="text"
                placeholder={language === 'en' ? 'Photo Title' : 'फोटो शीर्षक'}
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder={language === 'en' ? 'Description (optional)' : 'विवरण (वैकल्पिक)'}
                value={galleryForm.description}
                onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
              />
              <select
                value={galleryForm.category}
                onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})}
              >
                <option value="general">{language === 'en' ? 'General' : 'सामान्य'}</option>
                <option value="events">{language === 'en' ? 'Events' : 'कार्यक्रम'}</option>
                <option value="community">{language === 'en' ? 'Community' : 'समुदाय'}</option>
              </select>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                  {language === 'en' ? 'Select Image:' : 'छवि चुनें:'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryForm({...galleryForm, image: e.target.files[0]})}
                  required
                />
                {galleryForm.image && (
                  <p style={{marginTop: '5px', color: '#28a745', fontSize: '14px'}}>
                    ✓ {galleryForm.image.name}
                  </p>
                )}
              </div>
              <button type="submit" disabled={gallerySubmitting} style={{ opacity: gallerySubmitting ? 0.75 : 1, cursor: gallerySubmitting ? 'not-allowed' : 'pointer' }}>
                {gallerySubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="admin-spinner" />
                    {language === 'en' ? 'Uploading photo...' : 'फोटो अपलोड हो रही है...'}
                  </span>
                ) : (language === 'en' ? 'Upload Photo' : 'फोटो अपलोड करें')}
              </button>
              {galleryStatus && (
                <div style={{
                  marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '14px',
                  background: galleryStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: galleryStatus.type === 'success' ? '#155724' : '#721c24',
                  border: `1px solid ${galleryStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  {galleryStatus.msg}
                </div>
              )}
            </form>
          </div>

          <div className="gallery-list">
            <h2>{language === 'en' ? 'All Photos' : 'सभी फोटो'}</h2>
            <div className="gallery-grid">
              {[...gallery].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((photo, idx, arr) => (
                <div key={photo._id} className="gallery-card">
                  <img src={photo.imagePath} alt={photo.title} />
                  <div className="gallery-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <span style={{ background: '#e3f2fd', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px', color: '#1565c0', flexShrink: 0 }}>{idx + 1}</span>
                      <button onClick={() => reorderItems(arr, idx, 'up', 'gallery-reorder', fetchGallery)} disabled={idx === 0} style={{ padding: '2px 7px', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↑</button>
                      <button onClick={() => reorderItems(arr, idx, 'down', 'gallery-reorder', fetchGallery)} disabled={idx === arr.length - 1} style={{ padding: '2px 7px', cursor: idx === arr.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === arr.length - 1 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↓</button>
                    </div>
                    <h3>{photo.title}</h3>
                    <p>{photo.description}</p>
                    <span className="category-badge">{photo.category}</span>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      <button onClick={() => { setEditingGallery(photo); setEditGalleryForm({ title: photo.title, description: photo.description || '', category: photo.category }); }} className="view-btn-inline" style={{ fontSize: '12px', padding: '4px 10px' }}>
                        {language === 'en' ? '✏️ Edit' : '✏️ संपादित'}
                      </button>
                      <button onClick={() => handleDeletePhoto(photo._id)} className="delete-btn">
                        {language === 'en' ? 'Delete' : 'हटाएं'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="oath-agreements-section">
          <h2>{language === 'en' ? '📩 Contact Messages' : '📩 संपर्क संदेश'}</h2>
          <div className="stats-grid">
            <div className="stat-card total-card">
              <div className="stat-number">{contacts.length}</div>
              <div className="stat-label">{language === 'en' ? 'Total Messages' : 'कुल संदेश'}</div>
            </div>
            <div className="stat-card pending-card">
              <div className="stat-number">{contacts.filter(c => !c.isRead).length}</div>
              <div className="stat-label">{language === 'en' ? 'Unread' : 'अपठित'}</div>
            </div>
          </div>

          {contacts.length === 0 ? (
            <p className="no-data">{language === 'en' ? 'No contact messages yet' : 'अभी तक कोई संदेश नहीं'}</p>
          ) : (
            <div className="members-table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>{language === 'en' ? 'Name' : 'नाम'}</th>
                    <th>{language === 'en' ? 'Email' : 'ईमेल'}</th>
                    <th>{language === 'en' ? 'Phone' : 'फोन'}</th>
                    <th>{language === 'en' ? 'Subject' : 'विषय'}</th>
                    <th>{language === 'en' ? 'Message' : 'संदेश'}</th>
                    <th>{language === 'en' ? 'Date' : 'दिनांक'}</th>
                    <th>{language === 'en' ? 'Status' : 'स्थिति'}</th>
                    <th>{language === 'en' ? 'Actions' : 'कार्यवाही'}</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id} style={{ background: contact.isRead ? 'transparent' : '#fff8f0' }}>
                      <td><strong>{contact.name}</strong></td>
                      <td><a href={`mailto:${contact.email}`}>{contact.email}</a></td>
                      <td>{contact.phone || '-'}</td>
                      <td>{contact.subject}</td>
                      <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{contact.message}</td>
                      <td>{new Date(contact.submittedAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <span style={{ color: contact.isRead ? '#888' : '#e07b39', fontWeight: contact.isRead ? 'normal' : 'bold' }}>
                          {contact.isRead ? (language === 'en' ? 'Read' : 'पढ़ा') : (language === 'en' ? 'Unread' : 'अपठित')}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {!contact.isRead && (
                          <button
                            className="approve-btn"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                            onClick={async () => {
                              const pwd = localStorage.getItem('adminPassword');
                              await fetch(`${API_URL}/admin/contacts/${contact._id}/read`, {
                                method: 'PATCH',
                                headers: { 'x-admin-password': pwd }
                              });
                              fetchContacts();
                            }}
                          >
                            {language === 'en' ? 'Mark Read' : 'पढ़ा हुआ'}
                          </button>
                        )}
                        <button
                          className="delete-btn"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={async () => {
                            if (!window.confirm(language === 'en' ? 'Delete this message?' : 'इस संदेश को हटाएं?')) return;
                            const pwd = localStorage.getItem('adminPassword');
                            await fetch(`${API_URL}/admin/contacts/${contact._id}`, {
                              method: 'DELETE',
                              headers: { 'x-admin-password': pwd }
                            });
                            fetchContacts();
                          }}
                        >
                          {language === 'en' ? 'Delete' : 'हटाएं'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'nonmembers' && (
        <div className="oath-agreements-section">
          <h2>{language === 'en' ? '👥 Non-Members Directory' : '👥 अन्य सदस्य डायरेक्टरी'}</h2>
          <div className="stats-grid">
            <div className="stat-card total-card">
              <div className="stat-number">{nonMembers.length}</div>
              <div className="stat-label">{language === 'en' ? 'Total Records' : 'कुल रिकॉर्ड'}</div>
            </div>
            <div className="stat-card approved-card">
              <div className="stat-number">{[...new Set(nonMembers.map(r => r.state).filter(Boolean))].length}</div>
              <div className="stat-label">{language === 'en' ? 'States' : 'राज्य'}</div>
            </div>
            <div className="stat-card pending-card">
              <div className="stat-number">{[...new Set(nonMembers.map(r => r.place).filter(Boolean))].length}</div>
              <div className="stat-label">{language === 'en' ? 'Places' : 'स्थान'}</div>
            </div>
          </div>

          <div style={{ margin: '16px 0' }}>
            <input
              type="text"
              placeholder={language === 'en' ? 'Search by name, place, state, district...' : 'नाम, स्थान, राज्य, जिले से खोजें...'}
              value={nmSearch}
              onChange={e => setNmSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          {nonMembers.length === 0 ? (
            <p className="no-data">{language === 'en' ? 'No non-member records yet' : 'अभी तक कोई अन्य सदस्य रिकॉर्ड नहीं'}</p>
          ) : (
            <div className="members-table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>{language === 'en' ? 'Photo' : 'फोटो'}</th>
                    <th>{language === 'en' ? 'Name' : 'नाम'}</th>
                    <th>{language === 'en' ? 'Age' : 'आयु'}</th>
                    <th>{language === 'en' ? 'Place' : 'स्थान'}</th>
                    <th>{language === 'en' ? 'Relationship' : 'संबंध'}</th>
                    <th>{language === 'en' ? 'District' : 'जिला'}</th>
                    <th>{language === 'en' ? 'State' : 'राज्य'}</th>
                    <th>{language === 'en' ? 'Added By' : 'जोड़ा किसने'}</th>
                    <th>{language === 'en' ? 'Added On' : 'जोड़ा गया'}</th>
                    <th>{language === 'en' ? 'Actions' : 'कार्यवाही'}</th>
                  </tr>
                </thead>
                <tbody>
                  {nonMembers
                    .filter(r => {
                      const q = nmSearch.toLowerCase();
                      return !q ||
                        r.fullName?.toLowerCase().includes(q) ||
                        r.place?.toLowerCase().includes(q) ||
                        r.state?.toLowerCase().includes(q) ||
                        r.district?.toLowerCase().includes(q) ||
                        r.relationship?.toLowerCase().includes(q);
                    })
                    .map(r => (
                    <tr key={r._id}>
                      <td>
                        {r.photoPath
                          ? <img src={r.photoPath} alt={r.fullName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '1.6rem' }}>👤</span>}
                      </td>
                      <td><strong>{r.fullName}</strong></td>
                      <td>{r.age}</td>
                      <td>{r.place}</td>
                      <td>{r.relationship || '-'}</td>
                      <td>{r.district || '-'}</td>
                      <td>{r.state || '-'}</td>
                      <td>
                        {r.addedBy
                          ? <span style={{ fontWeight: 600, color: '#FF6B35' }}>{r.addedBy.fullName}</span>
                          : <span style={{ color: '#aaa' }}>-</span>}
                      </td>
                      <td>{new Date(r.addedAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          className="approve-btn"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => setViewNmRecord(r)}
                        >
                          {language === 'en' ? 'View' : 'देखें'}
                        </button>
                        <button
                          className="delete-btn"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={async () => {
                            if (!window.confirm(language === 'en' ? 'Delete this record?' : 'इस रिकॉर्ड को हटाएं?')) return;
                            const pwd = localStorage.getItem('adminPassword');
                            await fetch(`${API_URL}/users/non-members/${r._id}`, {
                              method: 'DELETE',
                              headers: { 'x-admin-password': pwd }
                            });
                            fetchNonMembers();
                          }}
                        >
                          {language === 'en' ? 'Delete' : 'हटाएं'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'donors' && (
        <div className="gallery-management">
          <div className="gallery-form">
            <h2>{language === 'en' ? '🙏 Add Sahyogi Sadashya (Donor)' : '🙏 सहयोगी सदस्य जोड़ें'}</h2>
            <form id="donor-form" onSubmit={handleDonorSubmit}>
              <input
                type="text"
                placeholder={language === 'en' ? 'Full Name *' : 'पूरा नाम *'}
                value={donorForm.fullName}
                onChange={(e) => setDonorForm({...donorForm, fullName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'City' : 'शहर'}
                value={donorForm.city}
                onChange={(e) => setDonorForm({...donorForm, city: e.target.value})}
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'State' : 'राज्य'}
                value={donorForm.state}
                onChange={(e) => setDonorForm({...donorForm, state: e.target.value})}
              />
              <input
                type="number"
                placeholder={language === 'en' ? 'Donation Amount (₹) *' : 'दान राशि (₹) *'}
                value={donorForm.donationAmount}
                onChange={(e) => setDonorForm({...donorForm, donationAmount: e.target.value})}
                min="1"
                required
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'Donation Purpose (e.g. Parivar Bhavan)' : 'दान का उद्देश्य (जैसे परिवार भवन)'}
                value={donorForm.donationPurpose}
                onChange={(e) => setDonorForm({...donorForm, donationPurpose: e.target.value})}
              />
              <textarea
                placeholder={language === 'en' ? 'Message (optional)' : 'संदेश (वैकल्पिक)'}
                value={donorForm.message}
                onChange={(e) => setDonorForm({...donorForm, message: e.target.value})}
              />
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                  {language === 'en' ? 'Donor Photo (optional):' : 'सहयोगी की फोटो (वैकल्पिक):'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDonorForm({...donorForm, photo: e.target.files[0]})}
                />
                {donorForm.photo && (
                  <p style={{marginTop: '5px', color: '#28a745', fontSize: '14px'}}>✓ {donorForm.photo.name}</p>
                )}
              </div>
              <button type="submit" disabled={donorSubmitting} style={{ opacity: donorSubmitting ? 0.75 : 1, cursor: donorSubmitting ? 'not-allowed' : 'pointer' }}>
                {donorSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="admin-spinner" />
                    {language === 'en' ? 'Adding donor...' : 'सहयोगी जोड़ा जा रहा है...'}
                  </span>
                ) : (language === 'en' ? 'Add Donor' : 'सहयोगी जोड़ें')}
              </button>
              {donorStatus && (
                <div style={{
                  marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '14px',
                  background: donorStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: donorStatus.type === 'success' ? '#155724' : '#721c24',
                  border: `1px solid ${donorStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  {donorStatus.msg}
                </div>
              )}
            </form>
          </div>

          <div className="gallery-list">
            <h2>{language === 'en' ? `All Donors (${donors.length})` : `सभी सहयोगी (${donors.length})`}</h2>
            <div className="gallery-grid">
              {donors.length === 0 ? (
                <p style={{ color: '#888' }}>{language === 'en' ? 'No donors added yet' : 'अभी तक कोई सहयोगी नहीं जोड़ा गया'}</p>
              ) : [...donors].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((donor, idx, arr) => (
                <div key={donor._id} className="gallery-card">
                  {donor.photoPath
                    ? <img src={donor.photoPath} alt={donor.fullName} style={{ objectFit: 'cover' }} />
                    : <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: '#fff5ef' }}>🙏</div>
                  }
                  <div className="gallery-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <span style={{ background: '#e3f2fd', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px', color: '#1565c0', flexShrink: 0 }}>{idx + 1}</span>
                      <button onClick={() => reorderItems(arr, idx, 'up', 'donors-reorder', fetchDonors)} disabled={idx === 0} style={{ padding: '2px 7px', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↑</button>
                      <button onClick={() => reorderItems(arr, idx, 'down', 'donors-reorder', fetchDonors)} disabled={idx === arr.length - 1} style={{ padding: '2px 7px', cursor: idx === arr.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === arr.length - 1 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↓</button>
                    </div>
                    <h3>{donor.fullName}</h3>
                    <p style={{ fontWeight: 700, color: '#FF6B35', fontSize: '1.05rem' }}>₹{Number(donor.donationAmount).toLocaleString('en-IN')}</p>
                    {donor.donationPurpose && <p>{donor.donationPurpose}</p>}
                    {(donor.city || donor.state) && <p>📍 {[donor.city, donor.state].filter(Boolean).join(', ')}</p>}
                    {donor.message && <p style={{ fontStyle: 'italic', color: '#888' }}>"{donor.message}"</p>}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      <button onClick={() => { setEditingDonor(donor); setEditDonorForm({ fullName: donor.fullName, city: donor.city || '', state: donor.state || '', donationAmount: donor.donationAmount, donationPurpose: donor.donationPurpose || '', message: donor.message || '', newPhoto: null }); }} className="view-btn-inline" style={{ fontSize: '12px', padding: '4px 10px' }}>
                        {language === 'en' ? '✏️ Edit' : '✏️ संपादित'}
                      </button>
                      <button onClick={() => handleDeleteDonor(donor._id)} className="delete-btn">
                        {language === 'en' ? 'Delete' : 'हटाएं'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewNmRecord && (
        <div className="modal-overlay" onClick={() => setViewNmRecord(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewNmRecord(null)}>×</button>
            <h2>👤 {viewNmRecord.fullName}</h2>
            {viewNmRecord.photoPath && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img src={viewNmRecord.photoPath} alt={viewNmRecord.fullName}
                  style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffe0d4' }} />
              </div>
            )}
            <div className="user-details">
              {[
                [language === 'en' ? 'Full Name' : 'पूरा नाम', viewNmRecord.fullName],
                [language === 'en' ? 'Age' : 'आयु', viewNmRecord.age],
                [language === 'en' ? 'Place' : 'स्थान', viewNmRecord.place],
                [language === 'en' ? 'Relationship' : 'संबंध', viewNmRecord.relationship],
                [language === 'en' ? "Father's Name" : 'पिता का नाम', viewNmRecord.fatherName],
                [language === 'en' ? 'Gender' : 'लिंग', viewNmRecord.gender],
                [language === 'en' ? 'Phone' : 'फोन', viewNmRecord.phone],
                [language === 'en' ? 'Email' : 'ईमेल', viewNmRecord.email],
                [language === 'en' ? 'Occupation' : 'व्यवसाय', viewNmRecord.occupation],
                [language === 'en' ? 'Education' : 'शिक्षा', viewNmRecord.education],
                [language === 'en' ? 'Village' : 'गाँव', viewNmRecord.village],
                [language === 'en' ? 'Block' : 'ब्लॉक', viewNmRecord.block],
                [language === 'en' ? 'Tehsil' : 'तहसील', viewNmRecord.tehsil],
                [language === 'en' ? 'District' : 'जिला', viewNmRecord.district],
                [language === 'en' ? 'State' : 'राज्य', viewNmRecord.state],
                [language === 'en' ? 'Pincode' : 'पिन कोड', viewNmRecord.pincode],
                [language === 'en' ? 'Address' : 'पता', viewNmRecord.address],
                [language === 'en' ? 'Added On' : 'जोड़ा गया', new Date(viewNmRecord.addedAt).toLocaleDateString('en-IN')],
                [language === 'en' ? 'Added By' : 'जोड़ा किसने', viewNmRecord.addedBy?.fullName || null],
                [language === 'en' ? 'Adder Email' : 'जोड़ने वाले का ईमेल', viewNmRecord.addedBy?.email || null],
              ].filter(([, val]) => val).map(([label, val]) => (
                <div className="detail-group" key={label}>
                  <label>{label}:</label>
                  <p style={{ textTransform: label === (language === 'en' ? 'Gender' : 'लिंग') ? 'capitalize' : 'none' }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>
            
            <h2>{language === 'en' ? 'User Details' : 'उपयोगकर्ता विवरण'}</h2>
            
            <div className="user-details">
              <div className="detail-group">
                <label>{language === 'en' ? 'Full Name:' : 'पूरा नाम:'}</label>
                <p>{selectedUser.fullName}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? "Father's Name:" : 'पिता का नाम:'}</label>
                <p>{selectedUser.fatherName}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Phone:' : 'फोन:'}</label>
                <p>{selectedUser.phone}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Email:' : 'ईमेल:'}</label>
                <p>{selectedUser.email}</p>
              </div>
              
              <div className="detail-group">                <label>{language === 'en' ? 'Password:' : 'पासवर्ड:'}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <p style={{ margin: 0 }}>
                    {showPassword ? selectedUser.password : '••••••••'}
                  </p>
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: '#ff6b35',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    {showPassword ? (language === 'en' ? '👁️ Hide' : '👁️ छुपाएं') : (language === 'en' ? '👁️ Show' : '👁️ दिखाएं')}
                  </button>
                </div>
              </div>
              
              <div className="detail-group">                <label>{language === 'en' ? 'Address:' : 'पता:'}</label>
                <p>{selectedUser.address}, {selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Occupation:' : 'व्यवसाय:'}</label>
                <p>{selectedUser.occupation}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Registered:' : 'पंजीकृत:'}</label>
                <p>{new Date(selectedUser.registeredAt).toLocaleString()}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Status:' : 'स्थिति:'}</label>
                <span className={`status-badge ${selectedUser.status}`}>{selectedUser.status}</span>
              </div>

              {selectedUser.rejectionReason && (
                <div className="detail-group">
                  <label>{language === 'en' ? 'Rejection Reason:' : 'अस्वीकृति कारण:'}</label>
                  <p className="rejection-reason">{selectedUser.rejectionReason}</p>
                </div>
              )}
              
              <div className="documents-section">
                <h3>{language === 'en' ? 'Documents' : 'दस्तावेज़'}</h3>
                
                {selectedUser.photoPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'Photo:' : 'फोटो:'}</label>
                    <div className="photo-preview">
                      <img 
                        src={selectedUser.photoPath} 
                        alt={selectedUser.fullName} 
                        className="user-photo-thumbnail"
                      />
                      <a 
                        href={selectedUser.photoPath} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="view-photo-btn"
                      >
                        {language === 'en' ? '🔍 View Full Size' : '🔍 पूर्ण आकार देखें'}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedUser.idProofPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'ID Proof:' : 'पहचान प्रमाण:'}</label>
                    <a href={selectedUser.idProofPath} target="_blank" rel="noopener noreferrer">
                      {language === 'en' ? 'View ID Proof' : 'पहचान प्रमाण देखें'}
                    </a>
                  </div>
                )}
                
                {selectedUser.addressProofPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'Address Proof:' : 'पता प्रमाण:'}</label>
                    <a href={selectedUser.addressProofPath} target="_blank" rel="noopener noreferrer">
                      {language === 'en' ? 'View Address Proof' : 'पता प्रमाण देखें'}
                    </a>
                  </div>
                )}
                
                {selectedUser.donationDocumentPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'Donation Document:' : 'सहयोग दस्तावेज़:'}</label>
                    <a href={selectedUser.donationDocumentPath} target="_blank" rel="noopener noreferrer">
                      {language === 'en' ? 'View Donation Document' : 'सहयोग दस्तावेज़ देखें'}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              {selectedUser.status === 'pending' && (
                <>
                  <button onClick={() => handleApprove(selectedUser._id)} className="approve-btn">
                    {language === 'en' ? 'Approve' : 'स्वीकृत करें'}
                  </button>
                  <div className="reject-section">
                    <textarea
                      placeholder={language === 'en' ? 'Rejection reason...' : 'अस्वीकृति कारण...'}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button onClick={() => handleReject(selectedUser._id)} className="reject-btn">
                      {language === 'en' ? 'Reject' : 'अस्वीकृत करें'}
                    </button>
                  </div>
                </>
              )}
              
              {(selectedUser.status === 'approved' || selectedUser.status === 'rejected') && (
                <button onClick={() => handleSetPending(selectedUser._id)} className="pending-btn">
                  {language === 'en' ? 'Set to Pending' : 'लंबित पर सेट करें'}
                </button>
              )}
              
              {selectedUser.status === 'rejected' && (
                <button onClick={() => handleDelete(selectedUser._id)} className="delete-btn">
                  {language === 'en' ? 'Delete' : 'हटाएं'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="gallery-management">
          <div className="gallery-form">
            <h2>{language === 'en' ? '🏅 Add Upadhidharak / Prakosht Member' : '🏅 उपाधिधारक / प्रकोष्ठ सदस्य जोड़ें'}</h2>

            {/* Toggle type */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setCommunityMemberType('upadhi')}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer',
                  background: communityMemberType === 'upadhi' ? 'linear-gradient(135deg, #d4a017, #e8c44a)' : '#f0f0f0',
                  color: communityMemberType === 'upadhi' ? '#fff' : '#555',
                  border: 'none'
                }}
              >
                🏆 {language === 'en' ? 'Upadhidharak (उपाधिधारक)' : 'उपाधिधारक'}
              </button>
              <button
                type="button"
                onClick={() => setCommunityMemberType('prakosht')}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer',
                  background: communityMemberType === 'prakosht' ? 'linear-gradient(135deg, #FF6B35, #ff8c5a)' : '#f0f0f0',
                  color: communityMemberType === 'prakosht' ? '#fff' : '#555',
                  border: 'none'
                }}
              >
                🏛️ {language === 'en' ? 'Prakosht Member (प्रकोष्ठ)' : 'प्रकोष्ठ सदस्य'}
              </button>
            </div>

            <form id="community-form" onSubmit={handleCommunityMemberSubmit}>
              <input
                type="text"
                placeholder={language === 'en' ? 'Full Name *' : 'पूरा नाम *'}
                value={communityForm.fullName}
                onChange={(e) => setCommunityForm({ ...communityForm, fullName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'Designation (e.g. Dr., Adv.)' : 'पदनाम (जैसे डॉ., अधि.)'}
                value={communityForm.designation}
                onChange={(e) => setCommunityForm({ ...communityForm, designation: e.target.value })}
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'Occupation / Role' : 'व्यवसाय / भूमिका'}
                value={communityForm.occupation}
                onChange={(e) => setCommunityForm({ ...communityForm, occupation: e.target.value })}
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'City' : 'शहर'}
                value={communityForm.city}
                onChange={(e) => setCommunityForm({ ...communityForm, city: e.target.value })}
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'State' : 'राज्य'}
                value={communityForm.state}
                onChange={(e) => setCommunityForm({ ...communityForm, state: e.target.value })}
              />
              <textarea
                placeholder={language === 'en' ? 'Bio / Description (optional)' : 'बायो / विवरण (वैकल्पिक)'}
                value={communityForm.bio}
                onChange={(e) => setCommunityForm({ ...communityForm, bio: e.target.value })}
              />
              <textarea
                placeholder={language === 'en' ? 'Awards (optional)' : 'पुरस्कार (वैकल्पिक)'}
                value={communityForm.awards}
                onChange={(e) => setCommunityForm({ ...communityForm, awards: e.target.value })}
              />
              <textarea
                placeholder={language === 'en' ? 'Publications (optional)' : 'प्रकाशन (वैकल्पिक)'}
                value={communityForm.publications}
                onChange={(e) => setCommunityForm({ ...communityForm, publications: e.target.value })}
              />

              {communityMemberType === 'upadhi' ? (
                <select
                  value={communityForm.honoraryTitle}
                  onChange={(e) => setCommunityForm({ ...communityForm, honoraryTitle: e.target.value })}
                  required
                >
                  <option value="">{language === 'en' ? '-- Select Honorary Title --' : '-- उपाधि चुनें --'}</option>
                  <option value="मौनस शिरोमणि">मौनस शिरोमणि</option>
                  <option value="मौनस कुबेर">मौनस कुबेर</option>
                  <option value="मौनस रत्न">मौनस रत्न</option>
                  <option value="मौनस कुलभूषण">मौनस कुलभूषण</option>
                  <option value="मौनस कुलदीपक">मौनस कुलदीपक</option>
                  <option value="मौनस नायक">मौनस नायक</option>
                </select>
              ) : (
                <select
                  value={communityForm.prakosth}
                  onChange={(e) => setCommunityForm({ ...communityForm, prakosth: e.target.value })}
                  required
                >
                  <option value="">{language === 'en' ? '-- Select Prakosht --' : '-- प्रकोष्ठ चुनें --'}</option>
                  <option value="buddhijivi">{language === 'en' ? 'Intellectual Cell (बुद्धिजीवी प्रकोष्ठ)' : 'बुद्धिजीवी प्रकोष्ठ'}</option>
                  <option value="manav-seva">{language === 'en' ? 'Human Service Cell (मानव सेवा प्रकोष्ठ)' : 'मानव सेवा प्रकोष्ठ'}</option>
                  <option value="chikitsa">{language === 'en' ? 'Medical Cell (चिकित्सा प्रकोष्ठ)' : 'चिकित्सा प्रकोष्ठ'}</option>
                  <option value="vidhi">{language === 'en' ? 'Legal Cell (विधि प्रकोष्ठ)' : 'विधि प्रकोष्ठ'}</option>
                  <option value="vyapar">{language === 'en' ? 'Business Cell (व्यापार प्रकोष्ठ)' : 'व्यापार प्रकोष्ठ'}</option>
                  <option value="kisaan">{language === 'en' ? 'Farmer Cell (किसान प्रकोष्ठ)' : 'किसान प्रकोष्ठ'}</option>
                  <option value="khel">{language === 'en' ? 'Sports & Military Cell (खेल एवं सैनिक प्रकोष्ठ)' : 'खेल एवं सैनिक प्रकोष्ठ'}</option>
                  <option value="yuva">{language === 'en' ? 'Youth Cell (युवा प्रकोष्ठ)' : 'युवा प्रकोष्ठ'}</option>
                  <option value="mahila">{language === 'en' ? 'Women Cell (महिला प्रकोष्ठ)' : 'महिला प्रकोष्ठ'}</option>
                  <option value="veerangana">{language === 'en' ? 'Brave Women Cell (वीरांगना प्रकोष्ठ)' : 'वीरांगना प्रकोष्ठ'}</option>
                </select>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  {language === 'en' ? 'Photo (optional):' : 'फोटो (वैकल्पिक):'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCommunityForm({ ...communityForm, photo: e.target.files[0] })}
                />
                {communityForm.photo && (
                  <p style={{ marginTop: '5px', color: '#28a745', fontSize: '14px' }}>✓ {communityForm.photo.name}</p>
                )}
              </div>
              <button type="submit" disabled={communitySubmitting} style={{ opacity: communitySubmitting ? 0.75 : 1, cursor: communitySubmitting ? 'not-allowed' : 'pointer' }}>
                {communitySubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="admin-spinner" />
                    {communityMemberType === 'upadhi'
                      ? (language === 'en' ? 'Adding Upadhidharak...' : 'उपाधिधारक जोड़ा जा रहा है...')
                      : (language === 'en' ? 'Adding Prakosht member...' : 'प्रकोष्ठ सदस्य जोड़ा जा रहा है...')}
                  </span>
                ) : (
                  communityMemberType === 'upadhi'
                    ? (language === 'en' ? '🏆 Add Upadhidharak' : '🏆 उपाधिधारक जोड़ें')
                    : (language === 'en' ? '🏛️ Add Prakosht Member' : '🏛️ प्रकोष्ठ सदस्य जोड़ें')
                )}
              </button>
              {communityStatus && (
                <div style={{
                  marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '14px',
                  background: communityStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: communityStatus.type === 'success' ? '#155724' : '#721c24',
                  border: `1px solid ${communityStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  {communityStatus.msg}
                </div>
              )}
            </form>
          </div>

          {/* List */}
          <div className="gallery-list">
            {/* Upadhidharak section */}
            <h2>🏆 {language === 'en' ? `Upadhidharak (${communityMembers.filter(m => m.honoraryTitle).length})` : `उपाधिधारक (${communityMembers.filter(m => m.honoraryTitle).length})`}</h2>
            <input
              type="text"
              placeholder={language === 'en' ? '🔍 Search Upadhidharak members...' : '🔍 उपाधिधारक सदस्य खोजें...'}
              value={upadhiSearch}
              onChange={e => setUpadhiSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 14px', borderRadius: '8px', border: '1.5px solid #ffe082', marginBottom: '14px', fontSize: '14px', boxSizing: 'border-box', background: '#fffdf0' }}
            />
            <div className="gallery-grid">
              {communityMembers.filter(m => m.honoraryTitle).length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', background: '#fffdf0', borderRadius: '10px', border: '1.5px dashed #ffe082' }}>
                  <p style={{ color: '#888' }}>{language === 'en' ? 'No Upadhidharak added yet. Use the form above to add members.' : 'अभी तक कोई उपाधिधारक नहीं जोड़ा गया। ऊपर दिए फॉर्म से सदस्य जोड़ें।'}</p>
                </div>
              ) : [...communityMembers.filter(m => m.honoraryTitle && (!upadhiSearch || m.fullName.toLowerCase().includes(upadhiSearch.toLowerCase()) || (m.honoraryTitle && m.honoraryTitle.toLowerCase().includes(upadhiSearch.toLowerCase())) || (m.city && m.city.toLowerCase().includes(upadhiSearch.toLowerCase()))))].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((member, idx, arr) => (
                <div key={member._id} className="gallery-card">
                  {member.photoPath
                    ? <img src={member.photoPath} alt={member.fullName} style={{ objectFit: 'cover' }} />
                    : <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: '#fff9e6' }}>🏆</div>
                  }
                  <div className="gallery-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <span style={{ background: '#e3f2fd', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px', color: '#1565c0', flexShrink: 0 }}>{idx + 1}</span>
                      <button onClick={() => reorderItems(arr, idx, 'up', 'community-members-reorder', fetchCommunityMembers)} disabled={idx === 0} style={{ padding: '2px 7px', opacity: idx === 0 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↑</button>
                      <button onClick={() => reorderItems(arr, idx, 'down', 'community-members-reorder', fetchCommunityMembers)} disabled={idx === arr.length - 1} style={{ padding: '2px 7px', opacity: idx === arr.length - 1 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↓</button>
                    </div>
                    <h3>{member.fullName}</h3>
                    {member.designation && <p style={{ fontStyle: 'italic', color: '#888', fontSize: '13px', marginTop: '-6px' }}>{member.designation}</p>}
                    <p style={{ fontWeight: 700, color: '#d4a017', fontSize: '1rem' }}>{member.honoraryTitle}</p>
                    {member.occupation && <p>{member.occupation}</p>}
                    {(member.city || member.state) && <p>📍 {[member.city, member.state].filter(Boolean).join(', ')}</p>}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      <button onClick={() => { setEditingCommunity(member); setEditCommunityForm({ fullName: member.fullName, designation: member.designation || '', occupation: member.occupation || '', city: member.city || '', state: member.state || '', bio: member.bio || '', awards: member.awards || '', publications: member.publications || '', honoraryTitle: member.honoraryTitle || '', prakosth: member.prakosth || '', newPhoto: null }); }} className="view-btn-inline" style={{ fontSize: '12px', padding: '4px 10px' }}>
                        {language === 'en' ? '✏️ Edit' : '✏️ संपादित'}
                      </button>
                      <button onClick={() => handleDeleteCommunityMember(member._id)} className="delete-btn">
                        {language === 'en' ? 'Delete' : 'हटाएं'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prakosht section */}
            <h2 style={{ marginTop: '32px' }}>🏛️ {language === 'en' ? `Prakosht Members (${communityMembers.filter(m => m.prakosth).length})` : `प्रकोष्ठ सदस्य (${communityMembers.filter(m => m.prakosth).length})`}</h2>
            <input
              type="text"
              placeholder={language === 'en' ? '🔍 Search Prakosht members...' : '🔍 प्रकोष्ठ सदस्य खोजें...'}
              value={prakosthSearch}
              onChange={e => setPrakosthSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 14px', borderRadius: '8px', border: '1.5px solid #ffcc80', marginBottom: '14px', fontSize: '14px', boxSizing: 'border-box', background: '#fff8f0' }}
            />
            <div className="gallery-grid">
              {communityMembers.filter(m => m.prakosth).length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', background: '#fff8f0', borderRadius: '10px', border: '1.5px dashed #ffcc80' }}>
                  <p style={{ color: '#888' }}>{language === 'en' ? 'No Prakosht members added yet. Use the form above to add members.' : 'अभी तक कोई प्रकोष्ठ सदस्य नहीं जोड़ा गया। ऊपर दिए फॉर्म से सदस्य जोड़ें।'}</p>
                </div>
              ) : [...communityMembers.filter(m => m.prakosth && (!prakosthSearch || m.fullName.toLowerCase().includes(prakosthSearch.toLowerCase()) || (m.prakosth && m.prakosth.toLowerCase().includes(prakosthSearch.toLowerCase())) || (m.city && m.city.toLowerCase().includes(prakosthSearch.toLowerCase()))))].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((member, idx, arr) => (
                <div key={member._id} className="gallery-card">
                  {member.photoPath
                    ? <img src={member.photoPath} alt={member.fullName} style={{ objectFit: 'cover' }} />
                    : <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: '#fff5ef' }}>🏛️</div>
                  }
                  <div className="gallery-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <span style={{ background: '#e3f2fd', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px', color: '#1565c0', flexShrink: 0 }}>{idx + 1}</span>
                      <button onClick={() => reorderItems(arr, idx, 'up', 'community-members-reorder', fetchCommunityMembers)} disabled={idx === 0} style={{ padding: '2px 7px', opacity: idx === 0 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↑</button>
                      <button onClick={() => reorderItems(arr, idx, 'down', 'community-members-reorder', fetchCommunityMembers)} disabled={idx === arr.length - 1} style={{ padding: '2px 7px', opacity: idx === arr.length - 1 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↓</button>
                    </div>
                    <h3>{member.fullName}</h3>
                    {member.designation && <p style={{ fontStyle: 'italic', color: '#888', fontSize: '13px', marginTop: '-6px' }}>{member.designation}</p>}
                    <p style={{ fontWeight: 700, color: '#FF6B35', fontSize: '0.95rem' }}>
                      {{
                        'buddhijivi': 'बुद्धिजीवी प्रकोष्ठ', 'manav-seva': 'मानव सेवा प्रकोष्ठ',
                        'chikitsa': 'चिकित्सा प्रकोष्ठ', 'vidhi': 'विधि प्रकोष्ठ',
                        'vyapar': 'व्यापार प्रकोष्ठ', 'kisaan': 'किसान प्रकोष्ठ',
                        'khel': 'खेल एवं सैनिक प्रकोष्ठ', 'yuva': 'युवा प्रकोष्ठ',
                        'mahila': 'महिला प्रकोष्ठ', 'veerangana': 'वीरांगना प्रकोष्ठ'
                      }[member.prakosth] || member.prakosth}
                    </p>
                    {member.occupation && <p>{member.occupation}</p>}
                    {(member.city || member.state) && <p>📍 {[member.city, member.state].filter(Boolean).join(', ')}</p>}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      <button onClick={() => { setEditingCommunity(member); setEditCommunityForm({ fullName: member.fullName, designation: member.designation || '', occupation: member.occupation || '', city: member.city || '', state: member.state || '', bio: member.bio || '', awards: member.awards || '', publications: member.publications || '', honoraryTitle: member.honoraryTitle || '', prakosth: member.prakosth || '', newPhoto: null }); }} className="view-btn-inline" style={{ fontSize: '12px', padding: '4px 10px' }}>
                        {language === 'en' ? '✏️ Edit' : '✏️ संपादित'}
                      </button>
                      <button onClick={() => handleDeleteCommunityMember(member._id)} className="delete-btn">
                        {language === 'en' ? 'Delete' : 'हटाएं'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== COMMITTEES TAB ===== */}
      {activeTab === 'committees' && (
        <div className="gallery-management">
          {/* Sub-tabs for 3 committees */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { id: 'sanrakshak', label: 'संरक्षक कमेटी', labelEn: 'Sanrakshak Committee', color: '#5678c9' },
              { id: 'prabandhan', label: 'प्रबन्धन कमेटी', labelEn: 'Prabandhan Committee', color: '#e07b39' },
              { id: 'sanchalan', label: 'संचालक कमेटी', labelEn: 'Sanchalan Committee', color: '#28a745' },
            ].map(tab => (
              <button key={tab.id} type="button" onClick={() => {
                setCommitteeSubTab(tab.id);
                setCommitteeForm(f => ({ ...f, committee: tab.id }));
              }} style={{
                flex: 1, minWidth: '150px', padding: '12px 16px', borderRadius: '10px', fontWeight: '700',
                cursor: 'pointer', border: 'none', fontSize: '14px',
                background: committeeSubTab === tab.id ? tab.color : '#f0f0f0',
                color: committeeSubTab === tab.id ? '#fff' : '#555',
              }}>
                {language === 'en' ? tab.labelEn : tab.label}
              </button>
            ))}
          </div>

          <div className="gallery-form">
            <h2>
              {language === 'en'
                ? `➕ Add Member to ${committeeSubTab === 'sanrakshak' ? 'Sanrakshak' : committeeSubTab === 'prabandhan' ? 'Prabandhan' : 'Sanchalan'} Committee`
                : `➕ ${committeeSubTab === 'sanrakshak' ? 'संरक्षक' : committeeSubTab === 'prabandhan' ? 'प्रबन्धन' : 'संचालक'} कमेटी में सदस्य जोड़ें`}
            </h2>
            <form id="committee-form" onSubmit={handleAddCommitteeMember}>
              <input type="text" placeholder={language === 'en' ? 'Full Name *' : 'पूरा नाम *'}
                value={committeeForm.fullName} onChange={e => setCommitteeForm({ ...committeeForm, fullName: e.target.value })} required />
              <input type="text" placeholder={language === 'en' ? 'Designation / Role (e.g. President)' : 'पद / भूमिका (जैसे अध्यक्ष)'}
                value={committeeForm.designation} onChange={e => setCommitteeForm({ ...committeeForm, designation: e.target.value })} />
              <input type="text" placeholder={language === 'en' ? 'Location / Village / Town' : 'स्थान / गाँव / नगर'}
                value={committeeForm.position} onChange={e => setCommitteeForm({ ...committeeForm, position: e.target.value })} />
              <input type="text" placeholder={language === 'en' ? 'City' : 'शहर'}
                value={committeeForm.city} onChange={e => setCommitteeForm({ ...committeeForm, city: e.target.value })} />
              <input type="text" placeholder={language === 'en' ? 'State' : 'राज्य'}
                value={committeeForm.state} onChange={e => setCommitteeForm({ ...committeeForm, state: e.target.value })} />
              {/* Display page — only for Prabandhan */}
              {committeeSubTab === 'prabandhan' && (
                <div style={{ background: '#fff8f0', border: '1.5px solid #ffe0b2', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                  <label style={{ fontWeight: '700', fontSize: '14px', color: '#e07b39', display: 'block', marginBottom: '10px' }}>
                    📍 {language === 'en' ? 'Display this member on:' : 'यह सदस्य कहाँ दिखाएं:'}
                  </label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { val: 'about', label: language === 'en' ? 'About Page only' : 'केवल About पेज' },
                      { val: 'home', label: language === 'en' ? 'Home Page only' : 'केवल Home पेज' },
                      { val: 'both', label: language === 'en' ? 'Both Pages' : 'दोनों पेज' },
                    ].map(opt => (
                      <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: committeeForm.displayPage === opt.val ? '700' : '400', color: committeeForm.displayPage === opt.val ? '#e07b39' : '#555' }}>
                        <input type="radio" name="displayPage" value={opt.val}
                          checked={committeeForm.displayPage === opt.val}
                          onChange={e => setCommitteeForm({ ...committeeForm, displayPage: e.target.value })} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  {language === 'en' ? 'Photo (optional):' : 'फोटो (वैकल्पिक):'}
                </label>
                <input type="file" accept="image/*" onChange={e => setCommitteeForm({ ...committeeForm, photo: e.target.files[0] })} />
                {committeeForm.photo && <p style={{ marginTop: '5px', color: '#28a745', fontSize: '14px' }}>✓ {committeeForm.photo.name}</p>}
              </div>
              <button type="submit" disabled={committeeSubmitting} style={{ opacity: committeeSubmitting ? 0.75 : 1, cursor: committeeSubmitting ? 'not-allowed' : 'pointer' }}>
                {committeeSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="admin-spinner" />
                    {language === 'en' ? 'Adding...' : 'जोड़ा जा रहा है...'}
                  </span>
                ) : (language === 'en' ? '➕ Add Member' : '➕ सदस्य जोड़ें')}
              </button>
              {committeeStatus && (
                <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', background: committeeStatus.type === 'success' ? '#d4edda' : '#f8d7da', color: committeeStatus.type === 'success' ? '#155724' : '#721c24', border: `1px solid ${committeeStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}` }}>
                  {committeeStatus.msg}
                </div>
              )}
            </form>
          </div>

          {/* Members List for selected sub-tab */}
          <div className="gallery-list">
            {(() => {
              const tabMembers = committeeMembersData.filter(m => m.committee === committeeSubTab);
              const sorted = [...tabMembers].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
              const tabColor = committeeSubTab === 'sanrakshak' ? '#5678c9' : committeeSubTab === 'prabandhan' ? '#e07b39' : '#28a745';
              return (
                <>
                  <h2 style={{ color: tabColor }}>
                    {language === 'en'
                      ? `${committeeSubTab === 'sanrakshak' ? 'Sanrakshak' : committeeSubTab === 'prabandhan' ? 'Prabandhan' : 'Sanchalan'} Committee Members (${sorted.length})`
                      : `${committeeSubTab === 'sanrakshak' ? 'संरक्षक' : committeeSubTab === 'prabandhan' ? 'प्रबन्धन' : 'संचालक'} कमेटी सदस्य (${sorted.length})`}
                  </h2>
                  {/* Committee search bar */}
                  {sorted.length > 0 && (
                    <input
                      type="text"
                      placeholder={language === 'en' ? '🔍 Search members...' : '🔍 सदस्य खोजें...'}
                      value={committeeSearch}
                      onChange={e => setCommitteeSearch(e.target.value)}
                      style={{ width: '100%', padding: '9px 14px', borderRadius: '8px', border: `1.5px solid ${tabColor}44`, marginBottom: '14px', fontSize: '14px', boxSizing: 'border-box', background: '#f8f8ff' }}
                    />
                  )}
                  {sorted.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px', background: '#f8f9ff', borderRadius: '12px', border: '1.5px dashed #c5cae9' }}>
                      <p style={{ color: '#888', marginBottom: '14px' }}>{language === 'en' ? 'No members in database yet.' : 'डेटाबेस में अभी तक कोई सदस्य नहीं है।'}</p>
                      <button
                        onClick={() => handleSeedCommitteeMembers(committeeSubTab)}
                        style={{ background: tabColor, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                      >
                        📥 {language === 'en' ? 'Load Existing Members' : 'मौजूदा सदस्य लोड करें'}
                      </button>
                    </div>
                  ) : (
                    <div className="gallery-grid">
                      {sorted
                        .filter(m => !committeeSearch || m.fullName.toLowerCase().includes(committeeSearch.toLowerCase()) || (m.designation && m.designation.toLowerCase().includes(committeeSearch.toLowerCase())) || (m.city && m.city.toLowerCase().includes(committeeSearch.toLowerCase())))
                        .map((member, idx, filteredArr) => (
                        <div key={member._id} className="gallery-card">
                          {member.photoPath
                            ? <img src={member.photoPath} alt={member.fullName} style={{ objectFit: 'cover' }} />
                            : <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: '#f0f4ff' }}>👤</div>
                          }
                          <div className="gallery-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                              <span style={{ background: tabColor, color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px', flexShrink: 0 }}>{sorted.indexOf(member) + 1}</span>
                              <button onClick={() => reorderItems(sorted, sorted.indexOf(member), 'up', 'committee-members-reorder', fetchCommitteeMembersData)} disabled={sorted.indexOf(member) === 0} style={{ padding: '2px 7px', opacity: sorted.indexOf(member) === 0 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↑</button>
                              <button onClick={() => reorderItems(sorted, sorted.indexOf(member), 'down', 'committee-members-reorder', fetchCommitteeMembersData)} disabled={sorted.indexOf(member) === sorted.length - 1} style={{ padding: '2px 7px', opacity: sorted.indexOf(member) === sorted.length - 1 ? 0.35 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}>↓</button>
                            </div>
                            <h3>{member.fullName}</h3>
                            {member.designation && <p style={{ fontWeight: 700, color: tabColor, fontSize: '0.9rem' }}>{member.designation}</p>}
                            {member.position && <p style={{ fontStyle: 'italic', color: '#888', fontSize: '13px' }}>📍 {member.position}</p>}
                            {(member.city || member.state) && <p>📍 {[member.city, member.state].filter(Boolean).join(', ')}</p>}
                            {member.committee === 'prabandhan' && member.displayPage && (
                              <p style={{ fontSize: '11px' }}>
                                <span style={{ background: '#fff3e0', color: '#e07b39', borderRadius: '4px', padding: '2px 6px', fontWeight: '600' }}>
                                  {member.displayPage === 'about' ? (language === 'en' ? 'About Page' : 'About पेज') : member.displayPage === 'home' ? (language === 'en' ? 'Home Page' : 'Home पेज') : (language === 'en' ? 'Both Pages' : 'दोनों पेज')}
                                </span>
                              </p>
                            )}
                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                              <button onClick={() => setEditingCommittee({ ...member, newPhoto: null })} className="view-btn-inline" style={{ fontSize: '12px', padding: '4px 10px' }}>
                                ✏️ {language === 'en' ? 'Edit' : 'संपादित'}
                              </button>
                              <button onClick={() => handleDeleteCommitteeMemberAdm(member._id)} className="delete-btn" style={{ fontSize: '12px', padding: '5px 12px' }}>
                                {language === 'en' ? 'Delete' : 'हटाएं'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ===== HERITAGE TAB ===== */}
      {activeTab === 'heritage' && (
        <div className="admin-section">
          <h1>🏛️ {language === 'en' ? 'Heritage Posts — हमारे ऐतिहासिक धरोहर' : 'हमारे ऐतिहासिक धरोहर'}</h1>
          <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
            {language === 'en'
              ? 'Manage all heritage entries. First initialize the 10 built-in sites into the database (one-time), then you can edit or delete any entry.'
              : 'सभी धरोहर प्रविष्टियाँ प्रबंधित करें। पहले "10 मूल स्थल जोड़ें" बटन दबाएं (एक बार), फिर किसी भी प्रविष्टि को संपादित या हटाया जा सकता है।'}
          </p>

          <div className="gallery-upload-section">
            <h2>➕ {language === 'en' ? 'Add New Heritage Post' : 'नया धरोहर पोस्ट जोड़ें'}</h2>
            <form onSubmit={handleAddHeritage} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="शीर्षक (हिंदी) *" value={heritageForm.titleHi}
                onChange={e => setHeritageForm({ ...heritageForm, titleHi: e.target.value })} required />
              <input type="text" placeholder="Title (English)" value={heritageForm.titleEn}
                onChange={e => setHeritageForm({ ...heritageForm, titleEn: e.target.value })} />
              <textarea placeholder="विवरण (हिंदी) *" value={heritageForm.descriptionHi} rows={4}
                onChange={e => setHeritageForm({ ...heritageForm, descriptionHi: e.target.value })} required
                style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', resize: 'vertical' }} />
              <textarea placeholder="Description (English)" value={heritageForm.descriptionEn} rows={3}
                onChange={e => setHeritageForm({ ...heritageForm, descriptionEn: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', resize: 'vertical' }} />
              <input type="text" placeholder={language === 'en' ? 'Image Caption (optional)' : 'फोटो कैप्शन (वैकल्पिक)'}
                value={heritageForm.imageCaption} onChange={e => setHeritageForm({ ...heritageForm, imageCaption: e.target.value })} />
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  {language === 'en' ? 'Photo (optional):' : 'फोटो (वैकल्पिक):'}
                </label>
                <input type="file" accept="image/*" onChange={e => setHeritageForm({ ...heritageForm, photo: e.target.files[0] })} />
                {heritageForm.photo && <p style={{ marginTop: '5px', color: '#28a745', fontSize: '14px' }}>✓ {heritageForm.photo.name}</p>}
              </div>
              <button type="submit" disabled={heritageSubmitting} style={{ opacity: heritageSubmitting ? 0.75 : 1 }}>
                {heritageSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="admin-spinner" />
                    {language === 'en' ? 'Adding...' : 'जोड़ा जा रहा है...'}
                  </span>
                ) : (language === 'en' ? '🏛️ Add Heritage Post' : '🏛️ धरोहर पोस्ट जोड़ें')}
              </button>
              {heritageStatus && (
                <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '14px',
                  background: heritageStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: heritageStatus.type === 'success' ? '#155724' : '#721c24',
                  border: `1px solid ${heritageStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}` }}>
                  {heritageStatus.msg}
                </div>
              )}
            </form>
          </div>

          <div className="gallery-list" style={{ marginTop: '30px' }}>
            {(() => {
              const builtInCount = heritageData.filter(p => p.isBuiltIn).length;
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <h2 style={{ margin: 0 }}>🏛️ {language === 'en' ? `All Heritage Entries (${heritageData.length})` : `सभी धरोहर प्रविष्टियाँ (${heritageData.length})`}</h2>
                    {builtInCount === 0 && (
                      <button onClick={handleSeedStaticHeritage}
                        style={{ background: '#8b4513', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                        🌱 {language === 'en' ? 'Initialize 10 Built-in Sites' : '10 मूल स्थल जोड़ें (एक बार)'}
                      </button>
                    )}
                  </div>
                  {builtInCount === 0 && (
                    <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px' }}>
                      {language === 'en'
                        ? 'Click the button above to load the 10 built-in heritage sites into the database so you can edit them.'
                        : 'ऊपर बटन दबाएं ताकि 10 मूल धरोहर स्थल डेटाबेस में आ जाएं और आप उन्हें संपादित कर सकें।'}
                    </p>
                  )}
                  {heritageData.length === 0 ? (
                    <p style={{ color: '#888' }}>{language === 'en' ? 'No heritage posts yet.' : 'अभी कोई धरोहर प्रविष्टि नहीं।'}</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[...heritageData].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((post, idx, arr) => (
                        <div key={post._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', background: post.isBuiltIn ? '#fdf9f3' : '#fafafa', border: `1.5px solid ${post.isBuiltIn ? '#d4b896' : '#e0e0e0'}`, borderRadius: '12px', padding: '14px 16px' }}>
                          {/* Sequence + reorder */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '36px' }}>
                            <span style={{ background: '#8b4513', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>{idx + 1}</span>
                            <button onClick={() => reorderItems(arr, idx, 'up', 'heritage-posts-reorder', fetchHeritageData)} disabled={idx === 0} style={{ padding: '2px 7px', opacity: idx === 0 ? 0.3 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                            <button onClick={() => reorderItems(arr, idx, 'down', 'heritage-posts-reorder', fetchHeritageData)} disabled={idx === arr.length - 1} style={{ padding: '2px 7px', opacity: idx === arr.length - 1 ? 0.3 : 1, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: idx === arr.length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                          </div>
                          {/* Photo */}
                          {post.imagePath
                            ? <img src={post.imagePath} alt={post.titleHi} style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                            : <div style={{ width: '80px', height: '60px', borderRadius: '8px', background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>🏛️</div>
                          }
                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: '700', fontSize: '15px', color: '#222' }}>{post.titleHi}</span>
                              {post.isBuiltIn && <span style={{ background: '#f5ede0', color: '#8b4513', border: '1px solid #d4b896', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: '600' }}>📌 Built-in</span>}
                            </div>
                            {post.titleEn && <div style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>{post.titleEn}</div>}
                            <div style={{ fontSize: '13px', color: '#555', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>{post.descriptionHi}</div>
                            {post.imageCaption && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>📷 {post.imageCaption}</div>}
                          </div>
                          {/* Actions */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                            <button onClick={() => { setEditingHeritage(post); setEditHeritageForm({ titleHi: post.titleHi, titleEn: post.titleEn || '', descriptionHi: post.descriptionHi, descriptionEn: post.descriptionEn || '', imageCaption: post.imageCaption || '', newPhoto: null }); }}
                              className="view-btn-inline" style={{ fontSize: '12px', padding: '5px 12px' }}>✏️ {language === 'en' ? 'Edit' : 'संपादित'}</button>
                            <button onClick={() => handleDeleteHeritage(post._id)} className="delete-btn" style={{ fontSize: '12px', padding: '5px 12px' }}>
                              {language === 'en' ? 'Delete' : 'हटाएं'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ===== EDIT MODALS ===== */}


      {/* Edit Gallery Modal */}
      {editingGallery && (
        <div className="modal-overlay" onClick={() => setEditingGallery(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setEditingGallery(null)}>×</button>
            <h2>✏️ {language === 'en' ? 'Edit Photo' : 'फोटो संपादित करें'}</h2>
            <form onSubmit={handleUpdateGallery} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder={language === 'en' ? 'Title *' : 'शीर्षक *'} value={editGalleryForm.title || ''}
                onChange={e => setEditGalleryForm({ ...editGalleryForm, title: e.target.value })} required style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }} />
              <textarea placeholder={language === 'en' ? 'Description' : 'विवरण'} value={editGalleryForm.description || ''}
                onChange={e => setEditGalleryForm({ ...editGalleryForm, description: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd', minHeight: '80px' }} />
              <select value={editGalleryForm.category || 'general'} onChange={e => setEditGalleryForm({ ...editGalleryForm, category: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }}>
                <option value="general">{language === 'en' ? 'General' : 'सामान्य'}</option>
                <option value="events">{language === 'en' ? 'Events' : 'कार्यक्रम'}</option>
                <option value="community">{language === 'en' ? 'Community' : 'समुदाय'}</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="approve-btn" style={{ flex: 1 }}>{language === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें'}</button>
                <button type="button" onClick={() => setEditingGallery(null)} className="delete-btn" style={{ flex: 1 }}>{language === 'en' ? 'Cancel' : 'रद्द करें'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Donor Modal */}
      {editingDonor && (
        <div className="modal-overlay" onClick={() => setEditingDonor(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setEditingDonor(null)}>×</button>
            <h2>✏️ {language === 'en' ? 'Edit Donor' : 'सहयोगी संपादित करें'}</h2>
            <form onSubmit={handleUpdateDonor} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['fullName', language === 'en' ? 'Full Name *' : 'पूरा नाम *', 'text', true],
                ['city', language === 'en' ? 'City' : 'शहर', 'text', false],
                ['state', language === 'en' ? 'State' : 'राज्य', 'text', false],
                ['donationAmount', language === 'en' ? 'Donation Amount (₹)' : 'दान राशि (₹)', 'number', false],
                ['donationPurpose', language === 'en' ? 'Donation Purpose' : 'दान का उद्देश्य', 'text', false],
              ].map(([field, ph, type, req]) => (
                <input key={field} type={type} placeholder={ph} required={req} value={editDonorForm[field] || ''}
                  onChange={e => setEditDonorForm({ ...editDonorForm, [field]: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }} />
              ))}
              <textarea placeholder={language === 'en' ? 'Message' : 'संदेश'} value={editDonorForm.message || ''}
                onChange={e => setEditDonorForm({ ...editDonorForm, message: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd', minHeight: '70px' }} />
              <div>
                <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>{language === 'en' ? 'Replace Photo (optional):' : 'फोटो बदलें (वैकल्पिक):'}</label>
                <input type="file" accept="image/*" onChange={e => setEditDonorForm({ ...editDonorForm, newPhoto: e.target.files[0] })} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="approve-btn" style={{ flex: 1 }}>{language === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें'}</button>
                <button type="button" onClick={() => setEditingDonor(null)} className="delete-btn" style={{ flex: 1 }}>{language === 'en' ? 'Cancel' : 'रद्द करें'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Community Member Modal */}
      {editingCommunity && (
        <div className="modal-overlay" onClick={() => setEditingCommunity(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setEditingCommunity(null)}>×</button>
            <h2>✏️ {language === 'en' ? 'Edit Member' : 'सदस्य संपादित करें'}</h2>
            <form onSubmit={handleUpdateCommunityMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['fullName', language === 'en' ? 'Full Name *' : 'पूरा नाम *', true],
                ['designation', language === 'en' ? 'Designation' : 'पदनाम', false],
                ['occupation', language === 'en' ? 'Occupation' : 'व्यवसाय', false],
                ['city', language === 'en' ? 'City' : 'शहर', false],
                ['state', language === 'en' ? 'State' : 'राज्य', false],
              ].map(([field, ph, req]) => (
                <input key={field} type="text" placeholder={ph} required={req} value={editCommunityForm[field] || ''}
                  onChange={e => setEditCommunityForm({ ...editCommunityForm, [field]: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }} />
              ))}
              {['bio', 'awards', 'publications'].map(field => (
                <textarea key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={editCommunityForm[field] || ''}
                  onChange={e => setEditCommunityForm({ ...editCommunityForm, [field]: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd', minHeight: '70px' }} />
              ))}
              {editingCommunity.honoraryTitle && (
                <select value={editCommunityForm.honoraryTitle || ''} onChange={e => setEditCommunityForm({ ...editCommunityForm, honoraryTitle: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }}>
                  <option value="">-- {language === 'en' ? 'Select Honorary Title' : 'उपाधि चुनें'} --</option>
                  {['मौनस शिरोमणि', 'मौनस कुबेर', 'मौनस रत्न', 'मौनस कुलभूषण', 'मौनस कुलदीपक', 'मौनस नायक'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
              {editingCommunity.prakosth && (
                <select value={editCommunityForm.prakosth || ''} onChange={e => setEditCommunityForm({ ...editCommunityForm, prakosth: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }}>
                  <option value="">-- {language === 'en' ? 'Select Prakosht' : 'प्रकोष्ठ चुनें'} --</option>
                  {[['buddhijivi','बुद्धिजीवी प्रकोष्ठ'],['manav-seva','मानव सेवा प्रकोष्ठ'],['chikitsa','चिकित्सा प्रकोष्ठ'],['vidhi','विधि प्रकोष्ठ'],['vyapar','व्यापार प्रकोष्ठ'],['kisaan','किसान प्रकोष्ठ'],['khel','खेल एवं सैनिक प्रकोष्ठ'],['yuva','युवा प्रकोष्ठ'],['mahila','महिला प्रकोष्ठ'],['veerangana','वीरांगना प्रकोष्ठ']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              )}
              <div>
                <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>{language === 'en' ? 'Replace Photo (optional):' : 'फोटो बदलें (वैकल्पिक):'}</label>
                <input type="file" accept="image/*" onChange={e => setEditCommunityForm({ ...editCommunityForm, newPhoto: e.target.files[0] })} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="approve-btn" style={{ flex: 1 }}>{language === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें'}</button>
                <button type="button" onClick={() => setEditingCommunity(null)} className="delete-btn" style={{ flex: 1 }}>{language === 'en' ? 'Cancel' : 'रद्द करें'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Committee Member Modal */}
      {editingCommittee && (
        <div className="modal-overlay" onClick={() => setEditingCommittee(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setEditingCommittee(null)}>×</button>
            <h2>✏️ {language === 'en' ? 'Edit Committee Member' : 'कमेटी सदस्य संपादित करें'}</h2>
            <form onSubmit={handleUpdateCommitteeMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['fullName', language === 'en' ? 'Full Name *' : 'पूरा नाम *', true],
                ['designation', language === 'en' ? 'Designation / Role' : 'पद / भूमिका', false],
                ['position', language === 'en' ? 'Location / Village / Town' : 'स्थान / गाँव / नगर', false],
                ['city', language === 'en' ? 'City' : 'शहर', false],
                ['state', language === 'en' ? 'State' : 'राज्य', false],
              ].map(([field, ph, req]) => (
                <input key={field} type="text" placeholder={ph} required={req} value={editingCommittee[field] || ''}
                  onChange={e => setEditingCommittee({ ...editingCommittee, [field]: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }} />
              ))}
              {editingCommittee.committee === 'prabandhan' && (
                <div style={{ background: '#fff8f0', border: '1.5px solid #ffe0b2', borderRadius: '10px', padding: '14px' }}>
                  <label style={{ fontWeight: '700', fontSize: '14px', color: '#e07b39', display: 'block', marginBottom: '10px' }}>
                    📍 {language === 'en' ? 'Display on:' : 'कहाँ दिखाएं:'}
                  </label>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {[['about', language === 'en' ? 'About Page' : 'About पेज'], ['home', language === 'en' ? 'Home Page' : 'Home पेज'], ['both', language === 'en' ? 'Both Pages' : 'दोनों पेज']].map(([val, lbl]) => (
                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: editingCommittee.displayPage === val ? '700' : '400', color: editingCommittee.displayPage === val ? '#e07b39' : '#555' }}>
                        <input type="radio" name="editDisplayPage" value={val} checked={editingCommittee.displayPage === val} onChange={e => setEditingCommittee({ ...editingCommittee, displayPage: e.target.value })} />
                        {lbl}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>{language === 'en' ? 'Replace Photo (optional):' : 'फोटो बदलें (वैकल्पिक):'}</label>
                <input type="file" accept="image/*" onChange={e => setEditingCommittee({ ...editingCommittee, newPhoto: e.target.files[0] })} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="approve-btn" style={{ flex: 1 }}>{language === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें'}</button>
                <button type="button" onClick={() => setEditingCommittee(null)} className="delete-btn" style={{ flex: 1 }}>{language === 'en' ? 'Cancel' : 'रद्द करें'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Heritage Modal */}
      {editingHeritage && (
        <div className="modal-overlay" onClick={() => setEditingHeritage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <button className="modal-close" onClick={() => setEditingHeritage(null)}>×</button>
            <h2>✏️ {language === 'en' ? 'Edit Heritage Post' : 'धरोहर पोस्ट संपादित करें'}</h2>
            <form onSubmit={handleUpdateHeritage} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="शीर्षक (हिंदी) *" value={editHeritageForm.titleHi || ''}
                onChange={e => setEditHeritageForm({ ...editHeritageForm, titleHi: e.target.value })} required
                style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }} />
              <input type="text" placeholder="Title (English)" value={editHeritageForm.titleEn || ''}
                onChange={e => setEditHeritageForm({ ...editHeritageForm, titleEn: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }} />
              <textarea placeholder="विवरण (हिंदी) *" value={editHeritageForm.descriptionHi || ''} rows={4}
                onChange={e => setEditHeritageForm({ ...editHeritageForm, descriptionHi: e.target.value })} required
                style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', resize: 'vertical' }} />
              <textarea placeholder="Description (English)" value={editHeritageForm.descriptionEn || ''} rows={3}
                onChange={e => setEditHeritageForm({ ...editHeritageForm, descriptionEn: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', resize: 'vertical' }} />
              <input type="text" placeholder={language === 'en' ? 'Image Caption' : 'फोटो कैप्शन'}
                value={editHeritageForm.imageCaption || ''} onChange={e => setEditHeritageForm({ ...editHeritageForm, imageCaption: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #ddd' }} />
              {editingHeritage.imagePath && (
                <img src={editingHeritage.imagePath} alt="current" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px' }} />
              )}
              <div>
                <label style={{ fontWeight: '600', fontSize: '13px' }}>{language === 'en' ? 'Replace Photo (optional):' : 'फोटो बदलें (वैकल्पिक):'}</label>
                <input type="file" accept="image/*" onChange={e => setEditHeritageForm({ ...editHeritageForm, newPhoto: e.target.files[0] })} style={{ marginTop: '5px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="approve-btn" style={{ flex: 1 }}>{language === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें'}</button>
                <button type="button" onClick={() => setEditingHeritage(null)} className="delete-btn" style={{ flex: 1 }}>{language === 'en' ? 'Cancel' : 'रद्द करें'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Membership Certificate Overlay */}
      {showCertificate && certificateUser && (
        <MembershipCertificate
          user={certificateUser}
          onClose={() => { setShowCertificate(false); setCertificateUser(null); }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
