import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

type Page = 'home' | 'contact' | 'devis' | 'rdv';
type AppointmentStep = 1 | 2 | 3 | 4;

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface QuoteForm {
  firstName: string;
  lastName: string;
  departure: string;
  arrival: string;
  passengers: string;
  tripType: string;
  phone: string;
  email: string;
  note: string;
}

interface AppointmentForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  subject: string;
  notes: string;
}

interface CalendarCell {
  label: string;
  dateKey?: string;
  disabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  isBlank: boolean;
}

interface InfoCard {
  title: string;
  description: string;
  icon: string;
}

interface ContactCard {
  icon: string;
  title: string;
  text: string;
  linkLabel?: string;
  linkHref?: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected currentPage: Page = 'home';
  protected mobileMenuOpen = false;

  protected contactSent = false;
  protected quoteSent = false;

  protected appointmentStep: AppointmentStep = 1;
  protected selectedDateKey = '';
  protected selectedDateLabel = '—';
  protected selectedSlot = '';
  protected calendarLabel = '';
  protected calendarCells: CalendarCell[] = [];

  protected readonly navItems = [
    { label: 'Accueil', target: 'home', page: 'home' as const },
    { label: 'Services', target: 'services', page: 'home' as const },
    { label: 'À propos', target: 'about', page: 'home' as const },
    { label: 'Tarifs', target: 'tarifs', page: 'home' as const },
  ];

  protected readonly heroStats = [
    { value: '24/7', label: 'Disponibilité' },
    { value: '6', label: 'Places' },
    { value: 'N°15', label: 'Station Brunoy' },
  ];

  protected readonly bandItems = [
    { icon: '🚖', text: 'Taxi conventionné', highlight: 'CPAM' },
    { icon: '✈️', text: 'Aéroports', highlight: 'Orly · CDG · Beauvais' },
    { icon: '📍', text: 'Station', highlight: 'Brunoy N°15 — Essonne 91' },
    { icon: '💳', text: 'Paiement', highlight: 'CB · NFC · Espèces · PayPal' },
    { icon: '💬', text: 'Disponible par', highlight: 'WhatsApp' },
  ];

  protected readonly serviceCards = [
    {
      icon: '✈️',
      title: 'Aéroport',
      description:
        'Transferts Orly, CDG et Beauvais. Suivi des vols en temps réel, attente incluse sans surcoût.',
    },
    {
      icon: '🚄',
      title: 'Gares',
      description:
        'Prises en charge à toutes les gares d’Île-de-France avec adaptation aux horaires de train.',
    },
    {
      icon: '💼',
      title: 'Business',
      description:
        'Déplacements professionnels discrets et ponctuels. Wi-Fi à bord pour travailler en route.',
    },
    {
      icon: '🗺️',
      title: 'Longue distance',
      description:
        'Toute la France accessible avec un tarif fixé à l’avance, sans mauvaise surprise.',
    },
    {
      icon: '📦',
      title: 'Livraison express',
      description:
        'Transport de colis et documents urgents en main propre en Essonne et en Île-de-France.',
    },
    {
      icon: '🏫',
      title: 'Transport scolaire',
      description:
        'Service régulier et fiable pour les enfants, avec une attention particulière à la sécurité.',
    },
  ];

  protected readonly trustCards: InfoCard[] = [
    {
      icon: '⏱️',
      title: 'Ponctualité garantie',
      description:
        'Nous nous engageons à arriver à l’heure convenue à tous vos rendez-vous.',
    },
    {
      icon: '🛡️',
      title: 'Confort & sécurité',
      description:
        'Véhicule récent, climatisé et parfaitement entretenu pour votre bien-être à bord.',
    },
    {
      icon: '🤝',
      title: 'Courtoisie professionnelle',
      description:
        'Chauffeur expérimenté, attentionné et toujours à votre écoute.',
    },
    {
      icon: '📋',
      title: 'Devis gratuit & sans engagement',
      description:
        'Estimez votre trajet en ligne en quelques clics via notre formulaire.',
    },
  ];

  protected readonly vehicleSpecs = [
    { icon: '👥', title: '6 passagers max', description: 'Places individuelles spacieuses' },
    { icon: '🧳', title: 'Grand coffre', description: 'Jusqu’à 6 bagages volumineux' },
    { icon: '❄️', title: 'Climatisation', description: 'Confort toute l’année' },
    { icon: '📶', title: 'Wi-Fi à bord', description: 'Connexion incluse' },
    { icon: '🔌', title: 'Chargeurs USB', description: 'iPhone et Android' },
    { icon: '💧', title: 'Eau minérale', description: 'Offerte à chaque trajet' },
  ];

