import { CustomExceptionFilter } from './exception.filter';

describe('ExceptionFilter', () => {
  it('should be defined', () => {
    expect(new CustomExceptionFilter()).toBeDefined();
  });
});
