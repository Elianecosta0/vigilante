import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactProfessionalsScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // South Africa's 11 official languages
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
    { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
    { code: 'st', name: 'Sotho', nativeName: 'Sesotho' },
    { code: 'tn', name: 'Tswana', nativeName: 'Setswana' },
    { code: 'ss', name: 'Swati', nativeName: 'siSwati' },
    { code: 've', name: 'Venda', nativeName: 'Tshivenḓa' },
    { code: 'ts', name: 'Tsonga', nativeName: 'Xitsonga' },
    { code: 'nr', name: 'Ndebele', nativeName: 'isiNdebele' },
    { code: 'nso', name: 'Northern Sotho', nativeName: 'Sepedi' },
  ];

  // Sample professionals data
  const professionals = {
    en: [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialization: 'Crisis Counselor',
        phone: '+27123456789',
        email: 'sarah.johnson@counseling.co.za',
        whatsapp: '+27123456789',
      },
      {
        id: 2,
        name: 'John Smith',
        specialization: 'Emergency Response Coordinator',
        phone: '+27987654321',
        email: 'john.smith@emergency.co.za',
        whatsapp: '+27987654321',
      },
      {
        id: 3,
        name: 'Dr. Michael Brown',
        specialization: 'Mental Health Professional',
        phone: '+27555123456',
        email: 'michael.brown@mentalhealth.co.za',
        whatsapp: '+27555123456',
      },
    ],
    af: [
      {
        id: 4,
        name: 'Dr. Annelie van der Merwe',
        specialization: 'Krisis Berader',
        phone: '+27111222333',
        email: 'annelie.vandermerwe@berading.co.za',
        whatsapp: '+27111222333',
      },
      {
        id: 5,
        name: 'Pieter Botha',
        specialization: 'Noodgeval Koördineerder',
        phone: '+27444555666',
        email: 'pieter.botha@noodgeval.co.za',
        whatsapp: '+27444555666',
      },
    ],
    zu: [
      {
        id: 6,
        name: 'Dr. Nomsa Mthembu',
        specialization: 'Umeluleki Wezingxaki',
        phone: '+27777888999',
        email: 'nomsa.mthembu@umeluleki.co.za',
        whatsapp: '+27777888999',
      },
    ],
    // Add more professionals for other languages as needed
  };

  const handlePhoneCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Phone calls are not supported on this device');
        }
      })
      .catch((err) => console.error('Error opening phone dialer:', err));
  };

  const handleEmail = (email) => {
    const url = `mailto:${email}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Email is not supported on this device');
        }
      })
      .catch((err) => console.error('Error opening email:', err));
  };

  const handleWhatsApp = (phoneNumber) => {
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp is not installed on this device');
        }
      })
      .catch((err) => console.error('Error opening WhatsApp:', err));
  };

  const renderLanguageSelection = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Professionals</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Select Your Language</Text>
        <Text style={styles.subtitle}>Choose your preferred language to connect with professionals</Text>
        
        <View style={styles.languageGrid}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={styles.languageCard}
              onPress={() => setSelectedLanguage(language.code)}
            >
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.languageNative}>{language.nativeName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderProfessionalsList = () => {
    const currentProfessionals = professionals[selectedLanguage] || [];
    const selectedLang = languages.find(lang => lang.code === selectedLanguage);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedLanguage(null)}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Professionals</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>
            {selectedLang?.name} Speaking Professionals
          </Text>
          <Text style={styles.subtitle}>
            Choose a professional to contact for immediate assistance
          </Text>

          {currentProfessionals.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="person-search" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                No professionals available for {selectedLang?.name} yet.
              </Text>
              <Text style={styles.emptySubtext}>
                Please try English or contact our general support.
              </Text>
            </View>
          ) : (
            <View style={styles.professionalsList}>
              {currentProfessionals.map((professional) => (
                <View key={professional.id} style={styles.professionalCard}>
                  <View style={styles.professionalInfo}>
                    <View style={styles.avatar}>
                      <Icon name="person" size={32} color="#fff" />
                    </View>
                    <View style={styles.details}>
                      <Text style={styles.professionalName}>{professional.name}</Text>
                      <Text style={styles.specialization}>{professional.specialization}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.contactOptions}>
                    <TouchableOpacity
                      style={[styles.contactButton, styles.phoneButton]}
                      onPress={() => handlePhoneCall(professional.phone)}
                    >
                      <Icon name="phone" size={20} color="#fff" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.contactButton, styles.emailButton]}
                      onPress={() => handleEmail(professional.email)}
                    >
                      <Icon name="email" size={20} color="#fff" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.contactButton, styles.whatsappButton]}
                      onPress={() => handleWhatsApp(professional.whatsapp)}
                    >
                      <Icon name="chat" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Emergency fallback button */}
          <View style={styles.emergencySection}>
            <TouchableOpacity style={styles.emergencyButton}>
              <View style={styles.emergencyContent}>
                <Icon name="emergency" size={24} color="#fff" />
                <Text style={styles.emergencyText}>Emergency Services</Text>
                <Text style={styles.emergencyNumber}>10111</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedLanguage ? renderProfessionalsList() : renderLanguageSelection()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 24,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  languageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  professionalsList: {
    marginBottom: 16,
  },
  professionalCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  professionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#95a5a6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  professionalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  phoneButton: {
    backgroundColor: '#3498db',
  },
  emailButton: {
    backgroundColor: '#9b59b6',
  },
  whatsappButton: {
    backgroundColor: '#25d366',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 8,
    textAlign: 'center',
  },
  emergencySection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  emergencyButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    marginRight: 16,
  },
  emergencyNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ContactProfessionalsScreen;