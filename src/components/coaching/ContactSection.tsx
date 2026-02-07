import React, { useState } from 'react';
import { Mail, Globe, Send, CheckCircle, User, MessageSquare } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    
    // Reset after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Info */}
          <div className="text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Začni svou transformaci
            </h2>
            <p className="text-purple-200 text-lg mb-8 leading-relaxed">
              Máte otázky nebo byste chtěli osobní koučink? 
              Neváhejte mě kontaktovat. Společně najdeme cestu k vašemu spokojenému životu.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <a 
                href="https://www.veranekvindova.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-200">Webové stránky</p>
                  <p className="font-medium">www.veranekvindova.cz</p>
                </div>
              </a>
              
              <a 
                href="mailto:info@veranekvindova.cz"
                className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-200">Email</p>
                  <p className="font-medium">info@veranekvindova.cz</p>
                </div>
              </a>
            </div>

            {/* Quote */}
            <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
              <p className="text-lg italic text-purple-100 mb-2">
                "Buď autentický. Authenticos - pravý, opravdový, nefalšovaný."
              </p>
              <p className="text-purple-300 text-sm">— Modul 1: Identita</p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12 animate-fadeIn">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Děkujeme za zprávu!
                </h3>
                <p className="text-gray-600">
                  Ozveme se vám co nejdříve.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Napište mi
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jméno
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Vaše jméno"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="vas@email.cz"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zpráva
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Vaše zpráva..."
                        rows={4}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Odesílám...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Odeslat zprávu
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
