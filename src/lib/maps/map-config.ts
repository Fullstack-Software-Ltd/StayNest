// Map configuration and constants
export const MAP_CONFIG = {
  // CartoDB Voyager - A more detailed and colored premium tile style
  TILE_LAYER: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  
  // Esri World Imagery - High resolution satellite imagery
  SATELLITE_TILE_LAYER: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  SATELLITE_ATTRIBUTION: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',

  DEFAULT_CENTER: [-1.9441, 30.0619] as [number, number], // Kigali, Rwanda
  DEFAULT_ZOOM: 14,
  PROPERTY_ZOOM: 16,
}

// Custom map styles (optional, but Leaflet usually handles this via CSS)
export const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem',
  overflow: 'hidden',
  zIndex: 0, // Ensure it doesn't overlap higher elements like headers
}
