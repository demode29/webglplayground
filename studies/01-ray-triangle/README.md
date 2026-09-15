# Ray–triangle intersection

A map click is the same problem as this page: a pixel becomes a ray, a ray either hits a surface or it does not.

I implemented the test from the barycentric identity

`origin + t · direction = A + u (B − A) + v (C − A)`

with `u ≥ 0`, `v ≥ 0`, `u + v ≤ 1`, `t ≥ 0`. The 3×3 solve is the Möller–Trumbore arrangement of triple products. I did not paste it from a book.

Click the canvas. Yellow is the ray. Red is the hit.

Implemented while studying Chapter 3 (Geometry: lines, rays, planes) of Eric Lengyel, *Foundations of Game Engine Development, Volume 1: Mathematics*, and the vector / coordinate chapters of Fletcher Dunn & Ian Parberry, *3D Math Primer for Graphics and Game Development*. Implementation and visualization are my own.
