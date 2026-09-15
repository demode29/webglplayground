# WebGL playground

A 3D graphics learning series: math → graphics pipeline → GPU → vector tiles → 3D Tiles.

I implement each study and cite the book. I do not copy book code or figures.

## Phase 1 — Graphics math

Books: Fletcher Dunn & Ian Parberry, *3D Math Primer for Graphics and Game Development*; Eric Lengyel, *Foundations of Game Engine Development, Volume 1: Mathematics*.

| Study | What I will do |
| --- | --- |
| [Ray–triangle intersection](./studies/01-ray-triangle) | Implement ray–triangle intersection |
| [Quaternion rotation](./studies/02-quaternion-rotation) | Implement quaternion rotation |
| [Camera / view matrix](./studies/03-camera-view) | Implement camera and view matrices |

Also: vectors, dot/cross, coordinate systems, matrices, MVP, ray–plane.

## Phase 2 — Basic raster graphics

Book: Peter Shirley & Steve Marschner, *Fundamentals of Computer Graphics*.

Implement: perspective, lighting, interpolation, texturing, camera, visibility.

## Phase 3 — GPU experiments

Book: Tomas Akenine-Möller, Eric Haines, Naty Hoffman, *Real-Time Rendering*.

Implement: instancing, culling, LOD, shadow mapping, normal mapping, picking.

## Phase 4 — Vector tiles

[`tiny-vector-renderer`](./tiny-vector-renderer): decode MVT, process geometry in WASM, draw with WebGL.

## Phase 5 — 3D Tiles

[3D Tiles](./3d-tiles): load and render OGC 3D Tiles. Not started.

## Scratch

[`projects/project1`](./projects/project1): early notebook (tetrahedron, plane, transforms).

## Citations

> Implemented while studying Chapter 3 of Eric Lengyel, *Foundations of Game Engine Development, Volume 1: Mathematics*. Implementation and visualization are my own.
