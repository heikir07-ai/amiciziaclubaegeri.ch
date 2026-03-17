import { useState } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { supabase } from '../supabase';
import { useLang } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLang();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = t('Bitte geben Sie einen gültigen Namen ein', 'Inserisci un nome valido');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = t('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'Inserisci un indirizzo email valido');
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errors.subject = t('Bitte geben Sie einen gültigen Betreff ein', 'Inserisci un oggetto valido');
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = t('Bitte geben Sie eine Nachricht mit mindestens 10 Zeichen ein', 'Inserisci un messaggio di almeno 10 caratteri');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');
    setFieldErrors({});

    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          status: 'new'
        }])
        .select();

      if (error) {
        console.error('Contact form error:', error);
        throw error;
      }

      console.log('Contact message submitted successfully:', data);

      // Send email notification via Edge Function
      try {
        const emailResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              name: formData.name.trim(),
              email: formData.email.trim(),
              subject: formData.subject.trim(),
              message: formData.message.trim(),
            }),
          }
        );

        if (!emailResponse.ok) {
          console.error('Email sending failed:', await emailResponse.text());
        } else {
          console.log('Email sent successfully');
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      console.error('Contact form submission failed:', error);
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
                  minLength={2}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors({...fieldErrors, name: ''});
                  }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none ${fieldErrors.name ? 'border-[#c0392b]' : 'border-gray-200'}`}
                  placeholder={t('Ihr Name', 'Il tuo nome')}
                />
                {fieldErrors.name && <p className="text-[#c0392b] text-xs mt-1">{fieldErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('E-Mail', 'Email')}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors({...fieldErrors, email: ''});
                  }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none ${fieldErrors.email ? 'border-[#c0392b]' : 'border-gray-200'}`}
                  placeholder={t('Ihre E-Mail', 'La tua email')}
                />
                {fieldErrors.email && <p className="text-[#c0392b] text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('Betreff', 'Oggetto')}
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (fieldErrors.subject) setFieldErrors({...fieldErrors, subject: ''});
                  }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none ${fieldErrors.subject ? 'border-[#c0392b]' : 'border-gray-200'}`}
                  placeholder={t('Betreff der Nachricht', 'Oggetto del messaggio')}
                />
                {fieldErrors.subject && <p className="text-[#c0392b] text-xs mt-1">{fieldErrors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('Nachricht', 'Messaggio')}
                </label>
                <textarea
                  required
                  minLength={10}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (fieldErrors.message) setFieldErrors({...fieldErrors, message: ''});
                  }}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none resize-none ${fieldErrors.message ? 'border-[#c0392b]' : 'border-gray-200'}`}
                  placeholder={t('Ihre Nachricht', 'Il tuo messaggio')}
                />
                {fieldErrors.message && <p className="text-[#c0392b] text-xs mt-1">{fieldErrors.message}</p>}
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
