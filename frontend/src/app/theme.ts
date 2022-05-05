import { MantineProviderProps, Tuple } from '@mantine/core';

const theme: MantineProviderProps['theme'] = {
  colors: {
    instaBlue: ['#B3CAD9', '#95BBD3', '#75AED2', '#51A3D9', '#289CE7', '#1681C7', '#0095F6', '#2471A3', '#2C6388', '#305872'],
    instaDark: ['#434343', '#3D3D3D', '#383838', '#333333', '#2E2E2E', '#2A2A2A', '#262626', '#222222', '#1F1F1F', '#1C1C1C'],
  },
  primaryColor: 'instaBlue',
};

type CustomColors = 'instaBlue' | 'instaDark';

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<CustomColors, Tuple<string, 10>>;
  }
}

export default theme;
