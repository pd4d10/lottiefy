#!/bin/bash

# Clear
rm -rf next/ccElements next/shapes next/effects next/CCRenderer.js

# Renderer
cp lottie-web/player/js/renderers/SVGRenderer.js next/CCRenderer.js
gsed -i 's/SVG/CC/g' next/CCRenderer.js

# Elements
mkdir next/ccElements
cp -r lottie-web/player/js/elements/svgElements/SVG* next/ccElements
rename "s/SVG/CC/" next/ccElements/SVG*
gsed -i 's/SVG/CC/g' next/ccElements/CC*

# Effects
mkdir next/effects
cp -r lottie-web/player/js/elements/svgElements/effects/SVG* next/effects
rename "s/SVG/CC/" next/effects/SVG*
gsed -i 's/SVG/CC/g' next/effects/CC*

cp -r lottie-web/player/js/elements/svgElements/SVG* next/ccElements

# Shapes
mkdir next/shapes
cp -r lottie-web/player/js/elements/helpers/shapes/SVG* next/shapes
rename "s/SVG/CC/" next/shapes/SVG*
gsed -i 's/SVG/CC/g' next/shapes/CC*
