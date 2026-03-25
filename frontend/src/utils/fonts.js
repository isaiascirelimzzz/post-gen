export const top50Fonts = [
  { name: 'Inter', value: '"Inter", sans-serif', type: 'sans-serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif', type: 'sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif', type: 'sans-serif' },
  { name: 'Lato', value: '"Lato", sans-serif', type: 'sans-serif' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif', type: 'sans-serif' },
  { name: 'Oswald', value: '"Oswald", sans-serif', type: 'sans-serif' },
  { name: 'Source Sans 3', value: '"Source Sans 3", sans-serif', type: 'sans-serif' },
  { name: 'Raleway', value: '"Raleway", sans-serif', type: 'sans-serif' },
  { name: 'PT Sans', value: '"PT Sans", sans-serif', type: 'sans-serif' },
  { name: 'Merriweather', value: '"Merriweather", serif', type: 'serif' },
  { name: 'Nunito', value: '"Nunito", sans-serif', type: 'sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif', type: 'serif' },
  { name: 'Ubuntu', value: '"Ubuntu", sans-serif', type: 'sans-serif' },
  { name: 'Lora', value: '"Lora", serif', type: 'serif' },
  { name: 'Rubik', value: '"Rubik", sans-serif', type: 'sans-serif' },
  { name: 'Work Sans', value: '"Work Sans", sans-serif', type: 'sans-serif' },
  { name: 'PT Serif', value: '"PT Serif", serif', type: 'serif' },
  { name: 'Fira Sans', value: '"Fira Sans", sans-serif', type: 'sans-serif' },
  { name: 'Quicksand', value: '"Quicksand", sans-serif', type: 'sans-serif' },
  { name: 'Barlow', value: '"Barlow", sans-serif', type: 'sans-serif' },
  { name: 'Inconsolata', value: '"Inconsolata", monospace', type: 'monospace' },
  { name: 'Titillium Web', value: '"Titillium Web", sans-serif', type: 'sans-serif' },
  { name: 'Heebo', value: '"Heebo", sans-serif', type: 'sans-serif' },
  { name: 'Poppins', value: '"Poppins", sans-serif', type: 'sans-serif' },
  { name: 'Bitter', value: '"Bitter", serif', type: 'serif' },
  { name: 'Dosis', value: '"Dosis", sans-serif', type: 'sans-serif' },
  { name: 'Crimson Text', value: '"Crimson Text", serif', type: 'serif' },
  { name: 'Libre Baskerville', value: '"Libre Baskerville", serif', type: 'serif' },
  { name: 'Anton', value: '"Anton", sans-serif', type: 'sans-serif' },
  { name: 'Josefin Sans', value: '"Josefin Sans", sans-serif', type: 'sans-serif' },
  { name: 'Karla', value: '"Karla", sans-serif', type: 'sans-serif' },
  { name: 'Pacifico', value: '"Pacifico", cursive', type: 'cursive' },
  { name: 'Dancing Script', value: '"Dancing Script", cursive', type: 'cursive' },
  { name: 'Varela Round', value: '"Varela Round", sans-serif', type: 'sans-serif' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif', type: 'sans-serif' },
  { name: 'Space Mono', value: '"Space Mono", monospace', type: 'monospace' },
  { name: 'Archivo', value: '"Archivo", sans-serif', type: 'sans-serif' },
  { name: 'Libre Franklin', value: '"Libre Franklin", sans-serif', type: 'sans-serif' },
  { name: 'Cabin', value: '"Cabin", sans-serif', type: 'sans-serif' },
  { name: 'Cinzel', value: '"Cinzel", serif', type: 'serif' },
  { name: 'Righteous', value: '"Righteous", cursive', type: 'cursive' },
  { name: 'Fjalla One', value: '"Fjalla One", sans-serif', type: 'sans-serif' },
  { name: 'EB Garamond', value: '"EB Garamond", serif', type: 'serif' },
  { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif', type: 'sans-serif' },
  { name: 'Exo 2', value: '"Exo 2", sans-serif', type: 'sans-serif' },
  { name: 'Prompt', value: '"Prompt", sans-serif', type: 'sans-serif' },
  { name: 'Mulish', value: '"Mulish", sans-serif', type: 'sans-serif' },
  { name: 'Maven Pro', value: '"Maven Pro", sans-serif', type: 'sans-serif' },
  { name: 'Teko', value: '"Teko", sans-serif', type: 'sans-serif' },
  { name: 'Caveat', value: '"Caveat", cursive', type: 'cursive' }
]

export function getFontFamilyString(name) {
  const font = top50Fonts.find(f => f.name === name)
  return font ? font.value : '"Inter", sans-serif'
}

export function generateGoogleFontsUrl() {
  const families = top50Fonts.map(f => {
    // Para simplificar a URL e carregar mais rápido, vamos pedir os pesos 400 e 700 para a maioria
    // Pacifico, Righteous, Fjalla One, Bebas Neue geralmente têm só peso 400
    const singleWeightFonts = ['Pacifico', 'Righteous', 'Fjalla One', 'Bebas Neue', 'Caveat', 'Anton']
    const hasWeightVariants = !singleWeightFonts.includes(f.name)
    
    // Playfair Display precisa de sintaxe italic
    if (f.name === 'Playfair Display') {
      return 'family=Playfair+Display:ital,wght@0,400;0,700;1,400'
    }
    
    const formattedName = f.name.replace(/ /g, '+')
    return hasWeightVariants ? `family=${formattedName}:wght@400;600;700;800` : `family=${formattedName}`
  })
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}
