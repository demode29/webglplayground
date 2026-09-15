/** Column-major 4×4, matching WebGL. Written for these studies, not copied from a book. */

export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number]; // x y z w
export type Mat4 = Float32Array;

const EPS = 1e-7;

export const vec3 = {
  create: (x = 0, y = 0, z = 0): Vec3 => [x, y, z],
  add: (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  scale: (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a: Vec3, b: Vec3): Vec3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ],
  length: (a: Vec3): number => Math.hypot(a[0], a[1], a[2]),
  normalize: (a: Vec3): Vec3 => {
    const len = Math.hypot(a[0], a[1], a[2]);
    if (len < EPS) {
      return [0, 0, 0];
    }
    return [a[0] / len, a[1] / len, a[2] / len];
  },
};

export const mat4 = {
  identity: (): Mat4 =>
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),

  multiply: (a: Mat4, b: Mat4): Mat4 => {
    const out = new Float32Array(16);
    for (let col = 0; col < 4; col += 1) {
      for (let row = 0; row < 4; row += 1) {
        out[row + col * 4] =
          a[row] * b[col * 4] +
          a[row + 4] * b[col * 4 + 1] +
          a[row + 8] * b[col * 4 + 2] +
          a[row + 12] * b[col * 4 + 3];
      }
    }
    return out;
  },

  perspective: (fovy: number, aspect: number, near: number, far: number): Mat4 => {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    const out = new Float32Array(16);
    out[0] = f / aspect;
    out[5] = f;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[14] = 2 * far * near * nf;
    return out;
  },

  /**
   * World → camera. Camera sits at `eye`, looks at `target`, `up` is world up.
   * In camera space we look down −Z, X right, Y up.
   */
  lookAt: (eye: Vec3, target: Vec3, up: Vec3): Mat4 => {
    const backward = vec3.normalize(vec3.sub(eye, target));
    const right = vec3.normalize(vec3.cross(up, backward));
    const camUp = vec3.cross(backward, right);
    const out = mat4.identity();
    out[0] = right[0];
    out[1] = camUp[0];
    out[2] = backward[0];
    out[4] = right[1];
    out[5] = camUp[1];
    out[6] = backward[1];
    out[8] = right[2];
    out[9] = camUp[2];
    out[10] = backward[2];
    out[12] = -vec3.dot(right, eye);
    out[13] = -vec3.dot(camUp, eye);
    out[14] = -vec3.dot(backward, eye);
    return out;
  },

  translation: (t: Vec3): Mat4 => {
    const out = mat4.identity();
    out[12] = t[0];
    out[13] = t[1];
    out[14] = t[2];
    return out;
  },

  transformPoint: (m: Mat4, p: Vec3): Vec3 => {
    const x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12];
    const y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13];
    const z = m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14];
    const w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15];
    if (Math.abs(w) < EPS) {
      return [x, y, z];
    }
    return [x / w, y / w, z / w];
  },

  invert: (m: Mat4): Mat4 | null => {
    const a = Array.from(m);
    const inv = Array.from(mat4.identity());
    for (let col = 0; col < 4; col += 1) {
      let pivot = col;
      let best = Math.abs(a[col + col * 4]);
      for (let row = col + 1; row < 4; row += 1) {
        const value = Math.abs(a[row + col * 4]);
        if (value > best) {
          best = value;
          pivot = row;
        }
      }
      if (best < EPS) {
        return null;
      }
      if (pivot !== col) {
        for (let k = 0; k < 4; k += 1) {
          const i = col + k * 4;
          const j = pivot + k * 4;
          ;[a[i], a[j]] = [a[j], a[i]];
          ;[inv[i], inv[j]] = [inv[j], inv[i]];
        }
      }
      const diag = a[col + col * 4];
      for (let k = 0; k < 4; k += 1) {
        a[col + k * 4] /= diag;
        inv[col + k * 4] /= diag;
      }
      for (let row = 0; row < 4; row += 1) {
        if (row === col) {
          continue;
        }
        const factor = a[row + col * 4];
        for (let k = 0; k < 4; k += 1) {
          a[row + k * 4] -= factor * a[col + k * 4];
          inv[row + k * 4] -= factor * inv[col + k * 4];
        }
      }
    }
    return new Float32Array(inv);
  },
};

