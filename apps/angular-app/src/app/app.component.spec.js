import { describe, it, expect } from 'vitest';
import { AppComponent } from './app.component.js';

describe('AppComponent', () => {
  it('should have title angular-app', () => {
    const component = new AppComponent();
    expect(component.title()).toBe('angular-app');
  });
});
