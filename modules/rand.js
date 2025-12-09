class SeededRandom {
  constructor(seed) {
    // Convert the input seed to a BigInt. Use 1n if the seed is null/undefined.
    this.seed = BigInt(seed || 1n);

    // Using standard 64-bit LCG parameters for a period of 2^64
    this.m = BigInt(0x10000000000000000n); // Modulus: 2^64
    this.a = BigInt(25214903917n);         // Multiplier (Java standard)
    this.c = BigInt(11n);                  // Increment

    // Store the initial seed and float modulus for normalization
    this._initialSeed = this.seed;
    this._mFloat = Number(this.m);
  }

  next() {
    this.seed = (this.a * this.seed + this.c) % this.m;
    // Normalize BigInt result to a standard JavaScript number (double)
    return Number(this.seed) / this._mFloat;
  }

  // Helper function for matrix multiplication, now using BigInts
  _multiplyMatrices(mat1, mat2, modulus) {
    const result = [
      [0n, 0n],
      [0n, 0n]
    ];
    result[0][0] = (mat1[0][0] * mat2[0][0] + mat1[0][1] * mat2[1][0]) % modulus;
    result[0][1] = (mat1[0][0] * mat2[0][1] + mat1[0][1] * mat2[1][1]) % modulus;
    result[1][0] = (mat1[1][0] * mat2[0][0] + mat1[1][1] * mat2[1][0]) % modulus;
    result[1][1] = (mat1[1][0] * mat2[0][1] + mat1[1][1] * mat2[1][1]) % modulus;
    return result;
  }

  // Helper function for matrix exponentiation (exponentiation by squaring)
  _matrixPower(baseMatrix, exponent, modulus) {
    let resultMatrix = [
      [1n, 0n],
      [0n, 1n]
    ]; // Identity matrix (BigInts)
    let currentBase = baseMatrix;
    let exp = BigInt(exponent); // Use BigInt for exponent tracking

    while (exp > 0n) {
      if (exp % 2n === 1n) {
        resultMatrix = this._multiplyMatrices(resultMatrix, currentBase, modulus);
      }
      currentBase = this._multiplyMatrices(currentBase, currentBase, modulus);
      exp = exp / 2n;
    }
    return resultMatrix;
  }

  get(index) {
    index = Math.floor(Math.abs(index));
    if (index === 0) {
      // Return the value corresponding to the initial seed
      return Number(this._initialSeed) / this._mFloat;
    }

    // LCG transformation matrix: [[a, c], [0, 1]] (BigInts)
    const transformationMatrix = [
      [this.a, this.c],
      [0n, 1n]
    ];

    // Calculate (transformationMatrix)^index
    const poweredMatrix = this._matrixPower(transformationMatrix, index, this.m);

    // Apply the powered matrix to the initial state [seed, 1]
    const nthSeedBigInt = (poweredMatrix[0][0] * this._initialSeed + poweredMatrix[0][1] * 1n) % this.m;

    // Return the normalized number
    return Number(nthSeedBigInt) / this._mFloat;
  }
}

// Example Usage:
// Define a 'seed' variable globally accessible if needed, or pass it directly to the constructor
const seedrand = new SeededRandom(seed*100000);
