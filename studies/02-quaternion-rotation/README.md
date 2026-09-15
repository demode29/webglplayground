# Quaternion rotation

Left gizmo: Euler YXZ. Right gizmo: one quaternion from an axis-angle. Set pitch near 90° and drag yaw versus roll — they start doing the same thing. The quaternion side never needs that sequence.

A quaternion is not “more 3D” than a matrix. It is a better way to *hold* a rotation: four numbers, interpolable, no gimbal pole.

Implemented while studying Chapter 2.7 of Eric Lengyel, *Foundations of Game Engine Development, Volume 1: Mathematics*. Implementation and visualization are my own.
