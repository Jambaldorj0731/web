import { ICON_PATHS } from '../../icons.jsx';

export const Icon = ({ name, size = 18, style = {}, title }) => {
  const src = ICON_PATHS[name] || ICON_PATHS.star;

  return (
    <span
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0,
        backgroundColor: 'currentColor',
        WebkitMask: `url("${src}") center / contain no-repeat`,
        mask: `url("${src}") center / contain no-repeat`,
        ...style
      }}
    />
  );
};
