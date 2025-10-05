import { Globe } from './globe';
import { AudioManager } from './audio';
import { HotspotManager, Hotspot } from './hotspots';
import { NarrativeManager, NarrativeChapter } from './narrative';

export class UI {
  private timeSlider: HTMLInputElement;
  private timeLabel: HTMLSpanElement;
  private globe: Globe;
  private audio: AudioManager;
  private hotspots: HotspotManager;
  private narrative: NarrativeManager;
  private hotspotPanel: HTMLElement;
  private narrativePanel: HTMLElement;

  private months = [
    'January 2024', 'February 2024', 'March 2024', 'April 2024',
    'May 2024', 'June 2024', 'July 2024', 'August 2024',
    'September 2024', 'October 2024', 'November 2024', 'December 2024'
  ];

  constructor(
    globe: Globe,
    audio: AudioManager,
    hotspots: HotspotManager,
    narrative: NarrativeManager
  ) {
    this.globe = globe;
    this.audio = audio;
    this.hotspots = hotspots;
    this.narrative = narrative;

    this.timeSlider = document.getElementById('time-slider') as HTMLInputElement;
    this.timeLabel = document.getElementById('time-label') as HTMLSpanElement;
    this.hotspotPanel = document.getElementById('hotspot-panel')!;
    this.narrativePanel = document.getElementById('narrative-panel')!;

    this.setupEventListeners();
    this.setupHotspotCallbacks();
    this.setupNarrativeCallbacks();
  }

  private setupEventListeners(): void {
    // Time slider with audio feedback
    this.timeSlider.addEventListener('input', this.onTimeChange.bind(this));
    
    // Narrative button
    const narrativeBtn = document.getElementById('narrative-button');
    if (narrativeBtn) {
      narrativeBtn.addEventListener('click', () => {
        if (this.narrative.isNarrativePlaying()) {
          this.narrative.stopNarrative();
          narrativeBtn.textContent = '▶ Start Story';
        } else {
          this.narrative.startNarrative();
          narrativeBtn.textContent = '⏸ Pause Story';
        }
      });
    }

    // Close hotspot panel
    const closeBtn = document.getElementById('close-hotspot');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hotspotPanel.classList.remove('visible');
      });
    }
  }

  private setupHotspotCallbacks(): void {
    this.hotspots.setOnHotspotClick((hotspot: Hotspot) => {
      this.displayHotspotData(hotspot);
    });
  }

  private setupNarrativeCallbacks(): void {
    this.narrative.setOnChapterChange((chapter: NarrativeChapter) => {
      this.displayNarrativeChapter(chapter);
    });
  }

  private onTimeChange(event: Event): void {
    const index = parseInt((event.target as HTMLInputElement).value);
    this.timeLabel.textContent = this.months[index];
    this.globe.setTimeIndex(index);
    
    // Play audio feedback
    const intensity = Math.abs(index - parseInt(this.timeSlider.value)) * 0.3;
    this.audio.playCurrentWhoosh(intensity);
  }

  private displayHotspotData(hotspot: Hotspot): void {
    const panel = this.hotspotPanel;
    panel.classList.add('visible');

    const title = panel.querySelector('.hotspot-title') as HTMLElement;
    const description = panel.querySelector('.hotspot-description') as HTMLElement;
    const chart = panel.querySelector('.hotspot-chart') as HTMLElement;

    title.textContent = hotspot.data.name;
    description.textContent = hotspot.data.data.description;

    // Generate simple ASCII chart
    if (hotspot.data.data.bleachingTrend) {
      chart.innerHTML = this.generateChart(
        'Coral Bleaching (%)',
        hotspot.data.data.bleachingTrend
      );
    } else if (hotspot.data.data.seaLevelRise) {
      chart.innerHTML = this.generateChart(
        'Sea Level Rise (cm)',
        hotspot.data.data.seaLevelRise
      );
    } else if (hotspot.data.data.temperature) {
      chart.innerHTML = this.generateChart(
        'Temperature (°C)',
        hotspot.data.data.temperature
      );
    }
  }

  private generateChart(label: string, data: number[]): string {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    let html = `<div class="chart-label">${label}</div>`;
    html += '<div class="chart-bars">';

    data.forEach((value, index) => {
      const height = ((value - min) / range) * 100;
      const color = this.getColorForValue(value, min, max);
      html += `
        <div class="chart-bar" style="height: ${height}%; background: ${color};" 
             title="${this.months[index]}: ${value.toFixed(1)}">
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  private getColorForValue(value: number, min: number, max: number): string {
    const normalized = (value - min) / (max - min);
    const hue = (1 - normalized) * 240; // Blue (240) to Red (0)
    return `hsl(${hue}, 70%, 50%)`;
  }

  private displayNarrativeChapter(chapter: NarrativeChapter): void {
    const panel = this.narrativePanel;
    panel.classList.add('visible');

    const title = panel.querySelector('.narrative-title') as HTMLElement;
    const text = panel.querySelector('.narrative-text') as HTMLElement;
    const theme = panel.querySelector('.narrative-theme') as HTMLElement;

    title.textContent = chapter.title;
    text.textContent = chapter.text;
    theme.textContent = `Theme: ${this.formatTheme(chapter.theme)}`;

    // Auto-hide after duration
    setTimeout(() => {
      panel.classList.remove('visible');
    }, chapter.duration * 1000);
  }

  private formatTheme(theme: string): string {
    return theme
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
