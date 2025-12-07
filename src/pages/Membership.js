import React, { useState } from 'react';
import './Membership.css';

const Membership = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    education: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for registering! We will review your application and contact you soon.');
    setFormData({
      fullName: '', fatherName: '', dateOfBirth: '', gender: '', email: '',
      phone: '', address: '', city: '', state: '', pincode: '', occupation: '', education: ''
    });
  };

  return (
    <div className="membership-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Membership Registration</h1>
          <p>Join Our Growing Family</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Membership Benefits</h2>
            <div className="underline"></div>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Community Network</h3>
              <p>Connect with thousands of community members across India</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎉</div>
              <h3>Exclusive Events</h3>
              <p>Access to community gatherings, cultural programs, and celebrations</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎓</div>
              <h3>Educational Support</h3>
              <p>Scholarships and educational guidance for students</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💼</div>
              <h3>Career Opportunities</h3>
              <p>Job referrals and business networking opportunities</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏥</div>
              <h3>Welfare Programs</h3>
              <p>Access to community welfare and support programs</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📜</div>
              <h3>Member ID Card</h3>
              <p>Official membership certificate and digital ID card</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="registration-section">
        <div className="container">
          <div className="form-container">
            <h2>Registration Form</h2>
            <p className="form-description">Please fill out all the required fields to complete your registration</p>
            
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fatherName">Father's Name *</label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                    placeholder="Enter father's name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Enter complete address"
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter city"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="Enter state"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="Enter pincode"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="occupation">Occupation *</label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                    placeholder="Enter occupation"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="education">Educational Qualification *</label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                    placeholder="Enter education qualification"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
