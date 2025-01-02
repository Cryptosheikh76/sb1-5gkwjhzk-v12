export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WithError {
  error?: string;
}

export interface WithLabel {
  label?: string;
}

export interface WithLoading {
  loading?: boolean;
}

export interface WithDisabled {
  disabled?: boolean;
}