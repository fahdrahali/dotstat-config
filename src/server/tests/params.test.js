describe('params', () => {
  const ENV = Object.assign({}, process.env);

  afterEach(() => process.env = ENV);

  it('should match test params', () => {
    process.env.GIT_HASH = '#test';
    expect(require('../params')).toEqual({
      gitHash: '#test',
      env: 'test',
      server: { host: 'localhost' },
    });
  });
});