  protected readonly pricingCards = [
    {
      name: 'Prise en charge',
      price: '2,60 €',
      unit: 'à la montée — tarif de jour (7h–19h)',
      features: [
        'Tarif réglementé préfectoral',
        'Trajet standard en ville et banlieue',
        'Jusqu’à 4 passagers inclus',
      ],
      featured: false,
      cta: 'Estimer mon trajet',
    },
    {
      name: 'Aéroport / Gare',
      price: 'Prix fixe',
      unit: 'tarif convenu à l’avance, sans compteur',
      features: [
        'Orly, CDG, Beauvais-Tillé',
        'Toutes gares d’Île-de-France',
        'Suivi du vol en temps réel',
        'Attente gratuite jusqu’à 30 min',
        'Aide aux bagages incluse',
      ],
      featured: true,
      badge: 'Le plus demandé',
      cta: 'Obtenir un devis',
    },
    {
      name: 'Longue distance',
      price: 'Sur devis',
      unit: 'estimation gratuite en ligne',
      features: [
        'Toute la France, sans limite',
        'Retour pris en compte si souhaité',
        'Devis gratuit et réponse rapide',
      ],
      featured: false,
      cta: 'Calculer mon trajet',
    },
  ];

  protected readonly contactCards: ContactCard[] = [
    {
      icon: '📞',
      title: 'Téléphone',
      text: '06 45 67 00 00 — disponible 24h/24, 7j/7',
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      text: 'Devis et réservation par message',
      linkLabel: 'Envoyer un message',
      linkHref: 'https://wa.me/33645670000',
    },
    {
      icon: '📍',
      title: 'Localisation',
      text: 'Saulx-les-Chartreux · Brunoy · Essonne 91\nStation taxi Brunoy N°15',
    },
    {
      icon: '🕐',
      title: 'Disponibilité',
      text: '24h/24 · 7j/7 · Week-ends et jours fériés inclus',
    },
    {
      icon: '✈️',
      title: 'Zone de service',
      text: 'Essonne · Île-de-France · Toute la France',
    },
  ];

  protected readonly quotePerks = [
    {
      icon: '🆓',
      title: '100% gratuit',
      description:
        'Notre service de devis est entièrement gratuit, sans aucun engagement.',
    },
    {
      icon: '⚡',
      title: 'Réponse rapide',
      description:
        'Nous vous rappelons ou vous écrivons généralement dans l’heure.',
    },
    {
      icon: '🔒',
      title: 'Prix fixe garanti',
      description:
        'Une fois le devis accepté, le tarif est ferme, sans mauvaise surprise.',
    },
    {
      icon: '🛣️',
      title: 'Toutes distances',
      description:
        'Déplacement local, aéroport, longue distance ou mise à disposition.',
    },
  ];

