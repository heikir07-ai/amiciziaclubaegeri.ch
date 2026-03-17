import { useState } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { supabase } from '../supabase';
import { useLang } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLang();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name: formData.name, email: formData.email, subject: formData.subject, message: formData.message, status: 'new' }]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || t('Ein Fehler ist aufgetreten.', 'Si è verificato un errore.'));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 pb-8 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            {t('Kontakt', 'Contatto')}
          </h1>
          <p className="text-gray-400 text-base">
            {t(
              'Wir sind hier, um Ihnen zu helfen. Kontaktieren Sie uns jederzeit!',
              'Siamo qui per aiutarvi. Contattateci in qualsiasi momento!'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-10 space-y-4">
        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #1a5c35' }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-9 h-9 bg-[#e8f2ec] rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#1a5c35]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1a5c35] mb-2">{t('Adresse', 'Indirizzo')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Amicizia Club Aegeri<br />
                c/o Michael Heilig<br />
                Am Baumgarten 5<br />
                6314 Unterägeri
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #1a5c35' }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-9 h-9 bg-[#e8f2ec] rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#1a5c35]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1a5c35] mb-2">{t('E-Mail', 'Email')}</h3>
              <a
                href="mailto:amiciziaclubaegeri@gmail.com"
                className="text-[#1a5c35] text-sm hover:text-[#134428] transition-colors"
              >
                amiciziaclubaegeri@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #1a5c35' }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-9 h-9 bg-[#e8f2ec] rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#1a5c35]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1a5c35] mb-3">{t('Telefon', 'Telefono')}</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-400 text-sm">Catia</p>
                  <a href="tel:0796430216" className="text-[#1a5c35] text-sm font-semibold hover:text-[#134428]">079 643 02 16</a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Michael</p>
                  <a href="tel:0795443534" className="text-[#1a5c35] text-sm font-semibold hover:text-[#134428]">079 544 35 34</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-24">
        <div className="rounded-2xl border-2 border-[#1a5c35] p-8 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {t('Sende uns eine Nachricht', 'Inviaci un messaggio')}
          </h2>

          {submitStatus === 'success' ? (
            <div className="bg-[#e8f2ec] border border-[#e8f2ec] rounded-xl p-6 text-center">
              <p className="text-2xl mb-2">✓</p>
              <h3 className="text-lg font-bold text-[#134428] mb-1">
                {t('Nachricht gesendet!', 'Messaggio inviato!')}
              </h3>
              <p className="text-[#1a5c35] text-sm">
                {t('Vielen Dank. Wir melden uns so schnell wie möglich.', 'Grazie. Ti risponderemo il prima possibile.')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('Name', 'Nome')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none"
                  placeholder={t('Ihr Name', 'Il tuo nome')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('E-Mail', 'Email')}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none"
                  placeholder={t('Ihre E-Mail', 'La tua email')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('Betreff', 'Oggetto')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none"
                  placeholder={t('Betreff der Nachricht', 'Oggetto del messaggio')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('Nachricht', 'Messaggio')}
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none resize-none"
                  placeholder={t('Ihre Nachricht', 'Il tuo messaggio')}
                />
              </div>

              {submitStatus === 'error' && (
                <div className="bg-[#fbeaea] border border-[#fbeaea] rounded-xl p-4">
                  <p className="text-[#c0392b] text-sm">{errorMessage}</p>
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="px-8 py-3 bg-[#1a5c35] text-white text-sm font-bold rounded-full hover:bg-[#134428] transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {submitStatus === 'loading'
                    ? t('Wird gesendet...', 'Invio in corso...')
                    : t('Nachricht senden', 'Invia messaggio')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
