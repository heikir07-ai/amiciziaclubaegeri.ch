import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { supabase } from '../supabase';
import { useLang } from '../contexts/LanguageContext';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  registration_email: string;
}

interface EventsProps {
  onNavigate: (page: 'home' | 'events' | 'membership' | 'contact') => void;
}

export default function Events({ onNavigate }: EventsProps) {
  const { t } = useLang();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfPeople: '1',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_past', false)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Events:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = t('Bitte geben Sie einen gültigen Namen ein', 'Inserisci un nome valido');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = t('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'Inserisci un indirizzo email valido');
    }

    const phoneRegex = /^[\d\s+()-]{10,}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = t('Bitte geben Sie eine gültige Telefonnummer ein', 'Inserisci un numero di telefono valido');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!validateForm()) {
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');
    setFieldErrors({});

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([{
          event_id: selectedEvent.id,
          participant_name: formData.name.trim(),
          participant_email: formData.email.trim().toLowerCase(),
          participant_phone: formData.phone.trim(),
          number_of_people: parseInt(formData.numberOfPeople),
          status: 'pending',
        }]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', numberOfPeople: '1' });
      setTimeout(() => {
        setSelectedEvent(null);
        setSubmitStatus('idle');
      }, 3000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || t('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', 'Si è verificato un errore. Riprova.'));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-16 pb-8 px-6 text-center">
        <div className="max-w-3xl mx-auto pt-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            {t('Veranstaltungen', 'Prossimi Eventi')}
          </h1>
          <p className="text-gray-400 text-base">
            {t(
              'Entdecken Sie alle Veranstaltungen der italienischen Gemeinschaft',
              'Scoprite tutti gli eventi della comunità italiana'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#c0392b]" />
          <span className="text-[#c0392b] text-xs font-bold tracking-[0.2em] uppercase">
            {t('Kommende Veranstaltungen', 'Prossimi eventi')}
          </span>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-12">{t('Lade Veranstaltungen...', 'Caricamento eventi...')}</p>
        ) : events.length === 0 ? (
          <p className="text-gray-400 text-center py-12">{t('Derzeit sind keine Veranstaltungen geplant.', 'Al momento non sono previsti eventi.')}</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl p-6"
                style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #1a5c35' }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
                {event.description && (
                  <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                )}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-[#1a5c35]" />
                    <span className="text-sm font-medium">{formatDate(event.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-[#c0392b]" />
                    <span className="text-sm font-medium">{event.location}</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="px-6 py-2 rounded-full bg-[#1a5c35] text-white text-sm font-bold hover:bg-[#134428] transition-colors"
                  >
                    {t('Anmelden', 'Iscriviti')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-12 pt-10 border-t border-gray-100">
        <h2 className="text-3xl font-bold text-[#1a5c35] mb-4">
          {t('Jahresprogramm 2026', 'Programma annuale 2026')}
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {t(
            'Laden Sie das vollständige Jahresprogramm 2026 mit allen Veranstaltungen und Details herunter.',
            'Scarica il programma completo dell\'anno 2026 con tutti gli eventi e i dettagli.'
          )}
        </p>
        <a
          href="/Briefe_2026_Amicia.pdf"
          download
          className="inline-block px-6 py-3 bg-[#1a5c35] text-white text-sm font-bold rounded-xl hover:bg-[#134428] transition-colors"
        >
          {t('PDF herunterladen', 'Scarica PDF')}
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-24 pt-10 border-t border-gray-100">
        <h2 className="text-3xl font-bold text-[#1a5c35] mb-4">
          {t('Möchten Sie eine Veranstaltung organisieren?', 'Volete organizzare un evento?')}
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {t(
            'Wenn Sie eine Idee für eine Veranstaltung haben, kontaktieren Sie uns! Wir sind immer auf der Suche nach neuen Initiativen.',
            "Se avete un'idea per un evento, contattateci! Siamo sempre alla ricerca di nuove iniziative."
          )}
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="text-[#1a5c35] font-bold text-sm hover:text-[#134428] transition-colors"
        >
          {t('Kontaktieren Sie uns mit Ihrer Idee', 'Contattateci con la vostra idea')}
        </button>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('Anmeldung', 'Iscrizione')}</h2>
                  <p className="text-gray-500 text-sm">{selectedEvent.title}</p>
                </div>
                <button
                  onClick={() => { setSelectedEvent(null); setSubmitStatus('idle'); setErrorMessage(''); }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {submitStatus === 'success' ? (
                <div className="bg-[#e8f2ec] border border-[#e8f2ec] rounded-xl p-6 text-center">
                  <p className="text-2xl mb-2">✓</p>
                  <h3 className="text-lg font-bold text-[#134428] mb-1">{t('Anmeldung erfolgreich!', 'Iscrizione completata!')}</h3>
                  <p className="text-[#1a5c35] text-sm">{t('Vielen Dank für Ihre Anmeldung.', 'Grazie per la tua iscrizione.')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">{t('Name', 'Nome')} *</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) setFieldErrors({...fieldErrors, name: ''});
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none ${fieldErrors.name ? 'border-[#c0392b]' : 'border-gray-200'}`}
                      placeholder={t('Ihr vollständiger Name', 'Il tuo nome completo')}
                    />
                    {fieldErrors.name && <p className="text-[#c0392b] text-xs mt-1">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">E-Mail *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({...fieldErrors, email: ''});
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none ${fieldErrors.email ? 'border-[#c0392b]' : 'border-gray-200'}`}
                      placeholder={t('ihre.email@beispiel.com', 'tua.email@esempio.com')}
                    />
                    {fieldErrors.email && <p className="text-[#c0392b] text-xs mt-1">{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">{t('Telefon', 'Telefono')} *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (fieldErrors.phone) setFieldErrors({...fieldErrors, phone: ''});
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none ${fieldErrors.phone ? 'border-[#c0392b]' : 'border-gray-200'}`}
                      placeholder="+41 79 123 45 67"
                    />
                    {fieldErrors.phone && <p className="text-[#c0392b] text-xs mt-1">{fieldErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                      <Users className="inline w-3 h-3 mr-1" />
                      {t('Anzahl Personen', 'Numero di persone')} *
                    </label>
                    <select
                      required
                      value={formData.numberOfPeople}
                      onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? t('Person', 'Persona') : t('Personen', 'Persone')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {submitStatus === 'error' && (
                    <div className="bg-[#fbeaea] border border-[#fbeaea] rounded-xl p-4">
                      <p className="text-[#c0392b] text-sm">{errorMessage}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setSelectedEvent(null); setSubmitStatus('idle'); setErrorMessage(''); }}
                      className="flex-1 px-5 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {t('Abbrechen', 'Annulla')}
                    </button>
                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className="flex-1 px-5 py-3 bg-[#1a5c35] hover:bg-[#134428] text-white text-sm font-bold rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {submitStatus === 'loading' ? t('Wird gesendet...', 'Invio...') : t('Anmeldung absenden', 'Invia iscrizione')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
