/**
 * Voice Narration System
 * Uses Web Speech API for text-to-speech narration
 * Provides documentary-style voiceover for educational content
 */

export interface NarrationScript {
  id: string;
  text: string;
  duration?: number; // Auto-calculated if not provided
  voice?: string; // Specific voice name
  rate?: number; // Speech rate (0.1 - 10, default 1)
  pitch?: number; // Pitch (0 - 2, default 1)
  volume?: number; // Volume (0 - 1, default 1)
}

export class VoiceNarration {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isInitialized: boolean = false;
  private queue: NarrationScript[] = [];
  private onComplete?: () => void;
  private onStart?: (script: NarrationScript) => void;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoices();
  }

  /**
   * Initialize available voices
   */
  private async initializeVoices(): Promise<void> {
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synthesis.getVoices();
        if (this.voices.length > 0) {
          this.isInitialized = true;
          console.log(`🎙️ Voice Narration initialized with ${this.voices.length} voices`);
          this.logAvailableVoices();
          resolve();
        }
      };

      loadVoices();
      
      // Voices may load asynchronously
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = loadVoices;
      }
    });
  }

  /**
   * Get available voices
   */
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  /**
   * Get best voice for narration (prefer female, English, natural-sounding)
   */
  public getBestNarrationVoice(): SpeechSynthesisVoice | null {
    // Priority order
    const preferences = [
      'Google UK English Female',
      'Microsoft Zira',
      'Samantha',
      'Karen',
      'Moira',
      'Tessa'
    ];

    for (const name of preferences) {
      const voice = this.voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }

    // Fallback: any English female voice
    const femaleEnglish = this.voices.find(v => 
      v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
    );
    if (femaleEnglish) return femaleEnglish;

    // Last resort: first English voice
    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  /**
   * Speak a single narration script
   */
  public speak(script: NarrationScript): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error('Voice narration not initialized'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(script.text);
      
      // Set voice
      if (script.voice) {
        const voice = this.voices.find(v => v.name === script.voice);
        if (voice) utterance.voice = voice;
      } else {
        const bestVoice = this.getBestNarrationVoice();
        if (bestVoice) utterance.voice = bestVoice;
      }

      // Set parameters
      utterance.rate = script.rate || 0.9; // Slightly slower for clarity
      utterance.pitch = script.pitch || 1.0;
      utterance.volume = script.volume || 0.8;
      utterance.lang = 'en-US';

      // Event handlers
      utterance.onstart = () => {
        console.log(`🎙️ Narrating: "${script.text.substring(0, 50)}..."`);
        if (this.onStart) {
          this.onStart(script);
        }
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(event);
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  /**
   * Speak multiple scripts in sequence
   */
  public async speakQueue(scripts: NarrationScript[]): Promise<void> {
    this.queue = [...scripts];

    for (const script of this.queue) {
      await this.speak(script);
    }

    if (this.onComplete) {
      this.onComplete();
    }
  }

  /**
   * Pause current narration
   */
  public pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused narration
   */
  public resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Stop current narration
   */
  public stop(): void {
    this.synthesis.cancel();
    this.currentUtterance = null;
    this.queue = [];
  }

  /**
   * Check if currently speaking
   */
  public isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  /**
   * Set callback for when narration starts
   */
  public setOnStart(callback: (script: NarrationScript) => void): void {
    this.onStart = callback;
  }

  /**
   * Set callback for when queue completes
   */
  public setOnComplete(callback: () => void): void {
    this.onComplete = callback;
  }

  /**
   * Log available voices for debugging
   */
  private logAvailableVoices(): void {
    console.log('Available voices:');
    this.voices.forEach((voice, i) => {
      console.log(`  ${i + 1}. ${voice.name} (${voice.lang}) ${voice.default ? '[DEFAULT]' : ''}`);
    });
  }

  // ==================== PRE-DEFINED NARRATION SCRIPTS ====================

  /**
   * Get educational narration scripts for ocean data
   */
  public static getEducationalScripts(): NarrationScript[] {
    return [
      {
        id: 'intro',
        text: 'Welcome to Pulse of the Ocean. An immersive journey through our changing seas.',
        rate: 0.85,
        pitch: 1.1
      },
      {
        id: 'temperature',
        text: 'Since 1970, the ocean has absorbed 93 percent of excess heat from greenhouse gases. Global sea surface temperatures have risen by 0.13 degrees Celsius per decade.',
        rate: 0.9
      },
      {
        id: 'coral_bleaching',
        text: 'Coral reefs are dying. When water temperatures exceed 1 to 2 degrees Celsius above normal, corals expel their symbiotic algae, turning white. The Great Barrier Reef has experienced six mass bleaching events since 1998.',
        rate: 0.9
      },
      {
        id: 'sea_level',
        text: 'Sea levels are rising at 3.4 millimeters per year. By 2100, projections suggest a rise of 26 to 82 centimeters, threatening 200 million people living in coastal areas.',
        rate: 0.9
      },
      {
        id: 'circulation',
        text: 'The Gulf Stream, Earth\'s climate conveyor belt, is slowing. This weakening could disrupt weather patterns across Europe and North America, triggering extreme climate events.',
        rate: 0.9
      },
      {
        id: 'biodiversity',
        text: 'Marine species are migrating poleward at an average rate of 72 kilometers per decade. Warming waters force fish, whales, and other marine life to seek cooler habitats, disrupting ecosystems.',
        rate: 0.9
      },
      {
        id: 'pollution',
        text: 'The Great Pacific Garbage Patch spans 1.6 million square kilometers. Microplastics have been found in the deepest ocean trenches and in 90 percent of seabirds.',
        rate: 0.9
      },
      {
        id: 'future_2030',
        text: 'By 2030, if current trends continue, ocean temperatures will rise by another 0.3 degrees. Coral reefs could decline by 70 to 90 percent.',
        rate: 0.9
      },
      {
        id: 'future_2050',
        text: 'In 2050, sea levels are projected to rise by 26 centimeters globally. Coastal cities from Miami to Mumbai will face increased flooding. Arctic sea ice may vanish entirely in summer months.',
        rate: 0.9
      },
      {
        id: 'hope',
        text: 'But there is hope. Coral restoration projects are showing success. Marine protected areas are expanding. Renewable energy is replacing fossil fuels. Every action matters.',
        rate: 0.85,
        pitch: 1.05
      },
      {
        id: 'call_to_action',
        text: 'You can make a difference. Reduce your carbon footprint. Support ocean conservation organizations. Advocate for climate policy. Share this story. The ocean\'s pulse is our pulse. Protect it.',
        rate: 0.85,
        pitch: 1.1
      }
    ];
  }

  /**
   * Get hotspot-specific narration
   */
  public static getHotspotNarration(hotspotType: string): NarrationScript {
    const scripts: Record<string, NarrationScript> = {
      reef: {
        id: 'reef_narration',
        text: 'Coral reefs support 25 percent of all marine species, yet cover less than 1 percent of the ocean floor. Rising temperatures cause mass bleaching events, leaving reefs vulnerable to disease and death.',
        rate: 0.9
      },
      coastline: {
        id: 'coastline_narration',
        text: 'Coastal communities face an existential threat. Rising seas erode shorelines, flood cities, and contaminate freshwater supplies. Low-lying island nations like the Maldives could be uninhabitable by 2100.',
        rate: 0.9
      },
      current: {
        id: 'current_narration',
        text: 'Ocean currents regulate global climate by transporting heat from the equator to the poles. The Atlantic Meridional Overturning Circulation has weakened by 15 percent since 1950, with potentially catastrophic consequences.',
        rate: 0.9
      },
      whale: {
        id: 'whale_narration',
        text: 'Whales are climate engineers. A single whale sequesters 33 tons of carbon dioxide over its lifetime. But warming oceans disrupt their food sources, forcing longer migrations and threatening breeding cycles.',
        rate: 0.9
      }
    };

    return scripts[hotspotType] || scripts.reef;
  }

  /**
   * Get data-driven narration (dynamic based on values)
   */
  public static getDataNarration(
    dataType: 'temperature' | 'bleaching' | 'sea_level',
    value: number,
    location?: string
  ): NarrationScript {
    let text = '';

    switch (dataType) {
      case 'temperature':
        text = `${location ? `At ${location}, the` : 'The'} sea surface temperature is ${value.toFixed(1)} degrees Celsius. `;
        if (value > 29) {
          text += 'This is dangerously high for coral reefs, which begin bleaching above 29 degrees.';
        } else if (value > 27) {
          text += 'This elevated temperature stresses marine ecosystems.';
        } else {
          text += 'This is within normal range for healthy ocean conditions.';
        }
        break;

      case 'bleaching':
        text = `${location ? `${location} has experienced` : 'Coral bleaching has reached'} ${value.toFixed(0)} percent. `;
        if (value > 80) {
          text += 'This is catastrophic. Most corals will die without immediate intervention.';
        } else if (value > 50) {
          text += 'This is severe. Coral recovery will take decades, if possible at all.';
        } else if (value > 30) {
          text += 'This is significant. Corals are under stress and may not fully recover.';
        } else {
          text += 'This is concerning but manageable with conservation efforts.';
        }
        break;

      case 'sea_level':
        text = `Sea levels ${location ? `near ${location}` : 'globally'} have risen by ${value.toFixed(1)} centimeters. `;
        if (value > 15) {
          text += 'This threatens coastal infrastructure and displaces communities.';
        } else if (value > 10) {
          text += 'This increases flooding risk during storms and high tides.';
        } else {
          text += 'This is measurable but not yet catastrophic.';
        }
        break;
    }

    return {
      id: `data_${dataType}_${Date.now()}`,
      text,
      rate: 0.9
    };
  }
}

export default new VoiceNarration();
