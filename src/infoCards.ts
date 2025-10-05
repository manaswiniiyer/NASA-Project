/**
 * Info Cards System
 * Creates detailed information overlays for zones, corals, and data points
 * Includes "Learn More" and "Take Action" buttons
 */

export interface InfoCardData {
  title: string;
  subtitle?: string;
  description: string;
  stats?: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[];
  facts?: string[];
  learnMoreUrl?: string;
  actionUrl?: string;
  imageUrl?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export class InfoCardSystem {
  private container: HTMLElement;
  private currentCard: HTMLElement | null = null;
  private onClose?: () => void;

  constructor() {
    this.container = document.getElementById('info-cards-container') || this.createContainer();
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'info-cards-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 200;
    `;
    document.body.appendChild(container);
    return container;
  }

  /**
   * Show an info card
   */
  public showCard(data: InfoCardData): void {
    // Close existing card
    if (this.currentCard) {
      this.closeCard();
    }

    const card = this.createCardElement(data);
    this.container.appendChild(card);
    this.currentCard = card;

    // Animate in
    setTimeout(() => {
      card.classList.add('visible');
    }, 10);
  }

  /**
   * Close current card
   */
  public closeCard(): void {
    if (!this.currentCard) return;

    this.currentCard.classList.remove('visible');
    
    setTimeout(() => {
      if (this.currentCard) {
        this.container.removeChild(this.currentCard);
        this.currentCard = null;
      }
      
      if (this.onClose) {
        this.onClose();
      }
    }, 300);
  }

  /**
   * Set callback for when card closes
   */
  public setOnClose(callback: () => void): void {
    this.onClose = callback;
  }

  private createCardElement(data: InfoCardData): HTMLElement {
    const card = document.createElement('div');
    card.className = 'info-card';
    card.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      background: linear-gradient(135deg, rgba(0, 20, 40, 0.98), rgba(0, 40, 80, 0.98));
      backdrop-filter: blur(20px);
      border-radius: 1.5rem;
      padding: 2.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      border: 2px solid ${this.getSeverityColor(data.severity)};
      pointer-events: all;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom: 1.5rem;';
    
    if (data.severity) {
      const badge = document.createElement('span');
      badge.textContent = data.severity.toUpperCase();
      badge.style.cssText = `
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: ${this.getSeverityColor(data.severity)};
        color: #fff;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
        letter-spacing: 0.1em;
      `;
      header.appendChild(badge);
    }

    const title = document.createElement('h2');
    title.textContent = data.title;
    title.style.cssText = `
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `;
    header.appendChild(title);

    if (data.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.textContent = data.subtitle;
      subtitle.style.cssText = `
        font-size: 1rem;
        color: #94a3b8;
        margin: 0;
      `;
      header.appendChild(subtitle);
    }

    card.appendChild(header);

    // Description
    const description = document.createElement('p');
    description.textContent = data.description;
    description.style.cssText = `
      font-size: 1.05rem;
      line-height: 1.7;
      color: #e2e8f0;
      margin-bottom: 1.5rem;
    `;
    card.appendChild(description);

    // Stats
    if (data.stats && data.stats.length > 0) {
      const statsContainer = document.createElement('div');
      statsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      `;

      data.stats.forEach(stat => {
        const statBox = document.createElement('div');
        statBox.style.cssText = `
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const label = document.createElement('div');
        label.textContent = stat.label;
        label.style.cssText = `
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        `;

        const value = document.createElement('div');
        value.textContent = stat.value;
        value.style.cssText = `
          font-size: 1.5rem;
          font-weight: 700;
          color: #60a5fa;
        `;

        if (stat.trend) {
          const trend = document.createElement('span');
          trend.textContent = stat.trend === 'up' ? ' ↑' : stat.trend === 'down' ? ' ↓' : ' →';
          trend.style.color = stat.trend === 'up' ? '#ef4444' : stat.trend === 'down' ? '#10b981' : '#94a3b8';
          value.appendChild(trend);
        }

        statBox.appendChild(label);
        statBox.appendChild(value);
        statsContainer.appendChild(statBox);
      });

      card.appendChild(statsContainer);
    }

    // Facts
    if (data.facts && data.facts.length > 0) {
      const factsTitle = document.createElement('h3');
      factsTitle.textContent = 'Key Facts';
      factsTitle.style.cssText = `
        font-size: 1.25rem;
        color: #60a5fa;
        margin: 1.5rem 0 1rem 0;
      `;
      card.appendChild(factsTitle);

      const factsList = document.createElement('ul');
      factsList.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0 0 1.5rem 0;
      `;

      data.facts.forEach(fact => {
        const li = document.createElement('li');
        li.textContent = fact;
        li.style.cssText = `
          padding: 0.75rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: #cbd5e1;
          line-height: 1.6;
        `;
        li.style.setProperty('content', '"•"');
        li.style.setProperty('position', 'absolute');
        li.style.setProperty('left', '0');
        li.style.setProperty('color', '#60a5fa');
        
        const bullet = document.createElement('span');
        bullet.textContent = '•';
        bullet.style.cssText = `
          position: absolute;
          left: 0;
          color: #60a5fa;
          font-size: 1.5rem;
        `;
        li.insertBefore(bullet, li.firstChild);
        
        factsList.appendChild(li);
      });

      card.appendChild(factsList);
    }

    // Action buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    `;

    if (data.learnMoreUrl) {
      const learnBtn = this.createButton('Learn More', data.learnMoreUrl, '#3b82f6');
      buttonContainer.appendChild(learnBtn);
    }

    if (data.actionUrl) {
      const actionBtn = this.createButton('Take Action', data.actionUrl, '#ec4899');
      buttonContainer.appendChild(actionBtn);
    }

    const closeBtn = this.createButton('Close', null, '#475569');
    closeBtn.addEventListener('click', () => this.closeCard());
    buttonContainer.appendChild(closeBtn);

    card.appendChild(buttonContainer);

    // Make card visible class
    card.classList.add('info-card-hidden');
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    return card;
  }

  private createButton(text: string, url: string | null, color: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      padding: 0.75rem 1.5rem;
      background: ${color};
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      flex: 1;
      min-width: 120px;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = `0 6px 20px ${color}80`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = 'none';
    });

    if (url) {
      button.addEventListener('click', () => {
        window.open(url, '_blank');
      });
    }

    return button;
  }

