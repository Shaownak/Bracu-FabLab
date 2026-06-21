import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const footerLinks = {
  'Quick Links': [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/facilities', label: 'Facilities' },
    { href: '/projects', label: 'Projects' },
  ],
  'Services': [
    { href: '/facilities', label: '3D Printing' },
    { href: '/facilities', label: 'Laser Cutting' },
    { href: '/facilities', label: 'CNC Machining' },
    { href: '/facilities', label: 'PCB Fabrication' },
  ],
  'Resources': [
    { href: '/resources', label: 'Tutorials' },
    { href: '/resources', label: 'Safety Guidelines' },
    { href: '/events', label: 'Workshops' },
    { href: '/contact', label: 'Contact Us' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card text-foreground border-t border-border mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <div>
                <span className="text-lg font-bold">BRACU</span>
                <span className="text-lg font-light text-primary ml-1">FabLab</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              BRAC University&apos;s Fabrication Laboratory — empowering students and researchers
              to transform innovative ideas into tangible prototypes through digital fabrication
              and advanced manufacturing technologies.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary shrink-0" />
                <span>Kha 224 Pragati Sarani, Merul Badda, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={16} className="text-primary shrink-0" />
                <a href="mailto:fablab@bracu.ac.bd" className="hover:text-foreground transition-colors">
                  fablab@bracu.ac.bd
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={16} className="text-primary shrink-0" />
                <span>+880 2-222264051-4</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BRAC University FabLab. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://www.bracu.ac.bd" target="_blank" rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                BRAC University <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
