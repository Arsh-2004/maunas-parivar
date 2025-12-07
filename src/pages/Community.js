import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Community.css';

const Community = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  const managementTeam = [
    { name: language === 'en' ? 'Rajendra Singh' : 'राजेंद्र सिंह', position: language === 'en' ? 'National President' : 'राष्ट्रीय अध्यक्ष', icon: '👤' },
    { name: language === 'en' ? 'Mahendra Singh' : 'महेंद्र सिंह', position: language === 'en' ? 'National Vice President' : 'राष्ट्रीय उपाध्यक्ष', icon: '👤' },
    { name: language === 'en' ? 'Vikram Singh' : 'विक्रम सिंह', position: language === 'en' ? 'General Secretary' : 'महासचिव', icon: '👤' },
    { name: language === 'en' ? 'Pradeep Singh' : 'प्रदीप सिंह', position: language === 'en' ? 'National Treasurer' : 'राष्ट्रीय कोषाध्यक्ष', icon: '👤' },
    { name: language === 'en' ? 'Suresh Kumar' : 'सुरेश कुमार', position: language === 'en' ? 'Cultural Secretary' : 'सांस्कृतिक सचिव', icon: '👤' },
    { name: language === 'en' ? 'Amit Singh' : 'अमित सिंह', position: language === 'en' ? 'Youth Wing President' : 'युवा विंग अध्यक्ष', icon: '👤' },
  ];

  const members = [
    { name: language === 'en' ? 'Ramesh Singh' : 'रमेश सिंह', location: language === 'en' ? 'Jaipur' : 'जयपुर', memberSince: '2023', icon: '👤' },
    { name: language === 'en' ? 'Sunil Kumar' : 'सुनील कुमार', location: language === 'en' ? 'Ajmer' : 'अजमेर', memberSince: '2023', icon: '👤' },
    { name: language === 'en' ? 'Prakash Singh' : 'प्रकाश सिंह', location: language === 'en' ? 'Jodhpur' : 'जोधपुर', memberSince: '2024', icon: '👤' },
    { name: language === 'en' ? 'Dinesh Sharma' : 'दिनेश शर्मा', location: language === 'en' ? 'Udaipur' : 'उदयपुर', memberSince: '2024', icon: '👤' },
    { name: language === 'en' ? 'Rajesh Kumar' : 'राजेश कुमार', location: language === 'en' ? 'Kota' : 'कोटा', memberSince: '2023', icon: '👤' },
    { name: language === 'en' ? 'Anil Singh' : 'अनिल सिंह', location: language === 'en' ? 'Bikaner' : 'बीकानेर', memberSince: '2024', icon: '👤' },
    { name: language === 'en' ? 'Mohan Singh' : 'मोहन सिंह', location: language === 'en' ? 'Alwar' : 'अलवर', memberSince: '2023', icon: '👤' },
    { name: language === 'en' ? 'Vijay Kumar' : 'विजय कुमार', location: language === 'en' ? 'Sikar' : 'सीकर', memberSince: '2024', icon: '👤' },
  ];

  const stats = [
    { label: t('community.stats.members'), value: '5000+' },
    { label: t('community.stats.cities'), value: '15+' },
    { label: t('community.stats.events'), value: '100+' },
    { label: t('community.stats.scholarships'), value: '500+' },
  ];

  return (
    <div className="community-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{t('community.title')}</h1>
          <p>{t('community.subtitle')}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map(stat => (
              <div key={stat.label} className="stat-card">
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="management-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('community.managementTeam')}</h2>
            <div className="underline"></div>
          </div>
          <div className="team-grid">
            {managementTeam.map((member, index) => (
              <div key={index} className="team-member-card">
                <div className="member-image">
                  <div className="image-placeholder">{member.icon}</div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-position">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Members Directory */}
      <section className="members-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('community.memberDirectory')}</h2>
            <div className="underline"></div>
          </div>
          <div className="members-grid">
            {members.map((member, index) => (
              <div key={index} className="member-card">
                <div className="member-avatar">{member.icon}</div>
                <h3>{member.name}</h3>
                <p className="city">📍 {member.location}</p>
                <p className="since">{language === 'en' ? 'Member Since' : 'सदस्य बने'}: {member.memberSince}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
