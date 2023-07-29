// export const API_URL = 'http://localhost:5000'
export const API_URL = 'http://194.87.219.172:5000'
export const SORT_TIMEOUT = 3000

// COLORS

export const COLORS = {
  BLUE: 'blue',
  GREEN: 'green',
  ORANGE: 'orange',
  PURPLE: 'purple',
  RED: 'red',
}
export const AVAIL_COLORS = Object.values(COLORS)

export const COLOR_OPTIONS = {
  BLUE: {
    main: '#2196F3',
    lighten: '#42A5F5',
    lightest: '#E3F2FD',
    darken: '#1565C0',
  },
  GREEN: {
    main: '#4CAF50',
    lighten: '#66BB6A',
    lightest: '#C8E6C9',
    darken: '#2E7D32',
  },
  ORANGE: {
    main: '#FF9800',
    lighten: '#FFB74D',
    lightest: '#FFE0B2',
    darken: '#EF6C00',
  },
  PURPLE: {
    main: '#9C27B0',
    lighten: '#CE93D8',
    lightest: '#E1BEE7',
    darken: '#6A1B9A',
  },
  RED: {
    main: '#F44336',
    lighten: '#EF5350',
    lightest: '#FFCDD2',
    darken: '#D32F2F',
  },
}

export type ColorsType = 'BLUE' | 'GREEN' | 'ORANGE' | 'PURPLE' | 'RED'
