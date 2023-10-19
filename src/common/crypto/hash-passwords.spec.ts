import { comparePasswords, hashPassword } from './hash-password';
import { expect, it } from '@jest/globals';

describe('HashPasswords', () => {
  const password: string = 'test';

  beforeEach(() => {});
  describe('hashPassword and compare hashes', () => {
    it('ok', async () => {
      const hashedPassword = await hashPassword(password);

      expect(comparePasswords(password, hashedPassword)).toBeTruthy();
    });
  });
  afterEach(() => {});
});
