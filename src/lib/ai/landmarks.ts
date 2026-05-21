/**
 * Landmark data for Urugo Assistant
 * Provides approximate coordinates for popular Rwandan benchmarks to enable proximity search.
 */
export const RWANDAN_LANDMARKS = [
  // --- KIGALI ---
  { name: 'Amahoro National Stadium', slug: 'amahoro-stadium', lat: -1.9542, lng: 30.1147, type: 'stadium' },
  { name: 'BK Arena', slug: 'bk-arena', lat: -1.9515, lng: 30.1132, type: 'stadium' },
  { name: 'Kigali Pelé Stadium', slug: 'pele-stadium', lat: -1.9834, lng: 30.0617, type: 'stadium' },
  { name: 'Carnegie Mellon University Africa (CMU)', slug: 'cmu-africa', lat: -1.9333, lng: 30.1500, type: 'university' },
  { name: 'Kimironko Market', slug: 'kimironko-market', lat: -1.9442, lng: 30.1255, type: 'market' },
  { name: 'Kigali Heights', slug: 'kigali-heights', lat: -1.9515, lng: 30.0935, type: 'shopping' },
  { name: 'Kigali International Airport', slug: 'kigali-airport', lat: -1.9619, lng: 30.1351, type: 'airport' },
  { name: 'KFC Remera', slug: 'kfc-remera', lat: -1.9592, lng: 30.1167, type: 'restaurant' },
  { name: 'Kisimenti', slug: 'kisimenti', lat: -1.9585, lng: 30.1150, type: 'landmark' },
  { name: 'Kigali Convention Centre', slug: 'kcc', lat: -1.9519, lng: 30.0927, type: 'landmark' },
  { name: 'MTN Centre Nyarutarama', slug: 'mtn-centre', lat: -1.9365, lng: 30.1030, type: 'shopping' },
  { name: 'Kiyovu', slug: 'kiyovu', lat: -1.9480, lng: 30.0620, type: 'region' },
  { name: 'Nyarutarama', slug: 'nyarutarama', lat: -1.9320, lng: 30.0980, type: 'region' },

  // --- MUSANZE (NORTH) ---
  { name: 'Volcanoes National Park', slug: 'volcanoes-np', lat: -1.4746, lng: 29.4939, type: 'park' },
  { name: 'Musanze Caves', slug: 'musanze-caves', lat: -1.5034, lng: 29.6231, type: 'landmark' },
  { name: 'Ruhengeri (Musanze Town)', slug: 'musanze-town', lat: -1.4981, lng: 29.6350, type: 'region' },
  { name: 'Dian Fossey Gorilla Fund', slug: 'dian-fossey', lat: -1.4921, lng: 29.6385, type: 'museum' },

  // --- RUBAVU / GISENYI (WEST) ---
  { name: 'Lake Kivu Beach (Gisenyi)', slug: 'gisenyi-beach', lat: -1.7061, lng: 29.2555, type: 'beach' },
  { name: 'Rubavu Town', slug: 'rubavu', lat: -1.6961, lng: 29.2714, type: 'region' },
  { name: 'Pfunda Tea Factory', slug: 'pfunda-tea', lat: -1.7188, lng: 29.3245, type: 'landmark' },

  // --- KARONGI / KIBUYE (WEST) ---
  { name: 'Kibuye Waterfront', slug: 'kibuye-waterfront', lat: -2.0621, lng: 29.3492, type: 'beach' },
  { name: 'Environment Museum (Karongi)', slug: 'env-museum', lat: -2.0605, lng: 29.3512, type: 'museum' },

  // --- HUYE (SOUTH) ---
  { name: 'National Museum of Rwanda (Ethnographic)', slug: 'national-museum-huye', lat: -2.5976, lng: 29.7424, type: 'museum' },
  { name: 'University of Rwanda (Huye Campus)', slug: 'ur-huye', lat: -2.6025, lng: 29.7410, type: 'university' },
  { name: 'Huye Town', slug: 'huye', lat: -2.5972, lng: 29.7394, type: 'region' },

  // --- EASTERN PROVINCE ---
  { name: 'Akagera National Park Entrance', slug: 'akagera-np', lat: -1.8797, lng: 30.7060, type: 'park' },
  { name: 'Kayonza', slug: 'kayonza', lat: -1.9333, lng: 30.5000, type: 'region' },
  { name: 'Lake Muhazi', slug: 'lake-muhazi', lat: -1.8667, lng: 30.4167, type: 'landmark' },
];

export function findLandmarkSnippet(query: string) {
  const normalized = query.toLowerCase();
  return RWANDAN_LANDMARKS.find(l => 
    l.name.toLowerCase().includes(normalized) || 
    l.slug.toLowerCase().includes(normalized)
  );
}
