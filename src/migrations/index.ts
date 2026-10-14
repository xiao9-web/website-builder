import * as migration_20261009_023929_initial from './20261009_023929_initial';
import * as migration_20261013_125847_hero_slides from './20261013_125847_hero_slides';
import * as migration_20261014_022532_hero_slide_concept_flag from './20261014_022532_hero_slide_concept_flag';
import * as migration_20261014_031439_content_navigation from './20261014_031439_content_navigation';

export const migrations = [
  {
    up: migration_20261009_023929_initial.up,
    down: migration_20261009_023929_initial.down,
    name: '20261009_023929_initial',
  },
  {
    up: migration_20261013_125847_hero_slides.up,
    down: migration_20261013_125847_hero_slides.down,
    name: '20261013_125847_hero_slides',
  },
  {
    up: migration_20261014_022532_hero_slide_concept_flag.up,
    down: migration_20261014_022532_hero_slide_concept_flag.down,
    name: '20261014_022532_hero_slide_concept_flag',
  },
  {
    up: migration_20261014_031439_content_navigation.up,
    down: migration_20261014_031439_content_navigation.down,
    name: '20261014_031439_content_navigation'
  },
];
