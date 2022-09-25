export type Theme = {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    green: string;
    red: string;
    primaryHover: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
  typeScale: object;
  font: object;
};

export type Question = {
  questionString: string;
  resolutionSource: string;
  resolutionDate: string;
};
