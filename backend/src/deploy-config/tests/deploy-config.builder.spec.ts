import { DeployConfigBuilder } from '../builders/deploy-config.builder';

describe('DeployConfigBuilder', () => {
  it('builds app service with env, health check, and replicas', () => {
    const config = new DeployConfigBuilder()
      .setBaseVersion('3.9')
      .addAppService({ appName: 'cindy-backend', image: 'cindy-backend:latest', port: 3000 })
      .addEnvironment('cindy-backend', { NODE_ENV: 'production' })
      .setReplicas('cindy-backend', 3)
      .addHealthCheck('cindy-backend', '/health', 3000)
      .build();

    expect(config.services['cindy-backend']).toMatchObject({
      image: 'cindy-backend:latest',
      ports: ['3000:3000'],
      environment: { NODE_ENV: 'production' },
      deploy: { replicas: 3 },
    });
    expect(config.services['cindy-backend'].healthcheck?.test).toContain('http://localhost:3000/health');
  });

  it('adds redis and postgres services', () => {
    const config = new DeployConfigBuilder()
      .addAppService({ appName: 'api', image: 'api:latest', port: 3000 })
      .enableRedis()
      .enablePostgres()
      .build();

    expect(config.services.redis.image).toBe('redis:7');
    expect(config.services.postgres.image).toBe('postgres:16');
    expect(config.services.api.depends_on).toEqual(['redis', 'postgres']);
    expect(config.volumes).toHaveProperty('postgres_data');
  });

  it('throws when building without app service', () => {
    expect(() => new DeployConfigBuilder().enableRedis().build()).toThrow('App service must be added');
  });
});
