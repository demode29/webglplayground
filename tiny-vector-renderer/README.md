# tiny-vector-renderer

3D graphics learning series, phase 4: vector tile renderer.

- Decode MVT
- Process geometry (WASM)
- Draw with WebGL

```bash
cd tiny-vector-renderer
npm install
npm run dev
```

Today: one hand-built tile (`src/cpu/prepare.ts`, `src/gpu/paint.ts`).

Next: real `.pbf`, move `prepare` to Rust/WASM.
