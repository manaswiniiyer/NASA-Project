/**
 * Data Service - Fetches and manages ocean data from NASA/NOAA APIs
 * Supports both live API calls and cached/mock data fallback
 */

export interface OceanDataPoint {
  date: string;
  value: number;
  lat?: number;
  lon?: number;
}

export interface CoralBleachingData {
  location: string;
  lat: number;
  lon: number;
  bleachingPercentage: number;
  dhw: number; // Degree Heating Weeks
  alertLevel: 'watch' | 'warning' | 'alert_level_1' | 'alert_level_2';
}

export interface SeaLevelData {
  year: number;
  globalMean: number; // mm
  uncertainty: number;
}

export interface BiodiversityZone {
  name: string;
  lat: number;
  lon: number;
  species: string[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  migrationPattern?: string;
}

export class DataService {
  private static instance: DataService;
  private cache: Map<string, any> = new Map();
  private readonly CACHE_DURATION = 3600000; // 1 hour

  // NASA Earthdata API (requires authentication)
  private readonly NASA_API_KEY = 'DEMO_KEY'; // Replace with real key
  private readonly NASA_BASE_URL = 'https://api.nasa.gov/planetary';
  
  // NOAA Coral Reef Watch
  private readonly NOAA_CRW_URL = 'https://coralreefwatch.noaa.gov/product/5km/v3.1/json';

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  /**
   * Fetch Sea Surface Temperature data
   * Falls back to mock data if API fails
   */
  public async getSST(startDate: string, endDate: string): Promise<OceanDataPoint[]> {
    const cacheKey = `sst_${startDate}_${endDate}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Try NASA MODIS SST data
      // Note: This is a simplified example - real implementation needs proper authentication
      const response = await fetch(
        `${this.NASA_BASE_URL}/earth/temperature?begin=${startDate}&end=${endDate}&api_key=${this.NASA_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        this.cache.set(cacheKey, data);
        return data;
      }
    } catch (error) {
      console.warn('NASA API failed, using mock data:', error);
    }

    // Fallback to mock data
    return this.getMockSSTData(startDate, endDate);
  }

  /**
   * Fetch Coral Bleaching data from NOAA Coral Reef Watch
   */
  public async getCoralBleachingData(): Promise<CoralBleachingData[]> {
    const cacheKey = 'coral_bleaching';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // NOAA Coral Reef Watch API
      const response = await fetch(`${this.NOAA_CRW_URL}/daily_alert_areas.json`);
      
      if (response.ok) {
        const data = await response.json();
        const processed = this.processCoralData(data);
        this.cache.set(cacheKey, processed);
        return processed;
      }
    } catch (error) {
      console.warn('NOAA API failed, using mock data:', error);
    }

