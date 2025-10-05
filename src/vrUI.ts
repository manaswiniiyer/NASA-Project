/**
 * VR UI System
 * Creates 3D UI panels, menus, and tooltips for VR mode
 */

import * as THREE from 'three';

export interface VRUIPanel {
  id: string;
  title: string;
  content: string;
  position: THREE.Vector3;
  rotation?: THREE.Euler;
  width?: number;
  height?: number;
}

export class VRUI {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private panels: Map<string, THREE.Group> = new Map();
  private tooltips: Map<string, THREE.Sprite> = new Map();

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
  }

  /**
   * Create a 3D UI panel in VR space
   */
  public createPanel(config: VRUIPanel): THREE.Group {
    const group = new THREE.Group();
    group.name = `panel_${config.id}`;

    const width = config.width || 1.5;
    const height = config.height || 1.0;

    // Create canvas for panel content
    const canvas = this.createPanelCanvas(config.title, config.content, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create panel mesh
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Add border glow
    const borderGeometry = new THREE.PlaneGeometry(width * 1.05, height * 1.05);
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -0.01;
    group.add(border);

    // Position and rotation
    group.position.copy(config.position);
    if (config.rotation) {
      group.rotation.copy(config.rotation);
    } else {
      // Face camera by default
      group.lookAt(this.camera.position);
    }

    this.scene.add(group);
    this.panels.set(config.id, group);

    return group;
  }

  /**
   * Create canvas for panel content
   */
  private createPanelCanvas(title: string, content: string, width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const resolution = 512;
    canvas.width = resolution * width;
    canvas.height = resolution * height;
    const ctx = canvas.getContext('2d')!;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 20, 40, 0.98)');
    gradient.addColorStop(1, 'rgba(0, 40, 80, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Title
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 80);

    // Content
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '32px Inter, sans-serif';
    ctx.textAlign = 'left';
    
    const lines = this.wrapText(ctx, content, canvas.width - 80);
    let y = 150;
    lines.forEach(line => {
      ctx.fillText(line, 40, y);
      y += 45;
    });

    return canvas;
  }

  /**
   * Wrap text to fit canvas width
   */
  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    
    lines.push(currentLine.trim());
    return lines;
  }

  /**
   * Create floating tooltip
   */
  public createTooltip(id: string, text: string, position: THREE.Vector3): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = 'rgba(0, 20, 40, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    
    sprite.position.copy(position);
    sprite.scale.set(0.5, 0.125, 1);
    
    this.scene.add(sprite);
    this.tooltips.set(id, sprite);

    return sprite;
  }

  /**
   * Create floating menu
   */
  public createMenu(id: string, items: string[], position: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();
    const itemHeight = 0.15;
    const itemWidth = 0.8;
    const spacing = 0.05;

    items.forEach((item, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = 'rgba(0, 40, 80, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.PlaneGeometry(itemWidth, itemHeight);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = -index * (itemHeight + spacing);
      mesh.userData = { menuItem: item, index };
      
      group.add(mesh);
    });

    group.position.copy(position);
    this.scene.add(group);
    this.panels.set(id, group);

    return group;
  }

  /**
   * Create progress bar
   */
  public createProgressBar(id: string, progress: number, position: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();
    const width = 1.0;
    const height = 0.1;

    // Background
    const bgGeometry = new THREE.PlaneGeometry(width, height);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.8
    });
    const bg = new THREE.Mesh(bgGeometry, bgMaterial);
    group.add(bg);

    // Progress fill
    const fillGeometry = new THREE.PlaneGeometry(width * progress, height * 0.8);
    const fillMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.9
    });
    const fill = new THREE.Mesh(fillGeometry, fillMaterial);
    fill.position.x = -(width / 2) + (width * progress / 2);
    fill.position.z = 0.001;
    group.add(fill);

    // Border
    const borderGeometry = new THREE.EdgesGeometry(bgGeometry);
    const borderMaterial = new THREE.LineBasicMaterial({ color: 0x60a5fa });
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    border.position.z = 0.002;
    group.add(border);

    group.position.copy(position);
    this.scene.add(group);
    this.panels.set(id, group);

    return group;
  }

  /**
   * Update panel content
   */
  public updatePanel(id: string, title: string, content: string): void {
    const panel = this.panels.get(id);
    if (!panel) return;

    const mesh = panel.children[0] as THREE.Mesh;
    const material = mesh.material as THREE.MeshBasicMaterial;
    const geometry = mesh.geometry as THREE.PlaneGeometry;
    
    if (material.map) {
      // Get dimensions from geometry parameters (PlaneGeometry specific)
      const width = (geometry.parameters as any)?.width || 1.5;
      const height = (geometry.parameters as any)?.height || 1.0;
      
      const canvas = this.createPanelCanvas(title, content, width, height);
      const texture = new THREE.CanvasTexture(canvas);
      material.map = texture;
      material.needsUpdate = true;
    }
  }

  /**
   * Show/hide panel
   */
  public setVisibility(id: string, visible: boolean): void {
    const panel = this.panels.get(id);
    if (panel) {
      panel.visible = visible;
    }

    const tooltip = this.tooltips.get(id);
    if (tooltip) {
      tooltip.visible = visible;
    }
  }

  /**
   * Remove panel
   */
  public removePanel(id: string): void {
    const panel = this.panels.get(id);
    if (panel) {
      this.scene.remove(panel);
      this.panels.delete(id);
    }

    const tooltip = this.tooltips.get(id);
    if (tooltip) {
      this.scene.remove(tooltip);
      this.tooltips.delete(id);
    }
  }

  /**
   * Update all panels to face camera
   */
  public updatePanelsFaceCamera(): void {
    this.panels.forEach(panel => {
      panel.lookAt(this.camera.position);
    });
  }

  /**
   * Cleanup
   */
  public dispose(): void {
    this.panels.forEach(panel => {
      this.scene.remove(panel);
    });
    this.panels.clear();

    this.tooltips.forEach(tooltip => {
      this.scene.remove(tooltip);
    });
    this.tooltips.clear();
  }
}
