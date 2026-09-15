# WebGL playground

A study series, not a pile of demos.

I work on GIS and 3D visualization. This repo is how I keep the underlying math honest: implement the idea, show it, cite the book I studied, and never paste the book’s code or figures.

The story I want this GitHub to tell:

**I understand the math → I understand the graphics pipeline → I can use the GPU → I can build a GIS renderer.**

## Phase 1 — Graphics math

Books: Fletcher Dunn & Ian Parberry, *3D Math Primer for Graphics and Game Development*; Eric Lengyel, *Foundations of Game Engine Development, Volume 1: Mathematics*.

I implement these. The folders are briefs, not finished pages.

| Study | Why it is here |
| --- | --- |
| [Ray–triangle intersection](./studies/01-ray-triangle) | Picking. A click is a ray. GIS interaction is geometry. |
| [Quaternion rotation](./studies/02-quaternion-rotation) | Camera and object pose without gimbal poles. |
| [Camera / view matrix](./studies/03-camera-view) | The view matrix is a change of basis. Maps ask the same question. |

Still ahead in this phase, same books: vectors, dot/cross, coordinate systems, matrices, MVP, ray–plane.

## Phase 2 — Basic raster graphics

Book: Peter Shirley & Steve Marschner, *Fundamentals of Computer Graphics*.

Perspective, lighting, interpolation, texturing, camera, visibility. Not started.

## Phase 3 — GPU experiments

Book: Tomas Akenine-Möller, Eric Haines, Naty Hoffman, *Real-Time Rendering*.

Instancing, culling, LOD, shadow mapping, normal mapping, picking on the GPU. Not started.

## Phase 4 — Systems project

[`tiny-vector-renderer`](./tiny-vector-renderer): MVT → WASM → geometry processing → WebGL.

WASM prepares buffers. WebGL paints. That split is the point.

## Scratch

[`projects/project1`](./projects/project1) is the original messy notebook — tetrahedron, plane, Euler sliders, an unfinished `createRay`.

## How I use the books

I implement the concept and cite the source. I do not copy prose, diagrams, or sample listings.

> Implemented while studying Chapter 3 of Eric Lengyel, *Foundations of Game Engine Development, Volume 1: Mathematics*. Implementation and visualization are my own.
