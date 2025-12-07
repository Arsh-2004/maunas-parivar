import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
  const { language } = useLanguage();

  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{language === 'en' ? 'About Kshatriya Maunas Parivar' : 'क्षत्रिय मौनास परिवार के बारे में'}</h1>
          <p>{language === 'en' ? 'Preserve Heritage | Empower Community' : 'विरासत को संरक्षित करें | समुदाय को सशक्त करें'}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h2>{language === 'en' ? 'Our Mission' : 'हमारा लक्ष्य'}</h2>
              <p>
                {language === 'en'
                  ? 'To unite and empower the Kshatriya Maunas community, preserve our rich cultural heritage, promote social welfare, and provide opportunities for educational and economic advancement.'
                  : 'क्षत्रिय मौनास समुदाय को संयुक्त और सशक्त करना, हमारी समृद्ध सांस्कृतिक विरासत को संरक्षित करना, सामाजिक कल्याण को बढ़ावा देना, और शैक्षणिक एवं आर्थिक उन्नति के लिए अवसर प्रदान करना।'}
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">👁️</div>
              <h2>{language === 'en' ? 'Our Vision' : 'हमारा दृष्टिकोण'}</h2>
              <p>
                {language === 'en'
                  ? 'To build a progressive Kshatriya Maunas community that honors its glorious past and embraces modern development, ensuring growth opportunities for every member.'
                  : 'एक प्रगतिशील क्षत्रिय मौनास समुदाय बनाना जो अपने गौरवशाली अतीत को सम्मानित करता है और आधुनिक विकास को अपनाता है, हर सदस्य के लिए विकास के अवसर सुनिश्चित करता है।'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="history-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Heritage' : 'हमारी विरासत'}</h2>
            <div className="underline"></div>
          </div>
          <div className="history-content">
            <div className="history-text">
              <h3>{language === 'en' ? 'Maunas Kshatriya Traditions' : 'मौनास क्षत्रियों की परंपरा'}</h3>
              <p>
                {language === 'en'
                  ? 'The Kshatriya Maunas community has a glorious and prestigious history rooted in centuries-old traditions. Known for valor, administrative skills, and dedication to protecting righteousness, Maunas Kshatriyas have played significant roles in various kingdoms and regions throughout Indian history.'
                  : 'क्षत्रिय मौनास समुदाय का एक गौरवशाली और प्रतिष्ठित इतिहास है जो सदियों पुरानी परंपराओं में निहित है। वीरता, प्रशासनिक कौशल और धर्म की रक्षा के लिए समर्पण के लिए जाने जाते हैं, मौनास क्षत्रियों ने भारतीय इतिहास में विभिन्न राज्यों और क्षेत्रों में महत्वपूर्ण भूमिका निभाई है।'}
              </p>
              <p>
                {language === 'en'
                  ? 'Our ancestors were renowned warriors, administrators, and protectors of our people. They maintained the highest standards of honor, duty, and service. The Maunas Kshatriya community has made significant contributions to the cultural and social fabric of Rajasthan and beyond.'
                  : 'हमारे पूर्वज प्रसिद्ध योद्धा, प्रशासक और अपने लोगों की रक्षकर्ता थे। उन्होंने सम्मान, कर्तव्य और सेवा के सर्वोच्च मानदंड को बनाए रखा। मौनास क्षत्रिय समुदाय ने राजस्थान और उससे आगे की सांस्कृतिक और सामाजिक संरचना में महत्वपूर्ण योगदान दिया है।'}
              </p>
              <p>
                {language === 'en'
                  ? 'Today, while honoring these traditions, our community has evolved to embrace modern education, business, and various professional fields.'
                  : 'आज, जबकि हम इन परंपराओं को सम्मानित करते हैं, हमारा समुदाय आधुनिक शिक्षा, व्यवसाय और विभिन्न व्यावसायिक क्षेत्रों को अपनाने के लिए विकसित हुआ है।'}
              </p>
            </div>
            <div className="history-image">
              <div className="image-placeholder">
                <span>🏛️</span>
                <p>{language === 'en' ? 'Centuries of Heritage' : 'सदियों की विरासत'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Core Values' : 'हमारे मूल मूल्य'}</h2>
            <div className="underline"></div>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">⚔️</div>
              <h3>{language === 'en' ? 'Courage' : 'साहस'}</h3>
              <p>{language === 'en' ? 'Face challenges and move forward fearlessly' : 'चुनौतियों का सामना करना और निर्भयता से आगे बढ़ना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>{language === 'en' ? 'Unity' : 'एकता'}</h3>
              <p>{language === 'en' ? 'Stand together as a strong community' : 'एक मजबूत समुदाय के रूप में एक साथ खड़े होना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💎</div>
              <h3>{language === 'en' ? 'Integrity' : 'सततता'}</h3>
              <p>{language === 'en' ? 'Maintain honesty and ethical principles' : 'ईमानदारी और नैतिक सिद्धांतों को बनाए रखना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3>{language === 'en' ? 'Progress' : 'प्रगति'}</h3>
              <p>{language === 'en' ? 'Embrace education and modern development' : 'शिक्षा और आधुनिक विकास को अपनाना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🙏</div>
              <h3>{language === 'en' ? 'Tradition' : 'परंपरा'}</h3>
              <p>{language === 'en' ? 'Preserve our cultural heritage and customs' : 'हमारी सांस्कृतिक विरासत और रीति-रिवाजों को संरक्षित करना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>{language === 'en' ? 'Service' : 'सेवा'}</h3>
              <p>{language === 'en' ? 'Serve our community and society' : 'अपने समुदाय और समाज की सेवा करना'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* President Message */}
      <section className="president-message">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? "President's Message" : 'अध्यक्ष का संदेश'}</h2>
            <div className="underline"></div>
          </div>
          <div className="message-content">
            <div className="president-image">
              <div className="image-placeholder">
                <span>👤</span>
              </div>
              <h3>{language === 'en' ? 'President' : 'अध्यक्ष'}</h3>
              <p>{language === 'en' ? 'National President' : 'राष्ट्रीय अध्यक्ष'}</p>
            </div>
            <div className="message-text">
              <p className="quote-mark">"</p>
              <p>
                {language === 'en'
                  ? 'Dear Members and Well-Wishers,'
                  : 'प्रिय सदस्यों और शुभचिंतकों को नमस्कार,'}
              </p>
              <p>
                {language === 'en'
                  ? 'It is with great pride that I speak to you as the President of the Kshatriya Maunas family. Our organization stands as a testament to the enduring spirit of our community, built upon centuries of tradition, valor, and dedication to righteousness.'
                  : 'यह गर्व के साथ कि मैं क्षत्रिय मौनास परिवार के अध्यक्ष के रूप में आपसे बात कर रहा हूं। हमारा संगठन सदियों की परंपरा, वीरता और धर्म के प्रति समर्पण पर बना हमारे समुदाय की स्थायी भावना का प्रमाण है।'}
              </p>
              <p>
                {language === 'en'
                  ? 'In these modern times, while we honor our glorious past, we must also embrace progress and unity. Our mission is to ensure that every member of our community has opportunities for growth, education, and prosperity.'
                  : 'इन आधुनिक समय में, जबकि हम अपने गौरवशाली अतीत को सम्मानित करते हैं, हमें प्रगति और एकता को भी अपनाना चाहिए। हमारा मिशन यह सुनिश्चित करना है कि हमारे समुदाय के हर सदस्य को विकास, शिक्षा और समृद्धि के अवसर मिलें।'}
              </p>
              <p>
                {language === 'en'
                  ? 'I invite each of you to actively participate in our initiatives, programs, and operations. Together, we can strengthen our bonds and lead our community toward a better future.'
                  : 'मैं प्रत्येक आपको हमारी पहलों, कार्यक्रमों और संचालन में सक्रिय रूप से भाग लेने के लिए आमंत्रित करता हूं। हम एक साथ मिलकर अपने बंधनों को मजबूत कर सकते हैं और अपने समुदाय को एक बेहतर भविष्य की ओर ले जा सकते हैं।'}
              </p>
              <p className="signature">
                {language === 'en'
                  ? 'With Best Wishes,<br/><strong>National President</strong>'
                  : 'शुभकामनाओं सहित,<br/><strong>राष्ट्रीय अध्यक्ष</strong>'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Impact' : 'हमारा प्रभाव'}</h2>
            <div className="underline"></div>
          </div>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-number">5000+</div>
              <div className="achievement-label">{language === 'en' ? 'Active Members' : 'सक्रिय सदस्य'}</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">50+</div>
              <div className="achievement-label">{language === 'en' ? 'Events Organized' : 'आयोजित कार्यक्रम'}</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">200+</div>
              <div className="achievement-label">{language === 'en' ? 'Scholarships Provided' : 'छात्रवृत्ति प्रदान की गई'}</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">15+</div>
              <div className="achievement-label">{language === 'en' ? 'Cities Connected' : 'शहर जुड़े हुए'}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