    return this.getMockCoralData();
  }

  /**
   * Fetch Sea Level Rise data
   */
  public async getSeaLevelData(): Promise<SeaLevelData[]> {
    const cacheKey = 'sea_level';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Mock data based on IPCC projections
    const data = this.getMockSeaLevelData();
    this.cache.set(cacheKey, data);
    return data;
  }

  /**
   * Get Marine Biodiversity Zones
   */
  public async getBiodiversityZones(): Promise<BiodiversityZone[]> {
    const cacheKey = 'biodiversity';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const data = this.getMockBiodiversityData();
    this.cache.set(cacheKey, data);
    return data;
  }

  /**
   * Get Ocean Pollution Hotspots
   */
  public async getPollutionData(): Promise<{ location: string; pollutionIndex: number; type: string }[]> {
    return [
      { location: 'Great Pacific Garbage Patch', pollutionIndex: 95, type: 'Plastic' },
      { location: 'Mediterranean Sea', pollutionIndex: 78, type: 'Microplastics' },
      { location: 'Bay of Bengal', pollutionIndex: 82, type: 'Industrial' },
      { location: 'Gulf of Mexico', pollutionIndex: 71, type: 'Oil & Chemical' },
      { location: 'South China Sea', pollutionIndex: 85, type: 'Plastic & Industrial' }
    ];
  }

  /**
   * Get Historical Temperature Trends (2000-2024)
   */
  public async getTemperatureTrends(): Promise<{ year: number; temperature: number }[]> {
    const baseTemp = 17.5; // Global ocean average in 2000
    const trends = [];
    
    for (let year = 2000; year <= 2024; year++) {
      // Approximate 0.013°C per year warming
      const temp = baseTemp + (year - 2000) * 0.013 + (Math.random() * 0.05 - 0.025);
      trends.push({ year, temperature: parseFloat(temp.toFixed(3)) });
    }
    
    return trends;
  }

  /**
   * Get Future Projections (2025-2050)
   */
  public async getFutureProjections(): Promise<{
    temperature: { year: number; value: number }[];
    seaLevel: { year: number; value: number }[];
    coralLoss: { year: number; percentage: number }[];
  }> {
    const currentTemp = 17.8;
    const currentSeaLevel = 0;
    const currentCoralLoss = 50;

    return {
      temperature: Array.from({ length: 26 }, (_, i) => ({
        year: 2025 + i,
        value: currentTemp + (i * 0.025) // 0.025°C per year
      })),
      seaLevel: Array.from({ length: 26 }, (_, i) => ({
        year: 2025 + i,
        value: currentSeaLevel + (i * 3.4) // 3.4mm per year
      })),
      coralLoss: Array.from({ length: 26 }, (_, i) => ({
        year: 2025 + i,
        percentage: Math.min(100, currentCoralLoss + (i * 1.5))
      }))
    };
  }

  // ==================== MOCK DATA METHODS ====================

  private getMockSSTData(startDate: string, endDate: string): OceanDataPoint[] {
    const data: OceanDataPoint[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
      data.push({
        date: d.toISOString().split('T')[0],
        value: 17.5 + Math.random() * 3 + (d.getMonth() / 12) * 2
      });
    }
    
    return data;
  }

  private getMockCoralData(): CoralBleachingData[] {
    return [
      {
        location: 'Great Barrier Reef',
        lat: -18.2871,
        lon: 147.6992,
        bleachingPercentage: 93,
        dhw: 12.5,
        alertLevel: 'alert_level_2'
      },
      {
        location: 'Caribbean Reefs',
        lat: 18.0,
        lon: -77.0,
        bleachingPercentage: 87,
        dhw: 10.2,
        alertLevel: 'alert_level_2'
      },
      {
        location: 'Maldives Reefs',
        lat: 3.2028,
        lon: 73.2207,
        bleachingPercentage: 78,
        dhw: 8.5,
        alertLevel: 'alert_level_1'
      },
      {
        location: 'Red Sea Reefs',
        lat: 20.0,
        lon: 38.0,
        bleachingPercentage: 45,
        dhw: 5.2,
        alertLevel: 'warning'
      }
    ];
  }

  private getMockSeaLevelData(): SeaLevelData[] {
    const data: SeaLevelData[] = [];
    let level = -50; // Start from 1993 baseline
    
    for (let year = 1993; year <= 2024; year++) {
      level += 3.4; // 3.4mm per year
      data.push({
        year,
        globalMean: parseFloat(level.toFixed(1)),
        uncertainty: 0.4
      });
    }
    
    return data;
  }

  private getMockBiodiversityData(): BiodiversityZone[] {
    return [
      {
        name: 'Coral Triangle',
        lat: -5.0,
        lon: 120.0,
        species: ['Green Sea Turtle', 'Whale Shark', 'Manta Ray', 'Clownfish'],
        threatLevel: 'critical',
        migrationPattern: 'Seasonal north-south movement'
      },
      {
        name: 'Antarctic Waters',
        lat: -70.0,
        lon: 0.0,
        species: ['Emperor Penguin', 'Antarctic Krill', 'Leopard Seal', 'Blue Whale'],
        threatLevel: 'high',
        migrationPattern: 'Shifting poleward due to warming'
      },
      {
        name: 'North Atlantic',
        lat: 50.0,
        lon: -30.0,
        species: ['Humpback Whale', 'Atlantic Cod', 'Bluefin Tuna', 'Puffin'],
        threatLevel: 'medium',
        migrationPattern: 'Earlier spring migration'
      }
    ];
  }

  private processCoralData(rawData: any): CoralBleachingData[] {
    // Process NOAA JSON format
    // This is a placeholder - actual implementation depends on API structure
    return this.getMockCoralData();
  }

  /**
   * Clear cache (useful for testing)
   */
  public clearCache(): void {
    this.cache.clear();
  }
}

export default DataService.getInstance();
