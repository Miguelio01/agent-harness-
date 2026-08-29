import { describe, it, expect } from 'vitest';
import { AppController } from './app.controller.js';

describe('AppController', () => {
  it('should return hello', () => {
    const controller = new AppController();
    expect(controller.getHello()).toBe('Hello Tributos!');
  });
});
