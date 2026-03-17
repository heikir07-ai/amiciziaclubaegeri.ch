import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home';
import Events from './pages/Events';
import Membership from './pages/Membership';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import { LanguageProvider, useLang } from './contexts/LanguageContext';

type Page = 'home' | 'events' | 'membership' | 'contact';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollToForm, setScrollToForm] = useState(false);
  const { lang, setLang, t } = useLang();

  const navigation = [
    { id: 'home', labelDe: 'Startseite', labelIt: 'Home' },
    { id: 'membership', labelDe: 'Über uns', labelIt: 'Chi siamo' },
    { id: 'events', labelDe: 'Veranstaltungen', labelIt: 'Eventi' },
    { id: 'contact', labelDe: 'Kontakt', labelIt: 'Contatto' },
  ];

  const handleNavigateToMembership = (shouldScroll: boolean = false) => {
    setCurrentPage('membership');
    setScrollToForm(shouldScroll);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} onNavigateToForm={handleNavigateToMembership} />;
      case 'events':
        return <Events onNavigate={setCurrentPage} />;
      case 'membership':
        return <Membership onNavigate={setCurrentPage} scrollToForm={scrollToForm} onFormScrolled={() => setScrollToForm(false)} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} onNavigateToForm={handleNavigateToMembership} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed w-full z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center py-3">
            <button
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              <img src="/logo_aca_kopie.jpg" alt="ACA Logo" className="h-10 w-10 rounded-lg object-cover shadow-sm" />
              <div className="flex flex-col items-start">
                <span className="text-xs font-black tracking-[0.15em] uppercase leading-tight text-[#1a5c35]">
                  AMICIZIA CLUB
                </span>
                <span className="text-xs font-medium tracking-widest uppercase leading-tight text-gray-400">
                  AEGERI
                </span>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as Page)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-[#1a5c35] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {t(item.labelDe, item.labelIt)}
                </button>
              ))}
              <div className="ml-3 flex items-center rounded-full border border-gray-200 overflow-hidden text-xs font-bold">
                <button
                  onClick={() => setLang('de')}
                  className={`px-3 py-1.5 transition-colors ${
                    lang === 'de' ? 'bg-[#1a5c35] text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  DE
                </button>
                <button
                  onClick={() => setLang('it')}
                  className={`px-3 py-1.5 transition-colors ${
                    lang === 'it' ? 'bg-[#1a5c35] text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  IT
                </button>
              </div>
            </div>

            <div className="flex md:hidden items-center gap-3">
              <div className="flex items-center rounded-full border border-gray-200 overflow-hidden text-xs font-bold">
                <button
                  onClick={() => setLang('de')}
                  className={`px-3 py-1.5 transition-colors ${
                    lang === 'de' ? 'bg-[#1a5c35] text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  DE
                </button>
                <button
                  onClick={() => setLang('it')}
                  className={`px-3 py-1.5 transition-colors ${
                    lang === 'it' ? 'bg-[#1a5c35] text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  IT
                </button>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1"
                aria-label="Menu"
              >
                {mobileMenuOpen
                  ? <X className="h-6 w-6 text-gray-700" />
                  : <Menu className="h-6 w-6 text-gray-700" />
                }
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="bg-white border-t border-gray-100 shadow-lg md:hidden">
            <div className="max-w-6xl mx-auto px-6 py-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as Page);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    currentPage === item.id
                      ? 'text-[#1a5c35] bg-[#e8f2ec]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {t(item.labelDe, item.labelIt)}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        {renderPage()}
      </main>

      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