export const quat = {
  identity: (): Quat => [0, 0, 0, 1],

  fromAxisAngle: (axis: Vec3, angle: number): Quat => {
    const n = vec3.normalize(axis);
    const half = angle * 0.5;
    const s = Math.sin(half);
    return [n[0] * s, n[1] * s, n[2] * s, Math.cos(half)];
  },

  multiply: (a: Quat, b: Quat): Quat => [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ],

  normalize: (q: Quat): Quat => {
    const len = Math.hypot(q[0], q[1], q[2], q[3]);
    if (len < EPS) {
      return [0, 0, 0, 1];
    }
    return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
  },

  rotateVec3: (q: Quat, v: Vec3): Vec3 => {
    const u: Vec3 = [q[0], q[1], q[2]];
    const t = vec3.scale(vec3.cross(u, v), 2);
    return vec3.add(v, vec3.add(vec3.scale(t, q[3]), vec3.cross(u, t)));
  },

  toMat4: (q: Quat): Mat4 => {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const xx = x * x;
    const yy = y * y;
    const zz = z * z;
    const xy = x * y;
    const xz = x * z;
    const yz = y * z;
    const wx = w * x;
    const wy = w * y;
    const wz = w * z;
    return new Float32Array([
      1 - 2 * (yy + zz),
      2 * (xy + wz),
      2 * (xz - wy),
      0,
      2 * (xy - wz),
      1 - 2 * (xx + zz),
      2 * (yz + wx),
      0,
      2 * (xz + wy),
      2 * (yz - wx),
      1 - 2 * (xx + yy),
      0,
      0,
      0,
      0,
      1,
    ]);
  },
};

/** Intrinsic Tait–Bryan: yaw (Y) after pitch (X) after roll (Z). Degenerate at pitch ±90°. */
export const eulerYXZ = (pitch: number, yaw: number, roll: number): Mat4 => {
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cz = Math.cos(roll);
  const sz = Math.sin(roll);
  const rx = new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1]);
  const ry = new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1]);
  const rz = new Float32Array([cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  return mat4.multiply(ry, mat4.multiply(rx, rz));
};

export type Ray = { origin: Vec3; direction: Vec3 };

export type TriangleHit = {
  t: number;
  u: number;
  v: number;
  point: Vec3;
};

/**
 * Ray vs triangle, barycentric on the plane.
 *
 * A point on the triangle is A + u (B−A) + v (C−A), with u ≥ 0, v ≥ 0, u+v ≤ 1.
 * A point on the ray is origin + t direction, t ≥ 0.
 * Set them equal and solve the 3×3 with triple products (Möller–Trumbore).
 */
export const intersectRayTriangle = (
  ray: Ray,
  a: Vec3,
  b: Vec3,
  c: Vec3
): TriangleHit | null => {
  const edge1 = vec3.sub(b, a);
  const edge2 = vec3.sub(c, a);
  const pvec = vec3.cross(ray.direction, edge2);
  const det = vec3.dot(edge1, pvec);
  if (Math.abs(det) < EPS) {
    return null;
  }
  const inv = 1 / det;
  const tvec = vec3.sub(ray.origin, a);
  const u = vec3.dot(tvec, pvec) * inv;
  if (u < 0 || u > 1) {
    return null;
  }
  const qvec = vec3.cross(tvec, edge1);
  const v = vec3.dot(ray.direction, qvec) * inv;
  if (v < 0 || u + v > 1) {
    return null;
  }
  const t = vec3.dot(edge2, qvec) * inv;
  if (t < 0) {
    return null;
  }
  return {
    t,
    u,
    v,
    point: vec3.add(ray.origin, vec3.scale(ray.direction, t)),
  };
};

/** Pixel → world ray: unproject the near and far clip points, then subtract. */
export const rayFromNdc = (
  ndcX: number,
  ndcY: number,
  view: Mat4,
  projection: Mat4
): Ray | null => {
  const inv = mat4.invert(mat4.multiply(projection, view));
  if (!inv) {
    return null;
  }
  const near = mat4.transformPoint(inv, [ndcX, ndcY, -1]);
  const far = mat4.transformPoint(inv, [ndcX, ndcY, 1]);
  return {
    origin: near,
    direction: vec3.normalize(vec3.sub(far, near)),
  };
};

export const formatMat4 = (m: Mat4): string => {
  const cell = (i: number) => m[i].toFixed(2).padStart(7);
  const rows = [0, 1, 2, 3].map(
    (row) =>
      `${cell(row)} ${cell(row + 4)} ${cell(row + 8)} ${cell(row + 12)}`
  );
  return rows.join("\n");
};

const selfCheck = () => {
  const hit = intersectRayTriangle(
    { origin: [0.25, 0.25, 1], direction: [0, 0, -1] },
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0]
  );
  if (!hit || Math.abs(hit.t - 1) > 1e-5 || Math.abs(hit.u - 0.25) > 1e-5) {
    throw new Error("ray-triangle self-check failed");
  }

  const view = mat4.lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);
  const inverse = mat4.invert(view);
  if (!inverse) {
    throw new Error("lookAt invert failed");
  }
  const identity = mat4.multiply(inverse, view);
  if (Math.abs(identity[0] - 1) > 1e-4 || Math.abs(identity[15] - 1) > 1e-4) {
    throw new Error("mat4 invert self-check failed");
  }
};

selfCheck();
