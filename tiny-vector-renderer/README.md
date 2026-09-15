# tiny-vector-renderer

A map is not an image with coordinates glued on. It is a binary tile that has to become triangles, then a picture, then something you can point at.

This is a small place to work on that sentence. GIS, TypeScript, WebGL, and later WebAssembly — not as a stack list, but as one pipeline.

## The split I care about

Most of what people call “rendering” is not rendering.

A vector tile arrives as protobuf. Somebody has to unpack layers, walk rings, clip them to the tile, triangulate fills, extrude lines, and pack typed arrays. That is CPU work. It is also the work that gets worse as tiles get denser.

Then the GPU draws. Shaders, blending, `drawArrays`. That part is already fast, and it does not run in WASM.

So I would not add WebAssembly because “WASM = faster rendering.” Rendering, in the GPU sense, is not waiting on JavaScript. WASM earns its keep on the other side of the boundary: decode, layout, triangulation — the same job Mapbox gives to workers before the painter ever sees a buffer.

```
tile bytes  →  [ CPU / WASM ]  →  GPU buffers  →  [ WebGL ]  →  pixels
                 prepare                paint
```

TypeScript still has a job: the camera, the tile pyramid, style, and the WebGL device. It should not be parsing protobuf on the main thread, and it should not pretend a fragment shader can decode a `.pbf`.

## What this is today

One tile. A handful of fills and lines, authored by hand in tile extent 4096 — the same space Mapbox Vector Tiles use.

`src/cpu/prepare.ts` is the WASM candidate: geometry in, typed arrays out. `src/gpu/paint.ts` only binds and draws. The sample “tile” is fake. The boundary is real.

```bash
cd tiny-vector-renderer
npm install
npm run dev
```

## What this is not

Not a globe. Not labels, collision, or a style spec. Not “I rewrote Mapbox.” The first honest version of this idea is a visible seam between preparing a map and painting one.

## Next

Swap the hand-built tile for a real `.pbf`. Move `prepare` into Rust and compile it to WASM. Keep `paint` in TypeScript. If the WASM module ever starts issuing draw calls, I have missed the point.
