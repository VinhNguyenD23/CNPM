import { DeployConfigService } from '../deploy-config.service';
import { GenerateDeployConfigDto } from '../dto/generate-deploy-config.dto';

const baseDto: GenerateDeployConfigDto = {
  appName: 'cindy-backend',
  runtime: 'node',
  image: 'cindy-backend:latest',
  port: 3000,
  replicas: 3,
  healthCheck: '/health',
  env: [{ key: 'NODE_ENV', value: 'production' }],
  services: {
    redis: true,
    postgres: false,
    worker: false,
    haproxy: false,
  },
  outputType: 'docker-compose',
};

describe('DeployConfigService', () => {
  const service = new DeployConfigService();

  it('returns docker-compose yaml response', () => {
    const result = service.generate(baseDto);

    expect(result.success).toBe(true);
    expect(result.fileName).toBe('docker-compose.yml');
    expect(result.config).toContain('services:');
    expect(result.config).toContain('redis:');
  });

  it('returns json response', () => {
    const result = service.generate({ ...baseDto, outputType: 'json' });

    expect(result.fileName).toBe('deploy-config.json');
    expect(JSON.parse(result.config).services.redis.image).toBe('redis:7');
  });

  it('returns swarm compose file name', () => {
    const result = service.generate({ ...baseDto, outputType: 'swarm-compose' });

    expect(result.fileName).toBe('docker-swarm.yml');
  });
});
