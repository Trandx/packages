import formsPlugin from '@tailwindcss/forms';
import scrollbarPlugin from 'tailwind-scrollbar';
import { AutoGridPlugin } from './plugin';


// Export the full Tailwind configuration
const tailwindConfig = {
  content: [],
  theme: {
    extend: {

    },
  },
  plugins: [
    formsPlugin,
    scrollbarPlugin({ nocompatible: true, preferredStrategy: 'pseudoelements' }),
    AutoGridPlugin,
  ],
};

export { tailwindConfig };
