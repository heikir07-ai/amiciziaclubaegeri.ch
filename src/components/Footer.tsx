import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (page: 'home' | 'events' | 'membership' | 'contact') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <>
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            {t('Newsletter abonnieren', 'Iscriviti alla newsletter')}
          </h2>
          <p className="text-gray-400 mb-10">
            {t('Bleiben Sie auf dem Laufenden über unsere Veranstaltungen', 'Rimani aggiornato sui nostri eventi')}
          </p>
          {subscribed ? (
            <p className="text-[#1a5c35] font-semibold">
              {t('Vielen Dank für Ihre Anmeldung!', 'Grazie per la tua iscrizione!')}
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('Ihre E-Mail-Adresse', 'Il tuo indirizzo email')}
                className="flex-1 border-0 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#1a5c35] bg-transparent text-sm"
              />
              <button
                type="submit"
                className="text-[#1a5c35] font-bold text-sm hover:text-[#134428] transition-colors whitespace-nowrap"
              >
                {t('Abonnieren', 'Iscriviti')}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-[#1a5c35] py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src="/logo_aca_kopie.jpg" alt="ACA Logo" className="h-12 w-12 rounded-sm object-cover" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Amicizia Club Aegeri</h3>
              <p className="text-white/60 text-sm">
                {t('Freundschaft und Gemeinschaft seit 1985.', 'Amicizia e comunità dal 1985.')}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">
                {t('Schnelllinks', 'Link rapidi')}
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNavigate('home')} className="text-white/60 text-sm hover:text-white transition-colors text-left">
                    {t('Startseite', 'Home')}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('membership')} className="text-white/60 text-sm hover:text-white transition-colors text-left">
                    {t('Über uns', 'Chi siamo')}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('events')} className="text-white/60 text-sm hover:text-white transition-colors text-left">
                    {t('Veranstaltungen', 'Eventi')}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="text-white/60 text-sm hover:text-white transition-colors text-left">
                    {t('Kontakt', 'Contatto')}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">
                {t('Kontaktinformation', 'Informazioni di contatto')}
              </h4>
              <div className="space-y-1 text-white/60 text-sm">
                <p>amiciziaclubaegeri@gmail.com</p>
                <p className="mt-2">Catia: 079 643 02 16</p>
                <p>Michael: 079 544 35 34</p>
                <p className="mt-2">Amicizia Club Aegeri</p>
                <p>c/o Michael Heilig</p>
                <p>Am Baumgarten 5</p>
                <p>6314 Unterägeri</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 text-center">
            <p className="text-white/50 text-sm">
              {t('© 2026 Amicizia Club Aegeri. Alle Rechte vorbehalten', '© 2026 Amicizia Club Aegeri. Tutti i diritti riservati')}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
