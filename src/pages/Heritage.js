import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Heritage.css';

const Heritage = () => {
  const { language } = useLanguage();

  return (
    <div className="heritage-page">
      {/* Hero Section */}
      <section className="heritage-hero">
        <div className="heritage-hero-overlay" />
        <div className="container">
          <h1 className="heritage-hero-title">
            {language === 'en' ? 'Our Historical Heritage' : 'हमारे ऐतिहासिक धरोहर'}
          </h1>
          <p className="heritage-hero-subtitle">
            {language === 'en'
              ? 'Preserving the glorious legacy of the Maunas Kshatriya lineage'
              : 'मौनस क्षत्रिय वंश की गौरवशाली विरासत को संजोए रखना'}
          </p>
          <div className="heritage-hero-divider" />
        </div>
      </section>

      {/* Historic Sites Section */}
      <section className="heritage-sites-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Historic Sites' : 'ऐतिहासिक स्थल'}</h2>
            <div className="underline"></div>
          </div>

          {/* Site 1 — text left, image right */}
          <div className="heritage-about-content">
            <div className="heritage-about-text">
              <h3 className="heritage-site-name-hi">सीता समाहित स्थल (सीतामढ़ी)</h3>
              <h4 className="heritage-site-name-en">Sita Samaahit Sthal (Sitamarhi), Bhadohi</h4>
              <p>
                मौनस वंश के आदिपुरुष एवं भगवान श्रीराम जी के ज्येष्ठ पुत्र श्री कुश जी का जन्मस्थल।
              </p>
              {language === 'en' && (
                <p>
                  The birthplace of Shri Kush Ji, the eldest son of Lord Shri Ram and the progenitor of the Maunas dynasty.
                </p>
              )}
            </div>
            <div className="heritage-about-image">
              <div className="image-placeholder">
                <img
                  src="/assets/सीता समाहित स्थल.jpeg"
                  alt="सीता समाहित स्थल (सीतामढ़ी) Bhadohi"
                />
                <p>
                  {language === 'en'
                    ? 'Sita Samaahit Sthal (Sitamarhi), Bhadohi'
                    : 'सीता समाहित स्थल (सीतामढ़ी), भदोही'}
                </p>
              </div>
            </div>
          </div>

          <div className="heritage-site-divider" />

          {/* Site 2 — image left, text right */}
          <div className="heritage-about-content heritage-about-content--reverse">
            <div className="heritage-about-image">
              <div className="image-placeholder">
                <img
                  src="/assets/सदियों की विरासत.jpeg"
                  alt="नवमठा मंदिर गिर्द बड़गांव भदोही"
                />
                <p>
                  {language === 'en'
                    ? 'Navmatha Mandir, Gird Badgaon, Bhadohi'
                    : 'नवमठा मंदिर, गिर्द बड़गांव, भदोही'}
                </p>
              </div>
            </div>
            <div className="heritage-about-text">
              <h3 className="heritage-site-name-hi">नवमठा मंदिर</h3>
              <h4 className="heritage-site-name-en">Navmatha Mandir, Gird Badgaon, Bhadohi</h4>
              <p>
                गिर्द बड़गांव, भदोही में स्थित नवमठा मंदिर मौनस क्षत्रिय वंश की प्राचीन धार्मिक आस्था एवं गौरवशाली सांस्कृतिक विरासत का प्रतीक है।
              </p>
              {language === 'en' && (
                <p>
                  Located in Gird Badgaon, Bhadohi, Navmatha Mandir is a symbol of the ancient religious faith and glorious cultural heritage of the Maunas Kshatriya lineage.
                </p>
              )}
            </div>
          </div>

          <div className="heritage-site-divider" />

          {/* Site 3 — text only (no image yet) */}
          <div className="heritage-about-text heritage-text-only">
            <h3 className="heritage-site-name-hi">सुरियावां गढ़ (रंग महल)</h3>
            <h4 className="heritage-site-name-en">Suriyawan Garh (Rang Mahal), Suriyawan, Bhadohi</h4>
            <p>
              सुरियावां गढ़ अब रंग महल के नाम से राजस्व विभाग में दर्ज है। यह सुरियावां, भदोही में स्थित है।
            </p>
            {language === 'en' && (
              <p>
                Suriyawan Garh is now recorded in the revenue department under the name Rang Mahal. It is located in Suriyawan, Bhadohi.
              </p>
            )}
          </div>

          <div className="heritage-site-divider" />

          {/* Site 4a — text left, smarak building right */}
          <div className="heritage-about-content">
            <div className="heritage-about-text">
              <h3 className="heritage-site-name-hi">अमर शहीद ठा० झूरी सिंह स्मारक</h3>
              <h4 className="heritage-site-name-en">Amar Shaheed Tha. Jhoori Singh Smarak, Parauppur, Bhadohi</h4>
              <p>
                परऊपुर, भदोही में स्थित यह स्मारक 1857 की क्रांति के महान वीर अमर शहीद ठाकुर झूरी सिंह की अदम्य देशभक्ति एवं बलिदान को समर्पित है।
              </p>
              {language === 'en' && (
                <p>
                  Located in Parauppur, Bhadohi, this memorial is dedicated to the undying patriotism and sacrifice of Amar Shaheed Thakur Jhoori Singh, a great hero of the 1857 revolution.
                </p>
              )}
            </div>
            <div className="heritage-about-image">
              <div className="image-placeholder">
                <img
                  src="/assets/अमर शहीद ठा० झूरी सिंह स्मारक.jpeg"
                  alt="अमर शहीद ठा० झूरी सिंह स्मारक परऊपुर भदोही"
                  style={{ objectPosition: 'center center' }}
                />
                <p>
                  {language === 'en'
                    ? 'Amar Shaheed Tha. Jhoori Singh Smarak, Parauppur, Bhadohi'
                    : 'अमर शहीद ठा० झूरी सिंह स्मारक, परऊपुर, भदोही'}
                </p>
              </div>
            </div>
          </div>

          {/* Site 4b — idol image left, caption right */}
          <div className="heritage-about-content heritage-about-content--reverse heritage-idol-row">
            <div className="heritage-idol-image">
              <div className="image-placeholder">
                <img
                  src="/assets/अमर शहीद ठा० झूरी सिंह.jpeg"
                  alt="अमर शहीद ठा० झूरी सिंह"
                  style={{ objectPosition: 'center top' }}
                />
                <p>
                  {language === 'en'
                    ? 'Amar Shaheed Tha. Jhoori Singh'
                    : 'अमर शहीद ठा० झूरी सिंह'}
                </p>
              </div>
            </div>
            <div className="heritage-about-text">
              <h3 className="heritage-site-name-hi">अमर शहीद ठा० झूरी सिंह</h3>
              <p>
                1857 की महान क्रांति में भदोही जनपद के परऊपुर ग्राम के इस वीर सपूत ने अंग्रेजी हुकूमत के विरुद्ध शस्त्र उठाया और देश की आज़ादी के लिए अपने प्राण न्योछावर कर दिए।
              </p>
              {language === 'en' && (
                <p>
                  This brave son of Parauppur village, Bhadohi district, took up arms against British rule in the great revolution of 1857 and sacrificed his life for the freedom of the nation.
                </p>
              )}
            </div>
          </div>

          <div className="heritage-site-divider" />

          {/* Site 5 — राजा अचल सिंह तालाब */}
          <div className="heritage-about-text heritage-text-only">
            <h3 className="heritage-site-name-hi">महाराजा अचल सिंह का तालाब (52 बीघा)</h3>
            <h4 className="heritage-site-name-en">MahaRaja Achal Singh's Pond (52 Bigha), Suriyawan, Bhadohi</h4>
            <p>
              महाराजा अचल सिंह का 52 बीघा तालाब सुरियावां, भदोही में स्थित है।
            </p>
            {language === 'en' && (
              <p>
                The 52 Bigha pond of MahaRaja Achal Singh is located in Suriyawan, Bhadohi.
              </p>
            )}
          </div>

          <div className="heritage-site-divider" />

          {/* Site 6 — भूल्ली सिंह दीवान तालाब */}
          <div className="heritage-about-text heritage-text-only">
            <h3 className="heritage-site-name-hi">भूल्ली सिंह दीवान तालाब (45 बीघा)</h3>
            <h4 className="heritage-site-name-en">Bhulli Singh Diwan Pond (45 Bigha), Mahuapur (Janakpur), Bhadohi</h4>
            <p>
              भूल्ली सिंह दीवान तालाब 45 बीघा, ग्राम महुआपुर (जनकपुर), भदोही में स्थित है।
            </p>
            {language === 'en' && (
              <p>
                Bhulli Singh Diwan Pond, spanning 45 Bigha, is located in village Mahuapur (Janakpur), Bhadohi.
              </p>
            )}
          </div>

          <div className="heritage-site-divider" />

          {/* Site 7 — राजा जोधराज सिंह तालाब */}
          <div className="heritage-about-content">
            <div className="heritage-about-text">
              <h3 className="heritage-site-name-hi">महाराजा जोधराज सिंह तालाब (48 बीघा)</h3>
              <h4 className="heritage-site-name-en">MahaRaja Jodhraj Singh Pond (48 Bigha)</h4>
              <p>
                महाराजा जोधराज सिंह तालाब 48 बीघा, मौनस क्षत्रिय वंश के गौरवशाली इतिहास की एक अमूल्य धरोहर है।
              </p>
              {language === 'en' && (
                <p>
                  MahaRaja Jodhraj Singh Pond, spanning 48 Bigha, is a priceless heritage of the glorious history of the Maunas Kshatriya lineage.
                </p>
              )}
            </div>
            <div className="heritage-dual-images">
              <div className="image-placeholder">
                <img
                  src="/assets/महाराज जोधराज तालाब.jpeg"
                  alt="राजा जोधराज सिंह तालाब"
                />
                <p>
                  {language === 'en' ? 'Raja Jodhraj Singh Pond' : 'राजा जोधराज सिंह तालाब'}
                </p>
              </div>
              <div className="image-placeholder">
                <img
                  src="/assets/महाराज जोधराज तालाब 2.jpeg"
                  alt="राजा जोधराज सिंह तालाब"
                />
                <p>
                  {language === 'en' ? 'Raja Jodhraj Singh Pond (48 Bigha)' : 'राजा जोधराज सिंह तालाब (48 बीघा)'}
                </p>
              </div>
            </div>
          </div>

          <div className="heritage-site-divider" />

          {/* Site 8 — कुलदेवी माता */}
          <div className="heritage-about-content">
            <div className="heritage-about-text">
              <h3 className="heritage-site-name-hi">कुलदेवी माता दुर्गा मंदिर</h3>
              <h4 className="heritage-site-name-en">Kuldevi Mata Durga Temple, Chakwara (Bhavpur), Bhadohi</h4>
              <p>
                मौनस वंश की कुलदेवी माता दुर्गा जी हैं। इसी कारण चकवाड़ा (भावपुर), भदोही गाँव के व क्षेत्र के मौनस भाइयों ने मिलकर चकवाड़ा में कुलदेवी माता दुर्गा जी का मंदिर बनवाया, जो आज भी विद्यमान है।
              </p>
              {language === 'en' && (
                <p>
                  The family deity of the Maunas clan is Mata Durga. For this reason, the Maunas brothers from Chakwara (Bhavpur), Bhadohi village, and the surrounding area, together built a temple dedicated to their family deity, Mata Durga, in Chakwara, which still exists today.
                </p>
              )}
            </div>
            <div className="heritage-about-image">
              <div className="image-placeholder">
                <img
                  src="/assets/कुलदेवी माता दुर्गा.jpeg"
                  alt="कुलदेवी माता दुर्गा मंदिर चकवाड़ा भदोही"
                />
                <p>
                  {language === 'en'
                    ? 'Kuldevi Mata Durga Temple, Chakwara (Bhavpur), Bhadohi'
                    : 'कुलदेवी माता दुर्गा मंदिर, चकवाड़ा (भावपुर), भदोही'}
                </p>
              </div>
            </div>
          </div>

          <div className="heritage-site-divider" />

          {/* Site 9 — दिघवट कोट */}
          <div className="heritage-about-content heritage-about-content--reverse">
            <div className="heritage-about-image">
              <div className="image-placeholder">
                <img
                  src="/assets/दिघवट कोट.jpeg"
                  alt="दिघवट कोट महाराजगंज भदोही"
                />
                <p>
                  {language === 'en'
                    ? 'Dighwat Kot, Maharajganj, Bhadohi'
                    : 'दिघवट कोट, महाराजगंज, भदोही'}
                </p>
              </div>
            </div>
            <div className="heritage-about-text">
              <h3 className="heritage-site-name-hi">दिघवट कोट</h3>
              <h4 className="heritage-site-name-en">Dighwat Kot, Maharajganj, Bhadohi</h4>
              <p>
                दिघवट किला मौनसों द्वारा आततायियों से मुक्त कराया गया था। यह भदोही जिले के महाराजगंज क्षेत्र में स्थित है। वर्तमान में यह एम. फार. सेवा स्वामी दयानंद सरस्वती आश्रम के अंतर्गत आता है।
              </p>
              {language === 'en' && (
                <p>
                  Dighwat Fort was liberated from the invaders by the Monsoons. Located in the Maharajganj area of ​​Bhadohi district, it currently belongs to the Swami Dayanand Saraswati Ashram, an M.Pharma service.
                </p>
              )}
            </div>
          </div>

          <div className="heritage-site-divider" />

          {/* Site 10 — अगियावीर कोट */}
          <div className="heritage-about-content">
            <div className="heritage-about-text">
              <h3 className="heritage-site-name-hi">अगियावीर कोट</h3>
              <h4 className="heritage-site-name-en">Agiyaveer Kot, Dwarikpur, Bhadohi</h4>
              <p>
                अगियावीर कोट के ध्वंसावशेष भदोही जनपद उत्तर प्रदेश के द्वारिकापुर में स्थित हैं। यह स्थल उस ऐतिहासिक घटना का साक्षी है, जहाँ मौनसों ने भरों को पराजित किया था।
                </p>
              {language === 'en' && (
                <p>
                  The ruins of Agiavir Kot are located in Dwarikapur, Bhadohi district, Uttar Pradesh. This site bears witness to the historic event where the Monsas defeated the Bhars.
                </p>
              )}
            </div>
            <div className="heritage-about-image">
              <div className="image-placeholder">
                <img
                  src="/assets/अगियावीर कोट.jpeg"
                  alt="अगियावीर कोट द्वारिकापुर भदोही"
                />
                <p>
                  {language === 'en'
                    ? 'Agiyaveer Kot, Dwarikpur, Bhadohi'
                    : 'अगियावीर कोट, द्वारिकापुर, भदोही'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Heritage;
