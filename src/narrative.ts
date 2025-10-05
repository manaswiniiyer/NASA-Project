import { AudioManager } from './audio';

export interface NarrativeChapter {
  id: string;
  title: string;
  theme: 'vanishing-coastline' | 'currents-of-change' | 'voices-from-deep';
  text: string;
  duration: number; // seconds
  cameraPosition?: { x: number; y: number; z: number };
  audioEvent?: 'whale' | 'storm' | 'current';
}

export class NarrativeManager {
  private chapters: NarrativeChapter[];
  private currentChapterIndex: number = -1;
  private isPlaying: boolean = false;
  private audio: AudioManager;
  private onChapterChange?: (chapter: NarrativeChapter) => void;
  private chapterTimeout?: number;

  constructor(audio: AudioManager) {
    this.audio = audio;
    this.chapters = this.createNarrativeChapters();
  }

  private createNarrativeChapters(): NarrativeChapter[] {
    return [
      {
        id: 'intro',
        title: 'The Pulse Begins',
        theme: 'voices-from-deep',
        text: 'Beneath the surface, the ocean breathes. A rhythm older than humanity, now racing toward an uncertain future.',
        duration: 8,
        cameraPosition: { x: 0, y: 0, z: 3 }
      },
      {
        id: 'warming-waters',
        title: 'Rising Temperatures',
        theme: 'currents-of-change',
        text: 'Since 1970, the ocean has absorbed 93% of excess heat from greenhouse gases. Each degree matters—coral reefs die at 2°C above normal.',
        duration: 10,
        audioEvent: 'current'
      },
      {
        id: 'coral-bleaching',
        title: 'Silent Reefs',
        theme: 'voices-from-deep',
        text: 'When water warms, coral expels its symbiotic algae—turning white, then dying. The Great Barrier Reef has bleached six times since 1998.',
        duration: 12,
        cameraPosition: { x: 1.5, y: -0.5, z: 2 }
      },
      {
        id: 'vanishing-shores',
        title: 'The Vanishing Coastline',
        theme: 'vanishing-coastline',
        text: 'Sea levels rise 3.4mm per year. By 2100, 200 million people could be displaced. Islands vanish. Cities flood. Coastlines retreat.',
        duration: 12,
        audioEvent: 'storm'
      },
      {
        id: 'ocean-currents',
        title: 'Currents of Change',
        theme: 'currents-of-change',
        text: 'The Gulf Stream slows. The Atlantic Meridional Overturning Circulation weakens. These currents regulate our climate—their disruption could trigger abrupt shifts.',
        duration: 14,
        audioEvent: 'current'
      },
      {
        id: 'marine-life',
        title: 'Voices from the Deep',
        theme: 'voices-from-deep',
        text: 'Whales migrate further. Fish populations shift poleward. Ecosystems unravel. The ocean\'s voice grows faint, but we can still listen.',
        duration: 12,
        audioEvent: 'whale',
        cameraPosition: { x: -1, y: 1, z: 2.5 }
      },
      {
        id: 'hope',
        title: 'A Choice',
        theme: 'currents-of-change',
        text: 'The ocean\'s pulse is our pulse. Every action—reducing emissions, protecting reefs, restoring coastlines—matters. The future is not written.',
        duration: 10
      },
      {
        id: 'call-to-action',
        title: 'What You Can Do',
        theme: 'vanishing-coastline',
        text: 'Support ocean conservation. Reduce your carbon footprint. Advocate for climate policy. Share this story. The ocean needs your voice.',
        duration: 10
      }
    ];
  }

  public startNarrative(): void {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.currentChapterIndex = -1;
    this.nextChapter();
    
    // Fade ambient audio during narration
    this.audio.setAmbientVolume(0.15);
  }

  public stopNarrative(): void {
    this.isPlaying = false;
    if (this.chapterTimeout) {
      clearTimeout(this.chapterTimeout);
    }
    this.audio.setAmbientVolume(0.3);
  }

  private nextChapter(): void {
    if (!this.isPlaying) return;
    
    this.currentChapterIndex++;
    
    if (this.currentChapterIndex >= this.chapters.length) {
      this.stopNarrative();
      return;
    }
    
    const chapter = this.chapters[this.currentChapterIndex];
    this.displayChapter(chapter);
    
    // Schedule next chapter
    this.chapterTimeout = window.setTimeout(() => {
      this.nextChapter();
    }, chapter.duration * 1000);
  }

  private displayChapter(chapter: NarrativeChapter): void {
    console.log(`📖 Chapter: ${chapter.title}`);
    console.log(`   ${chapter.text}`);
    
    // Trigger audio event if specified
    if (chapter.audioEvent) {
      switch (chapter.audioEvent) {
        case 'whale':
          this.audio.playWhaleCall(new THREE.Vector3(1, 0, 0));
          break;
        case 'storm':
          this.audio.playStormSurge(new THREE.Vector3(0, 0, 1), 1.0);
          break;
        case 'current':
          this.audio.playCurrentWhoosh(1.2);
          break;
      }
    }
    
    // Trigger callback
    if (this.onChapterChange) {
      this.onChapterChange(chapter);
    }
  }

  public setOnChapterChange(callback: (chapter: NarrativeChapter) => void): void {
    this.onChapterChange = callback;
  }

  public getCurrentChapter(): NarrativeChapter | null {
    if (this.currentChapterIndex >= 0 && this.currentChapterIndex < this.chapters.length) {
      return this.chapters[this.currentChapterIndex];
    }
    return null;
  }

  public skipToChapter(index: number): void {
    if (index >= 0 && index < this.chapters.length) {
      if (this.chapterTimeout) {
        clearTimeout(this.chapterTimeout);
      }
      this.currentChapterIndex = index - 1;
      this.nextChapter();
    }
  }

  public getChapters(): NarrativeChapter[] {
    return this.chapters;
  }

  public isNarrativePlaying(): boolean {
    return this.isPlaying;
  }
}

// Import THREE for Vector3
import * as THREE from 'three';
