import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ReactNativeHealthViewProps } from './ReactNativeHealth.types';

const NativeView: React.ComponentType<ReactNativeHealthViewProps> =
  requireNativeViewManager('ReactNativeHealth');

export default function ReactNativeHealthView(props: ReactNativeHealthViewProps) {
  return <NativeView {...props} />;
}
