<!--
  GitHub only shows a profile README from a public repo named exactly after
  your username. Copy this file to demode29/demode29 as README.md.
-->
# Demir Topaktaş

Software engineer. I spend most of my time on **TypeScript**, **GIS**, **WebGL**, and **3D visualization**.

I care less about collecting tools than about making spatial software honest: coordinates that mean what they claim, scenes that can be picked, and pictures that still behave like data.

## How I think about this work

**Maps are arguments, not pictures.** A GIS view is a claim about the world. Projection, scale, and symbolization are editorial choices. I try to keep those choices visible in the software, because a beautiful map that lies is worse than a plain one that does not.

**3D is a spatial problem before it is a graphics problem.** Cameras, ellipsoids, terrain, and picking are geometry. Shaders come after. When something looks wrong on a globe, I ask where the point actually is, not which uniform I forgot. [webglplayground](https://github.com/demode29/webglplayground) is a study series for that habit: math, then the pipeline, then the GPU, then a GIS renderer.

**TypeScript is for the shapes that must not blur.** In geospatial code, a lon/lat pair, a projected meter, and a clip-space vertex can all look like `{ x, y }`. I use types to keep those from silently swapping places. The interesting part is the model, not the generics.

**Visualization should survive contact with the user.** A scene that cannot be queried is a poster. I am more interested in the loop where someone points at the world and the software can answer.

## What you will find here

Most of my GIS and TypeScript work sits in professional code, so this profile is small on purpose.

- [webglplayground](https://github.com/demode29/webglplayground) — a cited study series aimed at a vector-tile renderer. I implement the math myself.
- [tiny-vector-renderer](https://github.com/demode29/webglplayground/tree/main/tiny-vector-renderer) — Phase 4 of that series: CPU prepares geometry, WebGL paints it.

## Currently

Based in Ankara. Working on geospatial software: web maps, 3D views, and the TypeScript that holds them together.

If you are hiring for GIS, visualization, or graphics-adjacent frontend work, I am interested in talking.
