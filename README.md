# WebGL playground

A 3D graphics learning series: math → graphics pipeline → GPU → vector tiles → 3D Tiles.

I implement each study and cite the book. I do not copy book code or figures.

## Phase 1 — Graphics math

Book: Fletcher Dunn & Ian Parberry, *3D Math Primer for Graphics and Game Development*, 2nd Edition. Section list: [studies/README.md](./studies/README.md).

| Study | Book | Status |
| --- | --- | --- |
| [01 Cartesian](./studies/01-cartesian) | Ch 1.3, 1.4.3–1.4.4 | Read |
| [02 Vectors](./studies/02-vectors) | Ch 2.2–2.12 | Implement next |
| [08 Quaternion rotation](./studies/08-quaternion-rotation) | Ch 8.3, 8.5, 8.7 | Later |
| [10 Camera / view](./studies/10-camera-view) | Ch 3.2–3.3, 10.2–10.3 | Later |
| [A16 Ray–triangle](./studies/A16-ray-triangle) | Ch 9.2, 9.6, A.9, A.16 | Later |

Also from the same book: Ch 4–6 matrices / MVP, Ch 9.5 planes, A.9 ray–plane.

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

> Implemented while studying Chapter 2 of Fletcher Dunn & Ian Parberry, *3D Math Primer for Graphics and Game Development*, 2nd Edition. Implementation and visualization are my own.
