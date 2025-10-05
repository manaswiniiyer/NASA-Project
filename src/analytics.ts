/**
 * Analytics & Visualization System
 * Creates floating holographic charts and infographics in 3D space
 */

import * as THREE from 'three';
import dataService from './dataService';

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: { label: string; value: number; color?: string }[];
  position: THREE.Vector3;
  size: { width: number; height: number };
}

export class AnalyticsVisualization {
  private scene: THREE.Scene;
  private charts: Map<string, THREE.Group> = new Map();
  private canvasCache: Map<string, HTMLCanvasElement> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Create a floating 3D chart
   */
  public async createChart(id: string, config: ChartConfig): Promise<THREE.Group> {
    const group = new THREE.Group();
    group.name = `chart_${id}`;

    // Create canvas for chart
    const canvas = this.createChartCanvas(config);
    this.canvasCache.set(id, canvas);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create plane mesh
    const geometry = new THREE.PlaneGeometry(config.size.width, config.size.height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Add holographic glow effect
    this.addGlowEffect(group, config.size);

    // Position
    group.position.copy(config.position);
    group.lookAt(0, 0, 0); // Face center

    this.scene.add(group);
    this.charts.set(id, group);

    return group;
  }

  /**
   * Create temperature trend line chart
   */
  public async createTemperatureTrendChart(position: THREE.Vector3): Promise<THREE.Group> {
    const trends = await dataService.getTemperatureTrends();
    
    return this.createChart('temperature_trend', {
      type: 'line',
      title: 'Global Ocean Temperature (2000-2024)',
      data: trends.map(t => ({
        label: t.year.toString(),
        value: t.temperature
      })),
      position,
      size: { width: 2, height: 1.2 }
    });
  }

  /**
   * Create pollution bar chart
   */
  public async createPollutionChart(position: THREE.Vector3): Promise<THREE.Group> {
    const pollution = await dataService.getPollutionData();
    
    return this.createChart('pollution', {
      type: 'bar',
      title: 'Top 5 Ocean Pollution Hotspots',
      data: pollution.map(p => ({
        label: p.location.substring(0, 15),
        value: p.pollutionIndex,
        color: this.getPollutionColor(p.pollutionIndex)
      })),
      position,
      size: { width: 2.5, height: 1.5 }
    });
  }

  /**
   * Create coral loss pie chart
   */
  public async createCoralLossPieChart(position: THREE.Vector3): Promise<THREE.Group> {
    return this.createChart('coral_loss', {
      type: 'pie',
      title: 'Global Coral Reef Status',
      data: [
        { label: 'Lost', value: 50, color: '#ef4444' },
        { label: 'Degraded', value: 30, color: '#f59e0b' },
        { label: 'Healthy', value: 20, color: '#10b981' }
      ],
      position,
      size: { width: 1.8, height: 1.8 }
    });
  }

  /**
   * Create future projection area chart
   */
  public async createProjectionChart(position: THREE.Vector3): Promise<THREE.Group> {
    const projections = await dataService.getFutureProjections();
    
    return this.createChart('projections', {
      type: 'area',
      title: 'Sea Level Rise Projection (2025-2050)',
      data: projections.seaLevel.slice(0, 10).map(p => ({
        label: p.year.toString(),
        value: p.value
      })),
      position,
      size: { width: 2.2, height: 1.3 }
    });
  }

  /**
   * Create all analytics charts at once
   */
  public async createAllCharts(): Promise<void> {
    // Position charts around the globe
    await this.createTemperatureTrendChart(new THREE.Vector3(2.5, 1, 0));
    await this.createPollutionChart(new THREE.Vector3(-2.5, 1, 0));
    await this.createCoralLossPieChart(new THREE.Vector3(0, 2, 2));
    await this.createProjectionChart(new THREE.Vector3(0, -1.5, 2.5));
  }

  /**
   * Toggle chart visibility
   */
  public toggleChart(id: string, visible: boolean): void {
    const chart = this.charts.get(id);
    if (chart) {
      chart.visible = visible;
    }
  }

  /**
   * Update chart data (for real-time updates)
   */
  public updateChart(id: string, newData: { label: string; value: number }[]): void {
    const canvas = this.canvasCache.get(id);
    const chart = this.charts.get(id);
    
    if (!canvas || !chart) return;

    // Redraw canvas
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update texture
    const mesh = chart.children[0] as THREE.Mesh;
    const material = mesh.material as THREE.MeshBasicMaterial;
    if (material.map) {
      material.map.needsUpdate = true;
    }
  }

  /**
   * Animate charts (floating, rotating)
   */
  public animateCharts(deltaTime: number): void {
    this.charts.forEach((chart, id) => {
      // Gentle floating animation
      chart.position.y += Math.sin(Date.now() * 0.001 + chart.position.x) * 0.0005;
      
      // Slow rotation to face camera
      chart.rotation.y += deltaTime * 0.1;
    });
  }

  // ==================== PRIVATE METHODS ====================

  private createChartCanvas(config: ChartConfig): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = 'rgba(0, 20, 40, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Title
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(config.title, canvas.width / 2, 80);

    // Draw chart based on type
    switch (config.type) {
      case 'line':
        this.drawLineChart(ctx, config.data, canvas);
        break;
      case 'bar':
        this.drawBarChart(ctx, config.data, canvas);
        break;
      case 'pie':
        this.drawPieChart(ctx, config.data, canvas);
        break;
      case 'area':
        this.drawAreaChart(ctx, config.data, canvas);
        break;
    }

    return canvas;
  }

