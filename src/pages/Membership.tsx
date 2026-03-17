import { useState } from 'react';
import { Check, User, Users } from 'lucide-react';
import { supabase } from '../supabase';
import { useLang } from '../contexts/LanguageContext';

interface MembershipProps {
  onNavigate: (page: 'home' | 'events' | 'membership' | 'contact') => void;
}

const boardMembers = [
  { name: 'Catia Müller', roleDe: 'Präsidentin', roleIt: 'Presidentessa' },
  { name: 'Peter Müller', roleDe: 'Vizepräsident', roleIt: 'Vicepresidente' },
  { name: 'Michael Heilig', roleDe: 'Kassier', roleIt: 'Tesoriere' },
  { name: 'Giuseppe Clauderotti', roleDe: 'Sekretär AI / Centro Italiano Zug', roleIt: 'Segretario AI / Centro Italiano Zug' },
  { name: 'Kevin Lüthold', roleDe: 'Beisitzer', roleIt: 'Consigliere' },
  { name: 'Trudy Gabriel', roleDe: 'Beisitzerin', roleIt: 'Consigliera' },
  { name: 'Josef Müller', roleDe: 'Beisitzer', roleIt: 'Consigliere' },
  { name: 'Erwin Peretti', roleDe: 'Beisitzer', roleIt: 'Consigliere' },
];