  private getSeverityColor(severity?: string): string {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#eab308';
      case 'low': return '#10b981';
      default: return '#60a5fa';
    }
  }

  // ==================== PRE-DEFINED INFO CARDS ====================

  public static getCoralReefCard(): InfoCardData {
    return {
      title: 'Coral Reef Crisis',
      subtitle: 'The Rainforests of the Sea',
      description: 'Coral reefs support 25% of all marine species yet cover less than 1% of the ocean floor. Rising temperatures cause mass bleaching events, threatening entire ecosystems.',
      severity: 'critical',
      stats: [
        { label: 'Global Coral Loss', value: '50%', trend: 'up' },
        { label: 'Bleaching Events', value: '6x', trend: 'up' },
        { label: 'Species Supported', value: '25%', trend: 'down' }
      ],
      facts: [
        'Corals bleach when water temperatures exceed 1-2°C above normal',
        'The Great Barrier Reef has lost 50% of its coral cover since 1995',
        'Coral reefs provide $375 billion in ecosystem services annually',
        'At current rates, 90% of reefs could disappear by 2050'
      ],
      learnMoreUrl: 'https://coralreefwatch.noaa.gov/',
      actionUrl: 'https://www.coral.org/en/get-involved/'
    };
  }

  public static getSeaLevelCard(): InfoCardData {
    return {
      title: 'Rising Seas',
      subtitle: 'The Vanishing Coastline',
      description: 'Sea levels are rising at 3.4mm per year due to thermal expansion and melting ice sheets. By 2100, 200 million people could be displaced from coastal areas.',
      severity: 'critical',
      stats: [
        { label: 'Current Rise Rate', value: '3.4mm/yr', trend: 'up' },
        { label: '2100 Projection', value: '26-82cm', trend: 'up' },
        { label: 'People at Risk', value: '200M', trend: 'up' }
      ],
      facts: [
        'Sea levels have risen 21-24cm since 1880',
        'The rate of rise is accelerating: 3.4mm/year vs 1.4mm/year in 1900',
        'Low-lying island nations like Maldives face existential threats',
        'Coastal cities from Miami to Mumbai will face increased flooding'
      ],
      learnMoreUrl: 'https://sealevel.nasa.gov/',
      actionUrl: 'https://www.un.org/sustainabledevelopment/oceans/'
    };
  }

  public static getOceanCurrentCard(): InfoCardData {
    return {
      title: 'Slowing Currents',
      subtitle: 'Earth\'s Climate Conveyor Belt',
      description: 'The Atlantic Meridional Overturning Circulation (AMOC) has weakened by 15% since 1950. This slowdown could trigger abrupt climate shifts across the Northern Hemisphere.',
      severity: 'high',
      stats: [
        { label: 'AMOC Weakening', value: '15%', trend: 'down' },
        { label: 'Gulf Stream Speed', value: '-10%', trend: 'down' },
        { label: 'Risk Level', value: 'High', trend: 'up' }
      ],
      facts: [
        'Ocean currents transport heat from equator to poles',
        'AMOC collapse could cool Europe by 5-10°C',
        'Weakening currents disrupt weather patterns globally',
        'Changes could be irreversible within decades'
      ],
      learnMoreUrl: 'https://www.noaa.gov/education/resource-collections/ocean-coasts/ocean-currents',
      actionUrl: 'https://www.climaterealityproject.org/take-action'
    };
  }

  public static getMarineLifeCard(): InfoCardData {
    return {
      title: 'Shifting Ecosystems',
      subtitle: 'Voices from the Deep',
      description: 'Marine species are migrating poleward at 72km per decade. Warming waters force fish, whales, and other marine life to seek cooler habitats, disrupting food webs.',
      severity: 'high',
      stats: [
        { label: 'Migration Rate', value: '72km/decade', trend: 'up' },
        { label: 'Species Affected', value: '80%', trend: 'up' },
        { label: 'Fishery Impact', value: 'Severe', trend: 'up' }
      ],
      facts: [
        'Whales sequester 33 tons of CO₂ over their lifetime',
        'Warming disrupts krill populations, the base of marine food webs',
        'Commercial fisheries lose $10 billion annually to shifting stocks',
        'Arctic species face habitat loss as sea ice melts'
      ],
      learnMoreUrl: 'https://www.worldwildlife.org/initiatives/protecting-whales-dolphins',
      actionUrl: 'https://www.worldwildlife.org/how-to-help'
    };
  }

  public static getPollutionCard(): InfoCardData {
    return {
      title: 'Ocean Pollution',
      subtitle: 'Plastic Seas',
      description: 'The Great Pacific Garbage Patch spans 1.6 million km². Microplastics have been found in the deepest trenches and in 90% of seabirds.',
      severity: 'critical',
      stats: [
        { label: 'Plastic in Ocean', value: '150M tons', trend: 'up' },
        { label: 'Annual Addition', value: '8M tons', trend: 'up' },
        { label: 'Seabirds Affected', value: '90%', trend: 'up' }
      ],
      facts: [
        'By 2050, there could be more plastic than fish in the ocean by weight',
        'Microplastics enter the food chain, affecting human health',
        'Ocean pollution kills 1 million seabirds and 100,000 marine mammals annually',
        'Only 9% of plastic ever produced has been recycled'
      ],
      learnMoreUrl: 'https://oceanconservancy.org/trash-free-seas/',
      actionUrl: 'https://oceanconservancy.org/take-action/'
    };
  }
}

export default new InfoCardSystem();
