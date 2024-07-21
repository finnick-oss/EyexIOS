// ThemeContext.js

import { createContext, useContext } from "react";

const theme = {
  colors: {
    colorPrimary: '#161B37',
    colorPrimaryDark: '#3700B3',
    colorAccent: '#03DAC5',
    purple_200: '#FFBB86FC',
    purple_500: '#FF6200EE',
    purple_700: '#FF3700B3',
    teal_200: '#FF03DAC5',
    teal_700: '#FF018786',
    black: '#FF000000',
    white: '#FFFFFFFF',
    background: '#1E1D1D',
    skyBlue: '#25CDFD',
    cardcolor: '#6D859FB8',
    colorlightgray: '#D3D2D2',
    greyWhite: '#BFCAC4C4',
    grey: '#A1A1A1',
    gnt_test_background_color: '#00F4F4F4',
    gnt_test_background_color_2: '#00A3A3A3',
    gnt_black: '#000000',
    gnt_white: '#FFFFFF',
    gnt_red: '#FF0000',
    gnt_green: '#00FF00',
    gnt_blue: '#4285f4',
    gnt_ad_green: '#3A6728',
    gnt_gray: '#808080',
    gnt_outline: '#EDEDED',
    gnt_darkred: '#D30909',
    gnt_darkgrey :'#363737',

  },
};

const ThemeContext = createContext(theme);

export const useTheme = () => useContext(ThemeContext);

export { theme, ThemeContext };
