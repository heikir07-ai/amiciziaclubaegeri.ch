import { useState, useEffect, useRef } from 'react';
import { Calendar, Users, Heart, ChevronDown, ArrowRight } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';

interface HomeProps {
  onNavigate: (page: 'home' | 'events' | 'membership' | 'contact') => void;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home({ onNavigate }: HomeProps) {
  const { t } = useLang();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const aboutSection = useInView();
  const statsSection = useInView();
  const pillarsSection = useInView();
  const ctaSection = useInView();

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />

        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#1a5c35]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#c0392b]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-20">
          <div
            className="transition-all duration-1000 ease-out"
            style={{
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? 'translateY(0)' : 'translateY(40px)',
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-[#1a5c35]" />
              <span className="text-[#1a5c35] text-xs font-bold tracking-[0.25em] uppercase bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                Unterägeri · Kanton Zug · Dal 1978
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
              {t('Willkommen beim', 'Benvenuti al')}<br />
              <span className="text-[#6ee7a0]">Amicizia Club</span>{' '}
              <span className="text-white">Aegeri</span>
            </h1>

            <p className="text-white/75 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
              {t(
                'Mangiare, bere e stare insieme — die Verbindung zwischen der italienischen Gemeinschaft und dem Ägerital.',
                "Mangiare, bere e stare insieme — il legame tra la comunità italiana e l'Ägerital."
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('membership')}
                className="group flex items-center gap-2 px-8 py-3.5 bg-[#1a5c35] hover:bg-[#134428] text-white text-sm font-bold rounded-full transition-all duration-200 shadow-lg hover:scale-[1.02]"
              >
                <Users className="w-4 h-4" />
                {t('Mitglied werden', 'Diventa socio')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('membership')}
                className="flex items-center gap-2 px-8 py-3.5 border border-white/40 hover:border-white/80 text-white text-sm font-semibold rounded-full transition-all duration-200 backdrop-blur-sm hover:bg-white/10"
              >
                <Heart className="w-4 h-4" />
                {t('Wer sind wir', 'Chi siamo')}
              </button>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700"
          style={{ opacity: heroLoaded ? 1 : 0 }}
        >
          <ChevronDown className="w-6 h-6 text-white/50 animate-bounce" />
        </div>
      </section>

      {/* ABOUT BAND */}
      <section className="bg-[#1a5c35] py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-white/90 text-sm font-medium">
          <span>{t('Gegründet 1978', 'Fondato nel 1978')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span>Am Baumgarten 5, 6314 Unterägeri</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span>amiciziaclubaegeri@gmail.com</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span>{t('Kanton Zug', 'Canton Zugo')}</span>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-24 md:py-32 bg-white">
        <div
          ref={aboutSection.ref}
          className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center transition-all duration-700"
          style={{
            opacity: aboutSection.inView ? 1 : 0,
            transform: aboutSection.inView ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#c0392b]" />
              <span className="text-[#c0392b] text-xs font-bold tracking-[0.2em] uppercase">
                {t('WER SIND WIR', 'CHI SIAMO')}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              {t('Mangiare, bere e stare insieme', 'Mangiare, bere e stare insieme')}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              {t(
                "L'Amicizia Club Aegeri hilft italienischen Einwanderern, freundschaftliche Beziehungen zur lokalen Bevölkerung aufzubauen.",
                "L'Amicizia Club Aegeri aiuta gli immigrati italiani a costruire relazioni amichevoli con la popolazione locale."
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('membership')}
                className="group flex items-center gap-2 px-6 py-3 bg-[#1a5c35] text-white text-sm font-bold rounded-full hover:bg-[#134428] transition-all duration-200"
              >
                {t('Mitglied werden', 'Diventa socio')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Italian community gathering"
                className="w-full h-80 md:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e8f2ec] rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#1a5c35]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t('Seit 1978', 'Dal 1978')}</p>
                  <p className="text-xs text-gray-400">Unterägeri, Kanton Zug</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src="/logo_aca_kopie.jpg"
                alt="ACA Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-[#1a5c35]">
        <div
          ref={statsSection.ref}
          className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 transition-all duration-700"
          style={{
            opacity: statsSection.inView ? 1 : 0,
            transform: statsSection.inView ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          {[
            { value: 50, suffix: '', labelDe: 'Mitglieder', labelIt: 'Soci', descDe: '', descIt: '' },
            { value: 4, suffix: '', labelDe: 'Veranstaltungen pro Jahr', labelIt: 'Eventi all\'anno', descDe: '', descIt: '' },
            { value: 1, suffix: '', labelDe: 'Gemeinschaft', labelIt: 'Comunità', descDe: '', descIt: '' },
          ].map((stat) => (
            <div key={stat.labelDe} className="text-center">
              <p className="text-6xl md:text-7xl font-black text-white mb-1 tabular-nums">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-white font-bold text-base mb-1">{t(stat.labelDe, stat.labelIt)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-24 md:py-32 bg-white">
        <div
          ref={pillarsSection.ref}
          className="max-w-6xl mx-auto px-6 md:px-12 transition-all duration-700"
          style={{
            opacity: pillarsSection.inView ? 1 : 0,
            transform: pillarsSection.inView ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#c0392b]" />
              <span className="text-[#c0392b] text-xs font-bold tracking-[0.2em] uppercase">
                {t('WAS WIR TUN', 'COSA FACCIAMO')}
              </span>
              <div className="h-px w-8 bg-[#c0392b]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              {t('Soziales Engagement für Alle', 'Impegno sociale per tutti')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative bg-white rounded-3xl border border-gray-100 p-8 hover:border-[#1a5c35] hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#1a5c35] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-3xl" />
              <div className="w-12 h-12 bg-[#e8f2ec] rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-[#1a5c35]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{t('Freundschaft', 'Amicizia')}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {t(
                  'Wir bauen Brücken zwischen der italienischen Gemeinschaft und der lokalen Bevölkerung.',
                  'Costruiamo ponti tra la comunità italiana e la popolazione locale.'
                )}
              </p>
            </div>

            <div className="group relative bg-white rounded-3xl border border-gray-100 p-8 hover:border-[#c0392b] hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#c0392b] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-3xl" />
              <div className="w-12 h-12 bg-[#fbeaea] rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#c0392b]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{t('Solidarität', 'Solidarietà')}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {t(
                  'Wir helfen Menschen vor Ort und Menschen in Not.',
                  'Aiutiamo le persone in loco e le persone bisognose.'
                )}
              </p>
            </div>

            <div
              className="group relative bg-white rounded-3xl border border-gray-100 p-8 hover:border-[#1a5c35] hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => onNavigate('events')}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#1a5c35] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-3xl" />
              <div className="w-12 h-12 bg-[#e8f2ec] rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-[#1a5c35]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{t('Veranstaltungen', 'Eventi')}</h3>
              <p className="text-gray-500 leading-relaxed text-sm mb-6">
                {t(
                  'Essen, trinken und zusammen sein bei unseren jährlichen Veranstaltungen.',
                  'Mangiare, bere e stare insieme nei nostri eventi annuali.'
                )}
              </p>
              <span className="inline-flex items-center gap-1 text-[#1a5c35] text-sm font-bold group-hover:gap-2 transition-all">
                {t('Veranstaltungen entdecken', 'Scopri gli eventi')}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DOCS 2026 */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <div className="w-20 h-24 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center border border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#c0392b]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
              <div className="space-y-1.5 px-4 pt-1 w-full">
                <div className="h-1 bg-gray-200 rounded" />
                <div className="h-1 bg-gray-200 rounded" />
                <div className="h-1 bg-gray-200 rounded w-3/4" />
                <div className="h-1 bg-gray-200 rounded" />
                <div className="h-1 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#1a5c35] text-xs font-bold tracking-[0.2em] uppercase mb-2">
              {t('Aktuell', 'Attuale')}
            </p>
            <h3 className="text-3xl font-black text-gray-900 mb-3">{t('Briefe 2026', 'Lettere 2026')}</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              {t(
                'Wichtige Informationen zu unseren Veranstaltungen und Mitgliedsbeiträgen für 2026.',
                'Informazioni importanti sui nostri eventi e sulle quote associative per il 2026.'
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/Briefe_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#1a5c35] text-white text-sm font-bold rounded-full hover:bg-[#134428] transition-all duration-200"
              >
                {t('Brief öffnen (PDF)', 'Apri lettera (PDF)')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/Contatti_Amiciizia.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-500 text-sm font-semibold rounded-full hover:border-gray-400 hover:text-gray-700 transition-all duration-200"
              >
                {t('Kontakte (IT)', 'Contatti (IT)')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-white">
        <div
          ref={ctaSection.ref}
          className="max-w-3xl mx-auto px-6 text-center transition-all duration-700"
          style={{
            opacity: ctaSection.inView ? 1 : 0,
            transform: ctaSection.inView ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#1a5c35]" />
            <span className="text-[#1a5c35] text-xs font-bold tracking-[0.2em] uppercase">
              {t('MACH MIT', 'PARTECIPA')}
            </span>
            <div className="h-px w-8 bg-[#1a5c35]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            <span className="text-[#1a5c35]">{t('Mitglied werden', 'Diventa socio')}</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-4 max-w-xl mx-auto">
            {t(
              'Tritt dem Amicizia Club Aegeri bei und werde Teil unserer Gemeinschaft.',
              "Unisciti all'Amicizia Club Aegeri e diventa parte della nostra comunità."
            )}
          </p>
          <p className="text-gray-400 text-sm mb-10">
            <a href="mailto:amiciziaclubaegeri@gmail.com" className="hover:text-[#1a5c35] transition-colors">amiciziaclubaegeri@gmail.com</a>
            {' · '}
            <a href="tel:0796430216" className="hover:text-[#1a5c35] transition-colors">Catia 079 643 02 16</a>
            {' · '}
            <a href="tel:0795443534" className="hover:text-[#1a5c35] transition-colors">Michael 079 544 35 34</a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('membership')}
              className="group flex items-center gap-2 px-8 py-4 bg-[#1a5c35] text-white text-sm font-black rounded-full hover:bg-[#134428] transition-all duration-200 shadow-lg hover:scale-[1.02]"
            >
              {t('Mitglied werden', 'Diventa socio')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 border-2 border-gray-200 text-gray-600 text-sm font-bold rounded-full hover:border-[#1a5c35] hover:text-[#1a5c35] transition-all duration-200"
            >
              {t('Kontaktiere uns', 'Contattaci')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
