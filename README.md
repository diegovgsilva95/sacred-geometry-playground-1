# Sacred Geometry Playground

## Overview
This Web SPA project allows you to create intricate patterns of Sacred Geometry, starting with a central circle and expanding into mathematically infinite configurations. Explore well-known symbols like Vesica Piscis, Seed of Life, Flower of Life, and more.

## Planned Improvements
Please note that the following improvements are ideas and may or may not be implemented in the future.

- **Real-time Configuration with `dat.gui`:**
  - Fine-tune variables like `data.range` in real-time.
  - Toggle the visibility of intersections.
  - Customize colors dynamically.
  - Add algorithm for computing the cursor-nearest intersection when `data.nearIntersections` has more than 1 candidate. 

- **Configuration Persistence:**
  - Save and restore configurations using JSON.

- **Enhanced Visualization:**
  - Allow filling the circles and/or intersections for a richer visual experience.

- **Cursor-Nearest Intersection Algorithm:**
  - Add an algorithm to compute the nearest intersection when `data.nearIntersections` has more than one candidate. This will enhance the way circles are added.
