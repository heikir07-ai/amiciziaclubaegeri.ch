# Viehzuchtverein Hünenberg Website

A modern, fully functional website for the Swiss agricultural association Viehzuchtverein Hünenberg.

## Features

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Dynamic Content**: Events, news, and committee members stored in Supabase database
- **Modern UI**: Clean Swiss-inspired design with smooth animations
- **Forms**: Membership application and contact forms with validation
- **Production Ready**: Fully functional and ready to deploy

## Pages

1. **Home** - Hero section, association values, upcoming events, latest news
2. **Über uns** (About) - History, values, committee members
3. **Tierzucht** (Livestock) - Breeding activities, photo gallery, services
4. **Veranstaltungen** (Events) - Upcoming and past events from database
5. **Aktuelles** (News) - News posts with full article view
6. **Mitgliedschaft** (Membership) - Benefits, categories, application form
7. **Kontakt** (Contact) - Contact information and message form

## Managing Dynamic Content

All dynamic content is stored in the Supabase database. You can manage it through:

### Adding/Editing Events

Access the Supabase dashboard and navigate to the `events` table:
- `title`: Event name
- `description`: Full event description
- `event_date`: Date and time of the event
- `location`: Event venue
- `is_past`: Set to `false` for upcoming events, `true` for past events

### Adding/Editing News Posts

Navigate to the `news_posts` table:
- `title`: Article title
- `content`: Full article text (use \\n for paragraph breaks)
- `excerpt`: Short preview text for homepage
- `published_at`: Publication date

### Managing Committee Members

Navigate to the `committee_members` table:
- `name`: Full name
- `role`: Position/title
- `bio`: Short biography (optional)
- `display_order`: Number for sorting (1 = first position)

### Viewing Form Submissions

- **Membership applications**: Check `membership_applications` table
- **Contact messages**: Check `contact_messages` table

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Supabase for database and backend
- Lucide React for icons

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Database

The database includes the following tables:
- `events` - Association events
- `news_posts` - News articles
- `committee_members` - Board members
- `membership_applications` - Membership form submissions
- `contact_messages` - Contact form submissions

All tables have Row Level Security (RLS) enabled for security.

## Color Palette

The design uses a nature-inspired color palette:
- Primary Green: `#15803d` (green-700)
- Light Green: `#bbf7d0` (green-200)
- Dark Green: `#14532d` (green-900)
- Accent: Earth tones and whites

## Images

The website uses high-quality stock photos from Pexels showing Swiss agriculture, cows, and pastoral scenes. All images are linked directly and load quickly.

## Contact

For questions about the website or technical support, please contact the association at info@vzv-huenenberg.ch
