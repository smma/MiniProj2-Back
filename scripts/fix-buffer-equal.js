#!/usr/bin/env node

/**
 * Fix for buffer-equal-constant-time compatibility with Node.js v21+
 * SlowBuffer was removed in Node.js v21, so we need to handle it gracefully
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../node_modules/buffer-equal-constant-time/index.js');

if (!fs.existsSync(filePath)) {
  console.log('buffer-equal-constant-time not found, skipping fix');
  process.exit(0);
}

let content = fs.readFileSync(filePath, 'utf8');

// Check if already patched
if (content.includes('SlowBuffer || Buffer')) {
  console.log('buffer-equal-constant-time already patched');
  process.exit(0);
}

// Apply the patch
content = content.replace(
  /var SlowBuffer = require\('buffer'\)\.SlowBuffer;/,
  "var SlowBuffer = require('buffer').SlowBuffer || Buffer; // Fallback for Node.js v21+"
);

// Fix the install function
content = content.replace(
  /bufferEq\.install = function\(\) \{\s+Buffer\.prototype\.equal = SlowBuffer\.prototype\.equal = function equal\(that\) \{\s+return bufferEq\(this, that\);\s+\};\s+\};/,
  `bufferEq.install = function() {
  Buffer.prototype.equal = function equal(that) {
    return bufferEq(this, that);
  };
  if (SlowBuffer && SlowBuffer.prototype) {
    SlowBuffer.prototype.equal = function equal(that) {
      return bufferEq(this, that);
    };
  }
};`
);

// Fix the restore function
content = content.replace(
  /var origBufEqual = Buffer\.prototype\.equal;\s+var origSlowBufEqual = SlowBuffer\.prototype\.equal;\s+bufferEq\.restore = function\(\) \{\s+Buffer\.prototype\.equal = origBufEqual;\s+SlowBuffer\.prototype\.equal = origSlowBufEqual;\s+\};/,
  `var origBufEqual = Buffer.prototype.equal;
var origSlowBufEqual = (SlowBuffer && SlowBuffer.prototype) ? SlowBuffer.prototype.equal : undefined;
bufferEq.restore = function() {
  Buffer.prototype.equal = origBufEqual;
  if (SlowBuffer && SlowBuffer.prototype && origSlowBufEqual !== undefined) {
    SlowBuffer.prototype.equal = origSlowBufEqual;
  }
};`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Fixed buffer-equal-constant-time for Node.js v21+ compatibility');

