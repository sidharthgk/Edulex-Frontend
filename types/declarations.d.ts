// types/declarations.d.ts

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.ttf' {
  const content: any;
  export default content;
}

declare module '*.otf' {
  const content: any;
  export default content;
}
