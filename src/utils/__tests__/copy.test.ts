import { greeting } from '../copy';

describe('greeting', () => {
  const at = (h: number) => new Date(2026, 0, 1, h, 0, 0);
  it('says Bom dia before noon', () => {
    expect(greeting(at(0))).toBe('Bom dia');
    expect(greeting(at(11))).toBe('Bom dia');
  });
  it('says Boa tarde from noon to 19h', () => {
    expect(greeting(at(12))).toBe('Boa tarde');
    expect(greeting(at(18))).toBe('Boa tarde');
  });
  it('says Boa noite from 19h', () => {
    expect(greeting(at(19))).toBe('Boa noite');
    expect(greeting(at(23))).toBe('Boa noite');
  });
});