  private drawLineChart(
    ctx: CanvasRenderingContext2D,
    data: { label: string; value: number }[],
    canvas: HTMLCanvasElement
  ): void {
    const padding = 100;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2 - 100;
    const startX = padding;
    const startY = padding + 100;

    // Find min/max
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    // Draw axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + chartHeight);
    ctx.lineTo(startX + chartWidth, startY + chartHeight);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();

    data.forEach((point, i) => {
      const x = startX + (i / (data.length - 1)) * chartWidth;
      const y = startY + chartHeight - ((point.value - minValue) / range) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#60a5fa';
    data.forEach((point, i) => {
      const x = startX + (i / (data.length - 1)) * chartWidth;
      const y = startY + chartHeight - ((point.value - minValue) / range) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Labels (every 5th year)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px Inter';
    ctx.textAlign = 'center';
    data.forEach((point, i) => {
      if (i % 5 === 0 || i === data.length - 1) {
        const x = startX + (i / (data.length - 1)) * chartWidth;
        ctx.fillText(point.label, x, startY + chartHeight + 40);
      }
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const value = minValue + (range * i / 4);
      const y = startY + chartHeight - (i / 4) * chartHeight;
      ctx.fillText(value.toFixed(2) + '°C', startX - 20, y + 8);
    }
  }

  private drawBarChart(
    ctx: CanvasRenderingContext2D,
    data: { label: string; value: number; color?: string }[],
    canvas: HTMLCanvasElement
  ): void {
    const padding = 100;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2 - 100;
    const startX = padding;
    const startY = padding + 100;
    const barWidth = chartWidth / data.length * 0.7;
    const gap = chartWidth / data.length * 0.3;

    const maxValue = Math.max(...data.map(d => d.value));

    data.forEach((item, i) => {
      const x = startX + i * (barWidth + gap) + gap / 2;
      const height = (item.value / maxValue) * chartHeight;
      const y = startY + chartHeight - height;

      // Bar
      ctx.fillStyle = item.color || '#60a5fa';
      ctx.fillRect(x, y, barWidth, height);

      // Value label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 10);

      // X-axis label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px Inter';
      ctx.save();
      ctx.translate(x + barWidth / 2, startY + chartHeight + 30);
      ctx.rotate(-Math.PI / 6);
      ctx.fillText(item.label, 0, 0);
      ctx.restore();
    });
  }

  private drawPieChart(
    ctx: CanvasRenderingContext2D,
    data: { label: string; value: number; color?: string }[],
    canvas: HTMLCanvasElement
  ): void {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 50;
    const radius = 250;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach((item, i) => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      
      // Slice
      ctx.fillStyle = item.color || `hsl(${i * 120}, 70%, 50%)`;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Border
      ctx.strokeStyle = '#001428';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius + 80);
      const labelY = centerY + Math.sin(labelAngle) * (radius + 80);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${item.label}`, labelX, labelY);
      ctx.font = '28px Inter';
      ctx.fillText(`${item.value}%`, labelX, labelY + 35);

      currentAngle += sliceAngle;
    });
  }

  private drawAreaChart(
    ctx: CanvasRenderingContext2D,
    data: { label: string; value: number }[],
    canvas: HTMLCanvasElement
  ): void {
    const padding = 100;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2 - 100;
    const startX = padding;
    const startY = padding + 100;

    const maxValue = Math.max(...data.map(d => d.value));

    // Draw filled area
    const gradient = ctx.createLinearGradient(0, startY, 0, startY + chartHeight);
    gradient.addColorStop(0, 'rgba(96, 165, 250, 0.6)');
    gradient.addColorStop(1, 'rgba(96, 165, 250, 0.1)');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(startX, startY + chartHeight);

    data.forEach((point, i) => {
      const x = startX + (i / (data.length - 1)) * chartWidth;
      const y = startY + chartHeight - (point.value / maxValue) * chartHeight;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(startX + chartWidth, startY + chartHeight);
    ctx.closePath();
    ctx.fill();

    // Draw line on top
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();

    data.forEach((point, i) => {
      const x = startX + (i / (data.length - 1)) * chartWidth;
      const y = startY + chartHeight - (point.value / maxValue) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px Inter';
    ctx.textAlign = 'center';
    data.forEach((point, i) => {
      if (i % 2 === 0) {
        const x = startX + (i / (data.length - 1)) * chartWidth;
        ctx.fillText(point.label, x, startY + chartHeight + 40);
      }
    });
  }

  private addGlowEffect(group: THREE.Group, size: { width: number; height: number }): void {
    const glowGeometry = new THREE.PlaneGeometry(size.width * 1.1, size.height * 1.1);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.01;
    group.add(glow);
  }

  private getPollutionColor(index: number): string {
    if (index >= 90) return '#ef4444'; // Red
    if (index >= 75) return '#f59e0b'; // Orange
    if (index >= 50) return '#eab308'; // Yellow
    return '#10b981'; // Green
  }

  /**
   * Cleanup
   */
  public dispose(): void {
    this.charts.forEach(chart => {
      this.scene.remove(chart);
    });
    this.charts.clear();
    this.canvasCache.clear();
  }
}
