require('./error');

describe('startup / logging', () => {
  it('should throw an error if there is an unhandledRejection', () => {
    const emitUnhandledRejection = () => process.emit('unhandledRejection');
    expect(emitUnhandledRejection).toThrow();
  });
});
