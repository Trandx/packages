import plugin, {PluginAPI} from 'tailwindcss/plugin';

const AutoGridPlugin: any = plugin(function ({ matchUtilities, addUtilities, theme }: PluginAPI) {
  const AutoGridUtilities: Record<string, any> = {};

  // Define custom sizes based on theme spacing
  const sizes = theme('spacing', {}) as Record<string, string>;

  // Generate utilities for predefined sizes
  Object.keys(sizes).forEach((size) => {
    const classSize = size.replace('.', '-');
    AutoGridUtilities[`.grid-auto-fit-${classSize}`] = {
      'grid-template-columns': `repeat(auto-fit, minmax(${sizes[size]}, 1fr))`,
    };

    AutoGridUtilities[`.grid-auto-fill-${classSize}`] = {
      'grid-template-columns': `repeat(auto-fill, minmax(${sizes[size]}, 1fr))`,
    };
  });

  // Pass utilities to Tailwind CSS
  addUtilities(AutoGridUtilities);

  // Add utility for arbitrary sizes using matchUtilities
  matchUtilities(
    {
      'grid-auto-fit': (value: string) => ({
        gridTemplateColumns: `repeat(auto-fit, minmax(${value}, 1fr))`,
      }),
    },
    {
      values: theme('gridAutoFit'), // Fetch values from the gridAutoFit theme
    }
  );

  matchUtilities(
    {
      'grid-auto-fill': (value: string) => ({
        gridTemplateColumns: `repeat(auto-fill, minmax(${value}, 1fr))`,
      }),
    },
    {
      values: theme('gridAutoFill'), // Fetch values from the gridAutoFill theme
    }
  );
},
{
  theme: {
    gridAutoFit: {
      'DEFAULT': '8rem',
      'xs': '6rem',
      'sm': '10rem',
      'md': '14rem',
      'lg': '18rem',
      'xl': '22rem',
    },
    gridAutoFill: {
      'DEFAULT': '8rem',
      'xs': '6rem',
      'sm': '10rem',
      'md': '14rem',
      'lg': '18rem',
      'xl': '22rem',
    },
  },
});

export default AutoGridPlugin;
export { AutoGridPlugin };
