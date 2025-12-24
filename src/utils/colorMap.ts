export interface ColorClasses {
  bg: string
  hover?: string
}

export const fullColorMap: Record<string, ColorClasses> = {
  Red: {
    bg: 'bg-red-100',
    hover: 'hover:bg-red-200'
  },
  Blue: {
    bg: 'bg-blue-100',
    hover: 'hover:bg-blue-200'
  },
  Green: {
    bg: 'bg-green-100',
    hover: 'hover:bg-green-200'
  },
  Black: {
    bg: 'bg-gray-100',
    hover: 'hover:bg-gray-200'
  },
  Gold: {
    bg: 'bg-yellow-100',
    hover: 'hover:bg-yellow-200'
  },
  Silver: {
    bg: 'bg-slate-100',
    hover: 'hover:bg-slate-200'
  },
  Purple: {
    bg: 'bg-purple-100',
    hover: 'hover:bg-purple-200'
  },
}

// Default color when not found
const defaultColor: ColorClasses = {
  bg: 'bg-slate-100',
  hover: 'hover:bg-slate-200',
}

export const getColorClasses = (color: string): ColorClasses => {
  return fullColorMap[color] || defaultColor
}
