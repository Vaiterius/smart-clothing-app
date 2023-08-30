import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ReactNativeHealth.web.ts
// and on native platforms to ReactNativeHealth.ts
import ReactNativeHealthModule from './ReactNativeHealthModule';
import ReactNativeHealthView from './ReactNativeHealthView';
import { ChangeEventPayload, ReactNativeHealthViewProps } from './ReactNativeHealth.types';

// Get the native constant value.
export const PI = ReactNativeHealthModule.PI;

export function hello(): string {
  return ReactNativeHealthModule.hello();
}

export async function setValueAsync(value: string) {
  return await ReactNativeHealthModule.setValueAsync(value);
}

const emitter = new EventEmitter(ReactNativeHealthModule ?? NativeModulesProxy.ReactNativeHealth);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ReactNativeHealthView, ReactNativeHealthViewProps, ChangeEventPayload };