export default function Membership({ onNavigate: _onNavigate }: MembershipProps) {
  const { t } = useLang();
  const [formData, setFormData] = useState({ name: '', email: '', type: 'single', message: '' });
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
      const subject = formData.type === 'single'
        ? t('Mitgliedschaft Einzelperson', 'Iscrizione individuale')
        : t('Mitgliedschaft Familie', 'Iscrizione famiglia');

      const defaultMessage = formData.type === 'single'
        ? t('Ich möchte Einzelmitglied des Amicizia Club Aegeri werden.', 'Vorrei diventare membro individuale del Club Amicizia Aegeri.')
        : t('Ich möchte Familienmitglied des Amicizia Club Aegeri werden.', 'Vorrei diventare membro famiglia del Club Amicizia Aegeri.');

      const finalMessage = formData.message.trim() || defaultMessage;

      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          subject,
          message: finalMessage,
          status: 'new',
        }]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', type: 'single', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 6000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || t('Ein Fehler ist aufgetreten.', 'Si è verificato un errore.'));
    }
  };

  const benefits = [
    { de: 'Zugang zu allen Veranstaltungen', it: 'Accesso a tutti gli eventi' },
    { de: 'Newsletter', it: 'Newsletter' },
    { de: 'Ermässigung bei Veranstaltungen', it: 'Riduzione agli eventi' },
    { de: 'Unterstützung bei Integration', it: 'Supporto per l\'integrazione' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* INTRO */}
      <section className="pt-24 pb-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#c0392b]" />
            <span className="text-[#c0392b] text-xs font-bold tracking-[0.2em] uppercase">
              {t('ÜBER UNS', 'CHI SIAMO')}
            </span>
            <div className="h-px w-8 bg-[#c0392b]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {t('Über den Amicizia Club Aegeri', "Informazioni sull'Amicizia Club Aegeri")}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            {t(
              'Wir unterstützen die italienisch-schweizerische Freundschaft in der Region Zug.',
              "Sosteniamo l'amicizia italo-svizzera nella regione di Zugo."
            )}
          </p>
        </div>
      </section>

      {/* UNSERE ZIELE */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#1a5c35]" />
            <span className="text-[#1a5c35] text-xs font-bold tracking-[0.2em] uppercase">
              {t('UNSERE ZIELE', 'I NOSTRI OBIETTIVI')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
            {t('Unsere Ziele', 'I nostri obiettivi')}
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            {t(
              'Unser Ziel ist es, Leute zusammenzubringen, zu essen, zu trinken und ein geselliges Zusammensein zu feiern. Wir schaffen Momente der Freude und Gemeinschaft, in denen Menschen bei gutem Essen und Trinken zusammenkommen können.',
              'Il nostro obiettivo è riunire le persone, mangiare, bere e festeggiare insieme. Creiamo momenti di gioia e comunità.'
            )}
          </p>
          <div className="inline-block bg-[#1a5c35] text-white rounded-2xl px-8 py-5">
            <p className="text-lg font-black italic">
              {t('"Mangiare, bere e stare insieme"', '"Mangiare, bere e stare insieme"')}
            </p>
          </div>
        </div>
      </section>

      {/* UNSERE GESCHICHTE */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#c0392b]" />
            <span className="text-[#c0392b] text-xs font-bold tracking-[0.2em] uppercase">
              {t('UNSERE GESCHICHTE', 'LA NOSTRA STORIA')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
            {t('Unsere Geschichte', 'La nostra storia')}
          </h2>
          <div className="space-y-5">
            <p className="text-gray-500 text-base leading-relaxed">
              {t(
                'Der Amicizia Club Aegeri wurde 1985 von italienischen Emigranten in Unterägeri gegründet mit dem Ziel, die Freundschaft zwischen der italienischen und der Schweizer Bevölkerung zu fördern. Entstanden aus der Leidenschaft und dem Wunsch, einen Raum zu schaffen, in dem die italienische Kultur gedeihen kann, hat der Club von Anfang an Brücken zwischen den beiden Gemeinschaften gebaut und eine einladende Umgebung geschaffen, in der Neuankömmlinge Unterstützung und Akzeptanz finden.',
                "Il Club Amicizia Aegeri è stato fondato nel 1985 da emigranti italiani a Unterägeri con l'obiettivo di promuovere l'amicizia tra la popolazione italiana e svizzera."
              )}
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              {t(
                'In fast vier Jahrzehnten haben wir hunderte von Veranstaltungen organisiert, tausenden von Menschen geholfen und eine lebendige Gemeinschaft geschaffen, die das Beste der italienischen Kultur und Werte repräsentiert und die Integration sowie das gegenseitige Verständnis zwischen Italienern und Schweizern fördert.',
                'In quasi quattro decenni abbiamo organizzato centinaia di eventi, aiutato migliaia di persone e creato una vivace comunità.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* VORSTAND */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#1a5c35]" />
            <span className="text-[#1a5c35] text-xs font-bold tracking-[0.2em] uppercase">
              {t('VORSTAND 2026-2028', 'COMITATO 2026-2028')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            {t('Vorstand 2026-2028', 'Comitato 2026-2028')}
          </h2>
          <p className="text-gray-400 text-sm mb-10">
            {t('Unser Vorstand ist für Sie da', 'Il nostro comitato è a vostra disposizione')}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {boardMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#1a5c35] hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 bg-[#e8f2ec] rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#1a5c35] font-black text-sm">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <p className="font-black text-gray-900 text-sm mb-1">{member.name}</p>
                <p className="text-[#1a5c35] text-xs font-semibold leading-snug">
                  {t(member.roleDe, member.roleIt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MITGLIED WERDEN */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#1a5c35]" />
              <span className="text-[#1a5c35] text-xs font-bold tracking-[0.2em] uppercase">
                {t('MITMACHEN', 'UNISCITI')}
              </span>
              <div className="h-px w-8 bg-[#1a5c35]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
              {t('Möchten Sie uns beitreten?', 'Volete unirvi a noi?')}
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">
              {t(
                'Werden Sie Teil unserer Gemeinschaft und geniessen Sie alle Vorteile einer Mitgliedschaft.',
                'Entrate a far parte della nostra comunità e godetevi tutti i vantaggi dell\'iscrizione.'
              )}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <h3 className="text-xl font-black text-gray-900 mb-6 text-center">
              {t('Ihre Vorteile', 'I vostri vantaggi')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <div
                  key={b.de}
                  className="flex items-center gap-3 bg-[#f4faf7] rounded-xl px-5 py-4"
                >
                  <Check className="w-5 h-5 text-[#1a5c35] flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-medium">{t(b.de, b.it)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Membership types */}
          <div className="mb-8">
            <h3 className="text-xl font-black text-gray-900 mb-6 text-center">
              {t('Mitgliedschaftsarten', 'Tipi di iscrizione')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-[#1a5c35] p-6 text-white">
                  <User className="w-8 h-8 mb-3 opacity-90" />
                  <p className="text-lg font-black">{t('Einzelmitgliedschaft', 'Iscrizione individuale')}</p>
                  <p className="text-3xl font-black mt-1">CHF 30<span className="text-base font-semibold opacity-80">/{t('Jahr', 'anno')}</span></p>
                </div>
                <div className="bg-white border border-gray-100 px-6 py-4 border-t-0">
                  <p className="text-gray-500 text-sm">{t('Für eine erwachsene Person', 'Per una persona adulta')}</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-sm relative">
                <div className="absolute top-3 right-3 bg-white text-[#c0392b] text-xs font-black px-3 py-1 rounded-full shadow-sm">
                  {t('Beliebt', 'Popolare')}
                </div>
                <div className="bg-[#c0392b] p-6 text-white">
                  <Users className="w-8 h-8 mb-3 opacity-90" />
                  <p className="text-lg font-black">{t('Familienmitgliedschaft', 'Iscrizione famiglia')}</p>
                  <p className="text-3xl font-black mt-1">CHF 50<span className="text-base font-semibold opacity-80">/{t('Jahr', 'anno')}</span></p>
                </div>
                <div className="bg-white border border-gray-100 px-6 py-4 border-t-0">
                  <p className="text-gray-500 text-sm">{t('Für die ganze Familie (bis zu 4 Personen)', 'Per tutta la famiglia (fino a 4 persone)')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signup form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-black text-gray-900 mb-2">
              {t('Jetzt Mitglied werden', 'Iscriviti ora')}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {t('Füllen Sie das Formular aus und wir melden uns bei Ihnen.', 'Compilate il modulo e vi contatteremo.')}
            </p>

            {submitStatus === 'success' ? (
              <div className="bg-[#e8f2ec] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#1a5c35] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-black text-[#134428] mb-1">
                  {t('Anfrage gesendet!', 'Richiesta inviata!')}
                </h4>
                <p className="text-[#1a5c35] text-sm">
                  {t('Vielen Dank. Wir melden uns so schnell wie möglich.', 'Grazie. Vi risponderemo il prima possibile.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
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
                      placeholder={t('Ihr Name', 'Il vostro nome')}
                    />
                    {fieldErrors.name && <p className="text-[#c0392b] text-xs mt-1">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('E-Mail', 'Email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({...fieldErrors, email: ''});
                      }}
                      className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none ${fieldErrors.email ? 'border-[#c0392b]' : 'border-gray-200'}`}
                      placeholder={t('Ihre E-Mail', 'La vostra email')}
                    />
                    {fieldErrors.email && <p className="text-[#c0392b] text-xs mt-1">{fieldErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('Mitgliedschaftsart', 'Tipo di iscrizione')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'single' })}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        formData.type === 'single'
                          ? 'border-[#1a5c35] bg-[#f4faf7] text-[#1a5c35]'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      {t('Einzelperson', 'Individuale')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'family' })}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        formData.type === 'family'
                          ? 'border-[#c0392b] bg-[#fdf2f2] text-[#c0392b]'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      {t('Familie', 'Famiglia')}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('Nachricht (optional)', 'Messaggio (opzionale)')}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-[#1a5c35] focus:border-transparent outline-none resize-none"
                    placeholder={t('Ihre Nachricht oder Fragen', 'Il vostro messaggio o domande')}
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="bg-[#fbeaea] rounded-xl p-4">
                    <p className="text-[#c0392b] text-sm">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="w-full py-3.5 bg-[#1a5c35] text-white text-sm font-black rounded-xl hover:bg-[#134428] transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {submitStatus === 'loading'
                    ? t('Wird gesendet...', 'Invio in corso...')
                    : t('Jetzt Mitglied werden', 'Iscriviti ora')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
