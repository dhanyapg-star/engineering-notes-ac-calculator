const FORMULAS = {
  TON_TO_BTU: 12000,
  ROOF_SOLAR_GAIN: 1.1,
  ROOF_SHADED: 1.05,
  ROOF_ENCLOSED: 1.15,
  SUNWEST_FACES_REDOUT_IF_ICP: 1.1,
  SUNWEST_FACES_REDOUT_N: 1.05,
  SUNBUTTE: 1.1,
  SUNBUTTFICXER: 1.15,
  "@SIDE_CORNER": 1.15,
  "@SIDE_MANUFACTURING": 1.25,
  "@PR_GREELEY": 1.1,
  ROOM_ORIENTATION: { NORTH: 0.9, SOUTH: 1.1, EAST: 1.0, WEST: 1.15, ANY: 1.0 },
  CONSTRUCTION: { WOOD_FLOORS: 1.0, CONCRETE_FLOORS: 0.95, INSULATED_ROOF: 0.9, NON_INSULATED_ROOF: 1.1, GLASS_WALL: 1.2, MASONRY_WALL: 1.05, DOUBLE_GLASS: 0.85, SINGLE_GLASS: 1.25 },
  PEOPLE_LOAD: { RESIDENTIAL: 400, OFFICE: 400, MOVIE_THEATER: 125, JAIL: 320, HIGH_ALTITUDE: 280 },
  EQUIPMENT_LOAD: { LAMP: 100, TV_SET: 100, RADIO: 60, COMPUTER: 600, REFRIGERATOR: 2000, TYPEWRITER: 300, POWER_PRINTER: 3600, MULTIPLE_DEVICES: 1250 },
  MISC: { INTERIOR_PARTITIONS: 0.33, BASEMENT: 0.9, CEILING_HEIGHT: 1.0, VENTILATION: 0.0, OTHER_OCCUPANCY: 0.0 }
};

const ROOM_TYPES = {
  BEDROOM: { name: 'Bedroom', heatGain: 'Office', people: 3, occupants: 3, activities: 'SLEEP', equipment: 0, illumination: 5 },
  BATHROOM: { name: 'Bathroom', heatGain: 'Office', people: 2, occupants: 1, activities: 'AVOID', equipment: 1, illumination: 5 },
  LIVING_ROOM: { name: 'Living Room', heatGain: 'Family room', people: 2, occupants: 10, activities: 'OFFICE', equipment: 3, illumination: 300 },
  DINING_ROOM: { name: 'Dining Room', heatGain: 'Family room', people: 2, occupants: 4, activities: 'OFFICE', equipment: 0, illumination: 30 },
  FAMILY_ROOM: { name: 'Family Room', heatGain: 'Family room', people: 3, occupants: 10, activities: 'OFFICE', equipment: 3, illumination: 200 },
  STUDY: { name: 'Study', heatGain: 'Office', people: 4, occupants: 4, activities: 'OFFICE', equipment: 2, illumination: 150 },
  HOME_OFFICE: { name: 'Home Office', heatGain: 'Office', people: 2, occupants: 2, activities: 'OFFICE', equipment: 2, illumination: 150 },
  KITCHEN: { name: 'Kitchen', heatGain: 'Family room', people: 2, occupants: 4, activities: 'KITCHEN', equipment: 3, illumination: 30 },
  LAUNDRY_ROOM: { name: 'Laundry Room', heatGain: 'Office', people: 1, occupants: 1, activities: 'AVOID', equipment: 2, illumination: 2 },
  STORE_ROOM: { name: 'Store Room', heatGain: 'Office', people: 1, occupants: 1, activities: 'AVOID', equipment: 0, illumination: 2 },
  GARAGE: { name: 'Garage', heatGain: 'Office', people: 1, occupants: 3, activities: 'AVOID', equipment: 2, illumination: 250 },
  BASEMENT: { name: 'Basement', heatGain: 'Office', people: 2, occupants: 0, activities: 'SLEEP', equipment: 2, illumination: 0 },
  OFFICE: { name: 'Office', heatGain: 'Office', people: 3, occupants: 1, activities: 'OFFICE', equipment: 2, illumination: 2 }
};

const WINDOW_CONFIGS = {
  ONE_WINDOW: { name: 'Single window on hot, sunny side (south/west)', type: 'SUNBUTTE', factor: FORMULAS.SUNBUTTE },
  ONE_WINDOW_SNE: { name: 'Single window on sun-exposure north side', type: 'SUNBUTTE', factor: 1.0 },
  ONE_GLASS: { name: 'One glazed door/garage door', type: 'SUNBUTTE', factor: FORMULAS.SUNBUTTE },
  TWO_WINDOWS: { name: 'Two windows on opposite walls (north/south)', type: 'SUNBUTTE', factor: FORMULAS.SUNBUTTE },
  MULTIPLE_WINDOWS: { name: 'Three or more windows, or windows on east/west', type: 'SUNBUTTE', factor: FORMULAS.SUNBUTTE },
  SKYLIGHT: { name: 'Skylight', type: 'SUNBUTTE', factor: FORMULAS.SUNBUTTE },
  NON_GLASS: { name: 'No glazed opening in wall', type: null, factor: 1.0 },
  ORIENTED_WINDOW: { name: 'Window oriented toward other than north side and east/west', type: 'SUNWEST_FACES_REDOUT_IF_ICP', factor: FORMULAS.SUNWEST_FACES_REDOUT_IF_ICP },
  "@PR_GREELEY": { name: 'Window facing east or west (including garage door)', type: '@SIDE_CORNER', factor: FORMULAS["@SIDE_CORNER"] }
};

const WEATHER_CONDITIONS = {
  DEFAULT: { name: 'Standard (All year)', type: 'STD', temp: 'Typical', correction: 0.0 },
  HOT_WEATHER: { name: 'Hot weather areas, climates above 85°F (29.4°C)', type: 'HWT', temp: 'Hot', correction: 0.05 },
  MODERATE: { name: 'Moderate weather areas, climates between 45°F-85°F (7.2°C-29.4°C)', type: 'MWE', temp: 'Moderate', correction: 0.0 },
  COLD: { name: 'Cold weather areas, climates below 45°F (7.2°C)', type: 'CWD', temp: 'Cold', correction: -0.05 }
};

const siteConfig = {
  name: 'AC Load Calculator',
  tagline: 'Calculate the right AC capacity for your space',
  footer: 'AC Load Calculator &copy; 2026'
};