  protected readonly appointmentSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
  ];

  protected readonly contactForm: ContactForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'Demande de renseignements',
    message: '',
  };

  protected readonly quoteForm: QuoteForm = {
    firstName: '',
    lastName: '',
    departure: '',
    arrival: '',
    passengers: '1 passager',
    tripType: 'Standard',
    phone: '',
    email: '',
    note: '',
  };

  protected readonly appointmentForm: AppointmentForm = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    subject: "Réservation d'un trajet",
    notes: '',
  };

  protected readonly months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  protected readonly shortDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  protected readonly longDays = [
    'dimanche',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
  ];

  private currentYear = new Date().getFullYear();
  private currentMonth = new Date().getMonth();

  constructor(private readonly apiService: ApiService) {
    this.initCalendar();
  }

  protected goTo(page: Page): void {
    this.currentPage = page;
    this.mobileMenuOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'rdv') {
      this.initCalendar();
    }
  }

  protected scrollSection(sectionId: string): void {
    this.goTo('home');
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  protected async submitContact(): Promise<void> {
    if (!this.requiredFieldsFilled([this.contactForm.firstName, this.contactForm.lastName, this.contactForm.email, this.contactForm.phone, this.contactForm.message])) {
      alert('Veuillez remplir les champs obligatoires (*).');
      return;
    }

    try {
      await this.apiService.sendContact(this.contactForm);
      this.contactSent = true;
    } catch {
      alert('Le message n’a pas pu être envoyé. Vérifiez le backend.');
    }
  }

  protected resetContact(): void {
    this.contactForm.firstName = '';
    this.contactForm.lastName = '';
    this.contactForm.email = '';
    this.contactForm.phone = '';
    this.contactForm.subject = 'Demande de renseignements';
    this.contactForm.message = '';
    this.contactSent = false;
  }

  protected async submitQuote(): Promise<void> {
    if (!this.requiredFieldsFilled([this.quoteForm.firstName, this.quoteForm.lastName, this.quoteForm.departure, this.quoteForm.arrival, this.quoteForm.phone])) {
      alert('Veuillez remplir les champs obligatoires (*).');
      return;
    }

    try {
      await this.apiService.sendQuote(this.quoteForm);
      this.quoteSent = true;
    } catch {
      alert('La demande de devis n’a pas pu être envoyée. Vérifiez le backend.');
    }
  }

  protected resetQuote(): void {
    this.quoteForm.firstName = '';
    this.quoteForm.lastName = '';
    this.quoteForm.departure = '';
    this.quoteForm.arrival = '';
    this.quoteForm.passengers = '1 passager';
    this.quoteForm.tripType = 'Standard';
    this.quoteForm.phone = '';
    this.quoteForm.email = '';
    this.quoteForm.note = '';
    this.quoteSent = false;
  }

  protected previousMonth(): void {
    this.currentMonth -= 1;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    }
    this.renderCalendar();
  }

  protected nextMonth(): void {
    this.currentMonth += 1;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    }
    this.renderCalendar();
  }

  protected pickDate(cell: CalendarCell): void {
    if (cell.disabled || !cell.dateKey) {
      return;
    }

    this.selectedDateKey = cell.dateKey;
    this.selectedDateLabel = this.formatSelectedDate(cell.dateKey);
    this.renderCalendar();
    window.setTimeout(() => this.goStep(2), 160);
  }

  protected pickSlot(slot: string): void {
    this.selectedSlot = slot;
    this.goStep(3);
  }

  protected goStep(step: AppointmentStep): void {
    this.appointmentStep = step;

    if (step === 2) {
      this.renderCalendar();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected async confirmAppointment(): Promise<void> {
    if (!this.requiredFieldsFilled([this.appointmentForm.firstName, this.appointmentForm.lastName, this.appointmentForm.phone])) {
      alert('Veuillez remplir au minimum prénom, nom et téléphone.');
      return;
    }

    try {
      await this.apiService.sendAppointment({
        ...this.appointmentForm,
        selectedDateLabel: this.selectedDateLabel,
        selectedSlot: this.selectedSlot,
      });
      this.goStep(4);
    } catch {
      alert('Le rendez-vous n’a pas pu être enregistré. Vérifiez le backend.');
    }
  }

  protected resetAppointment(): void {
    this.selectedDateKey = '';
    this.selectedDateLabel = '—';
    this.selectedSlot = '';
    this.appointmentForm.firstName = '';
    this.appointmentForm.lastName = '';
    this.appointmentForm.phone = '';
    this.appointmentForm.email = '';
    this.appointmentForm.subject = "Réservation d'un trajet";
    this.appointmentForm.notes = '';
    this.appointmentStep = 1;
    this.initCalendar();
  }

  protected buildSummary(): Array<{ label: string; value: string }> {
    return [
      { label: 'Date', value: this.selectedDateLabel },
      { label: 'Heure', value: this.selectedSlot },
      { label: 'Prénom', value: this.appointmentForm.firstName },
      { label: 'Nom', value: this.appointmentForm.lastName },
      { label: 'Téléphone', value: this.appointmentForm.phone },
      { label: 'E-mail', value: this.appointmentForm.email || '—' },
      { label: 'Objet', value: this.appointmentForm.subject },
    ];
  }

  protected buildTariffRows(): Array<{ label: string; value: string }> {
    return [
      { label: 'Prise en charge', value: '2,60 €' },
      { label: 'Tarif A (jour, agglomération)', value: '1,21 €/km' },
      { label: 'Tarif B (nuit / périurbain)', value: '1,62 €/km' },
      { label: 'Attente / marche lente', value: '33,90 €/h' },
      { label: 'Aéroport / longue distance', value: 'Prix fixe' },
    ];
  }

  private initCalendar(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.renderCalendar();
  }

  private renderCalendar(): void {
    this.calendarLabel = `${this.months[this.currentMonth]} ${this.currentYear}`;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    let leadingEmptySlots = firstDay.getDay() - 1;
    if (leadingEmptySlots < 0) {
      leadingEmptySlots = 6;
    }

    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const cells: CalendarCell[] = [];

    for (let index = 0; index < leadingEmptySlots; index += 1) {
      cells.push({
        label: '',
        disabled: true,
        isToday: false,
        isSelected: false,
        isBlank: true,
      });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const weekday = date.getDay();
      const isWeekend = weekday === 0 || weekday === 6;
      const isPast = date < today;
      const dateKey = this.formatDateKey(date);

      cells.push({
        label: String(day),
        dateKey,
        disabled: isWeekend || isPast,
        isToday: date.getTime() === today.getTime(),
        isSelected: this.selectedDateKey === dateKey && !isWeekend && !isPast,
        isBlank: false,
      });
    }

    this.calendarCells = cells;
  }

  private formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatSelectedDate(dateKey: string): string {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return `${this.longDays[date.getDay()]} ${day} ${this.months[month - 1]} ${year}`;
  }

  private requiredFieldsFilled(values: string[]): boolean {
    return values.every((value) => value.trim().length > 0);
  }
}
