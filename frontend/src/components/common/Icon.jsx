import { ICONS } from '../../icons.jsx';

export const Icon = ({ name, size = 18, style = {} }) => {
  const svg = ICONS[name] || ICONS.star;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flexShrink: 0,
      ...style
    }}>
      {svg}
    </span>
  );
};