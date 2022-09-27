import { createGlobalStyle } from 'styled-components';
import { Theme } from '../types';

const primaryFont = `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;`;

const typeScale = {
  header1: '2rem',
  header2: '1.8rem',
  header3: '1.6rem',
  header4: '1.4rem',
  header5: '1.2rem',
  header6: '1.1rem',
  header7: '1rem',
  paragraph: '1rem',
  smallParagraph: '0.92rem',
  helperText: '0.8rem',
  copyrightText: '0.7rem',
  smallestText: '0.6rem',
};

const grey = {
  100: '#F8F9FA',
  200: '#E9ECEF',
  300: '#DEE2E6',
  400: '#CED4DA',
  500: '#ADB5BD',
  600: '#6C757D',
  700: '#495057',
  800: '#343A40',
  900: '#212529',
};

const blue = {
  100: '#00A6FB',
  200: '#0582CA',
  300: '#006494',
  400: '#003554',
  500: '#051923',
};

export const lightTheme: Theme = {
  colors: {
    primary: blue[500],
    secondary: blue[100],
    tertiary: blue[400],
    green: '#60D394',
    red: '#FF6978',
    primaryHover: blue[200],
  },
  text: {
    primary: blue[500],
    secondary: grey[900],
  },
  background: {
    primary: grey[100],
    secondary: grey[200],
    tertiary: grey[300],
    quaternary: grey[400],
    senary: grey[500],
  },
  font: {
    primary: primaryFont,
  },
  typeScale: typeScale,
};

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  * {
    box-sizing: border-box;
  }
  blockquote,
  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  figure,
  p,
  pre {
    margin: 0;
  }
  ol,
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  button {
    outline: none;
    border: none;
  }
  input {
    outline: none;

  }
`;
