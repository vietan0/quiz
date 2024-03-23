import '@testing-library/jest-dom/vitest';

import { MotionGlobalConfig } from 'framer-motion';
import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  MotionGlobalConfig.skipAnimations = true;
});

vi.mock('zustand');
