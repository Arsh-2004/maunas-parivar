export const translations = {
  en: {
    // Header & Navigation
    header: {
      home: 'Home',
      about: 'About Us',
      community: 'Community',
      events: 'Events',
      gallery: 'Gallery',
      contact: 'Contact',
      joinUs: 'Join Us',
    },
    // Community Page
    community: {
      title: 'Our Community',
      subtitle: 'United in Heritage | Strong Together',
      managementTeam: 'Management Team',
      memberDirectory: 'Member Directory',
      stats: {
        members: 'Active Members',
        cities: 'Cities Connected',
        events: 'Events Organized',
        scholarships: 'Scholarships Awarded',
      },
    },
    // Events Page
    events: {
      title: 'Events & Activities',
      subtitle: 'Bringing Our Community Together',
      upcomingEvents: 'Upcoming Events',
      pastEvents: 'Past Events',
      stayUpdated: 'Stay Updated',
      subscribeText: 'Subscribe to our newsletter to receive updates about upcoming events and activities',
      registerBtn: 'Register Now',
      subscribeBtn: 'Subscribe',
      whatWeOrganize: 'What We Organize',
    },
    // Gallery Page
    gallery: {
      title: 'Photo Gallery',
      subtitle: 'Moments That Define Us',
      ourMemories: 'Our Memories',
    },
    // Contact Page
    contact: {
      title: 'Contact Us',
      subtitle: "We'd Love to Hear From You",
      sendMessage: 'Send Us a Message',
      fullName: 'Full Name *',
      email: 'Email Address *',
      phone: 'Phone Number',
      subject: 'Subject *',
      message: 'Message *',
      sendBtn: 'Send Message',
      getInTouch: 'Get In Touch',
      address: 'Address',
      officeHours: 'Office Hours',
      connectUs: 'Connect With Us',
    },
    // Membership Page
    membership: {
      title: 'Membership Registration',
      subtitle: 'Join Our Growing Family',
      benefits: 'Membership Benefits',
      registrationForm: 'Registration Form',
      formDescription: 'Please fill out all the required fields to complete your registration',
      fullName: 'Full Name *',
      fatherName: "Father's Name *",
      dateOfBirth: 'Date of Birth *',
      gender: 'Gender *',
      email: 'Email Address *',
      phone: 'Phone Number *',
      address: 'Address *',
      city: 'City *',
      state: 'State *',
      pincode: 'Pincode *',
      occupation: 'Occupation *',
      education: 'Educational Qualification *',
      submitBtn: 'Submit Application',
    },
  },
  hi: {
    // Header & Navigation
    header: {
      home: 'होम',
      about: 'हमारे बारे में',
      community: 'समुदाय',
      events: 'घटनाएं',
      gallery: 'गैलरी',
      contact: 'संपर्क करें',
      joinUs: 'हमसे जुड़ें',
    },
    // Community Page
    community: {
      title: 'हमारा समुदाय',
      subtitle: 'विरासत में एकता | एक साथ मजबूत',
      managementTeam: 'प्रबंधन दल',
      memberDirectory: 'सदस्य निर्देशिका',
      stats: {
        members: 'सक्रिय सदस्य',
        cities: 'शहर जुड़े हुए',
        events: 'आयोजित कार्यक्रम',
        scholarships: 'छात्रवृत्ति दी गई',
      },
    },
    // Events Page
    events: {
      title: 'घटनाएं और गतिविधियां',
      subtitle: 'हमारे समुदाय को एक साथ लाना',
      upcomingEvents: 'आने वाली घटनाएं',
      pastEvents: 'पिछली घटनाएं',
      stayUpdated: 'अपडेट रहें',
      subscribeText: 'आने वाली घटनाओं और गतिविधियों के बारे में अपडेट प्राप्त करने के लिए हमारे न्यूजलेटर की सदस्यता लें',
      registerBtn: 'अभी पंजीकरण करें',
      subscribeBtn: 'सदस्यता लें',
      whatWeOrganize: 'हम क्या आयोजित करते हैं',
    },
    // Gallery Page
    gallery: {
      title: 'फोटो गैलरी',
      subtitle: 'हमें परिभाषित करने वाले पल',
      ourMemories: 'हमारी यादें',
    },
    // Contact Page
    contact: {
      title: 'हमसे संपर्क करें',
      subtitle: 'हम आपसे सुनना चाहेंगे',
      sendMessage: 'हमें एक संदेश भेजें',
      fullName: 'पूरा नाम *',
      email: 'ईमेल पता *',
      phone: 'फोन नंबर',
      subject: 'विषय *',
      message: 'संदेश *',
      sendBtn: 'संदेश भेजें',
      getInTouch: 'हमसे जुड़ें',
      address: 'पता',
      officeHours: 'कार्यालय के समय',
      connectUs: 'हमसे जुड़ें',
    },
    // Membership Page
    membership: {
      title: 'सदस्यता पंजीकरण',
      subtitle: 'हमारे बढ़ते परिवार से जुड़ें',
      benefits: 'सदस्यता लाभ',
      registrationForm: 'पंजीकरण फॉर्म',
      formDescription: 'अपना पंजीकरण पूरा करने के लिए कृपया सभी आवश्यक क्षेत्रों को भरें',
      fullName: 'पूरा नाम *',
      fatherName: 'पिता का नाम *',
      dateOfBirth: 'जन्मतिथि *',
      gender: 'लिंग *',
      email: 'ईमेल पता *',
      phone: 'फोन नंबर *',
      address: 'पता *',
      city: 'शहर *',
      state: 'राज्य *',
      pincode: 'पिन कोड *',
      occupation: 'व्यवसाय *',
      education: 'शैक्षणिक योग्यता *',
      submitBtn: 'आवेदन जमा करें',
    },
  },
};

export const getTranslation = (language, path) => {
  const keys = path.split('.');
  let value = translations[language] || translations.en;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value || path;
};
