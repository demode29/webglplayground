# WebGL playground

This is not a product. It is a scratch notebook for 3D.

I work with GIS and visualization for a living. Most of that work lives in private codebases, so this repo is the public trace of how I try to understand the same problems from first principles: a mesh is not a buffer, a camera is not a view matrix, and a click on a map is a ray that has to mean something in space.

## Why this exists

Libraries like Cesium and Three.js are excellent. They also hide the questions I keep running into on geospatial work.

When a feature sits in the wrong place, is it a CRS problem, a transform-order problem, or a GPU upload problem? When picking fails, is the ray wrong, the depth buffer wrong, or the geometry wound the other way? I got tired of answering those only through framework internals, so I started writing the small pieces myself.

The code is intentionally messy. Comments trail off. Sphere generation is half-wired. Picking is a sketch. That is the point: this is thinking in public, not a portfolio demo with the edges sanded off.

## What I was chewing on

**Meshes vs the GPU.** A tetrahedron is four points and four faces. What the shader sees is a flattened stream of floats. `Mesh` and `Geometries` are me making that translation explicit instead of pretending it is automatic.

**Draw commands.** Once you have more than one object, “bind this, draw that” becomes a scene. Wrapping a program, a VAO, and a handful of uniforms into a command is the smallest scene graph I was willing to believe in.

**Transforms as a language.** Rotation, translation, and scale sliders are not UI. They are a way to feel whether matrices are doing what I think they are doing. Orthographic projection is here because maps often start there; perspective is the next question, not the first one.

**Picking.** A click is a window coordinate. The thing you wanted is in world space. The unfinished `createRay` notes are the real work of this repo: GIS interaction is geometry, not mouse events.

## How to look at it

```bash
yarn
yarn dev
```

Then open the local page and drag the sliders. There is one scene: a tetrahedron and a plane, plus the questions I left in the comments.

If you are here for a polished viewer, this is the wrong repository. If you are here to see how I think about space on a screen, start in `projects/project1` and `utils/`.

## Next

[`tiny-vector-renderer`](./tiny-vector-renderer) is the GIS-shaped continuation: one vector tile, a CPU `prepare` step, a WebGL `paint` step. WASM is for the first step (decode and layout), not for “faster rendering.” The GPU already has that job.
