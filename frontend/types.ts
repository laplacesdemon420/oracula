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
    senary: string;
    input: string;
    border: string;
  };
  typeScale: object;
  font: object;
};

export type QuestionType = {
  questionString: string;
  stage?: string;
  resolutionSource: string;
  resolutionDate: string;
  questionId?: string;
};

export type DisputeType = {
  questionString: string;
  questionId: string;
  phase: string;
  nextPhase: number;
};
