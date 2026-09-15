# 3D graphics learning series — Phase 1

Book: Fletcher Dunn & Ian Parberry, *3D Math Primer for Graphics and Game Development*, 2nd Edition.

I cannot see `C:\Users\Demir\Desktop\Resources` from here. Use that PDF, or the same 2nd edition online: https://gamemath.com/book/

I implement the studies. Do not copy book code or figures.

## What to skip

Ch 11–13 (mechanics, curves). Ch 7 (polar) until camera orbit needs spherical coordinates. Ch 10 HLSL samples — ideas only, we use WebGL.

## Section by section

| # | Read | Then implement |
| --- | --- | --- |
| 1 | **1.3** 3D Cartesian space (esp. 1.3.3 left vs right handed), **1.4.3–1.4.4** radians and trig | Nothing. Conventions only. |
| 2 | **2.2–2.4** vectors vs points, **2.5–2.10** negate, scale, add, length, unit, distance, **2.11** dot, **2.12** cross | [02-vectors](./02-vectors) — **start here** |
| 3 | **3.2** world / object / camera / upright, **3.3** basis vectors | A scene with more than one space (after matrices) |
| 4 | **4.1.6–4.1.8** multiply, row vs column | Matrix multiply |
| 5 | **5.1** rotation, **5.2** scale, **5.6** combining | TRS as matrices |
| 6 | **6.2** inverse, **6.4** 4×4 translation, **6.5** perspective | Homogeneous transform + projection |
| 8 | **8.3** Euler, **8.5** quaternions (through 8.5.12 slerp), **8.7** conversions | [08-quaternion-rotation](./08-quaternion-rotation) |
| 9 | **9.2** rays, **9.5** planes, **9.6** triangles and barycentric | Primitives used by picking |
| 10 | **10.2** viewing, **10.3** model/world/camera/clip/screen | [10-camera-view](./10-camera-view) |
| A | **A.9** ray–plane, **A.16** ray–triangle | [A16-ray-triangle](./A16-ray-triangle) |

Citation on each page:

> Implemented while studying [sections] of Fletcher Dunn & Ian Parberry, *3D Math Primer for Graphics and Game Development*, 2nd Edition. Implementation and visualization are my own.
