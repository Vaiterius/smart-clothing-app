import * as React from 'react';

import { ReactNativeHealthViewProps } from './ReactNativeHealth.types';

export default function ReactNativeHealthView(props: ReactNativeHealthViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
