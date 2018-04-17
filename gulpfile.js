// include gulp
var gulp = require('gulp')

var wrap = require('gulp-wrap')
var concat = require('gulp-concat')
var fs = require('fs')

var bm_version = '5.1.10'

var moduleWrap = fs.readFileSync('./lottie-web/player/js/module.js', 'utf8')
moduleWrap = moduleWrap.replace('/*<%= contents %>*/', '<%= contents %>')
moduleWrap = moduleWrap.replace('[[BM_VERSION]]', bm_version)

var srcs = [
  'lottie-web/player/js/main.js',
  'lottie-web/player/js/utils/common.js',
  'lottie-web/player/js/utils/BaseEvent.js',
  'lottie-web/player/js/utils/helpers/arrays.js',
  'lottie-web/player/js/utils/helpers/svg_elements.js',
  'lottie-web/player/js/utils/helpers/html_elements.js',
  'lottie-web/player/js/utils/helpers/dynamicProperties.js',
  'lottie-web/player/js/3rd_party/transformation-matrix.js',
  'lottie-web/player/js/3rd_party/seedrandom.js',
  'lottie-web/player/js/3rd_party/BezierEaser.js',
  'lottie-web/player/js/utils/animationFramePolyFill.js',
  'lottie-web/player/js/utils/functionExtensions.js',
  'lottie-web/player/js/utils/bez.js',
  'lottie-web/player/js/utils/DataManager.js',
  'lottie-web/player/js/utils/FontManager.js',
  'lottie-web/player/js/utils/PropertyFactory.js',
  'lottie-web/player/js/utils/TransformProperty.js',
  'lottie-web/player/js/utils/shapes/ShapePath.js',
  'lottie-web/player/js/utils/shapes/ShapeProperty.js',
  'lottie-web/player/js/utils/shapes/ShapeModifiers.js',
  'lottie-web/player/js/utils/shapes/TrimModifier.js',
  'lottie-web/player/js/utils/shapes/RoundCornersModifier.js',
  'lottie-web/player/js/utils/shapes/RepeaterModifier.js',
  'lottie-web/player/js/utils/shapes/ShapeCollection.js',
  'lottie-web/player/js/utils/shapes/DashProperty.js',
  'lottie-web/player/js/utils/shapes/GradientProperty.js',
  'lottie-web/player/js/utils/imagePreloader.js',
  'lottie-web/player/js/utils/featureSupport.js',
  'lottie-web/player/js/utils/filters.js',
  'lottie-web/player/js/utils/text/TextAnimatorProperty.js',
  'lottie-web/player/js/utils/text/TextAnimatorDataProperty.js',
  'lottie-web/player/js/utils/text/LetterProps.js',
  'lottie-web/player/js/utils/text/TextProperty.js',
  'lottie-web/player/js/utils/text/TextSelectorProperty.js',
  'lottie-web/player/js/utils/pooling/pool_factory.js',
  'lottie-web/player/js/utils/pooling/pooling.js',
  'lottie-web/player/js/utils/pooling/point_pool.js',
  'lottie-web/player/js/utils/pooling/shape_pool.js',
  'lottie-web/player/js/utils/pooling/shapeCollection_pool.js',
  'lottie-web/player/js/utils/pooling/segments_length_pool.js',
  'lottie-web/player/js/utils/pooling/bezier_length_pool.js',
  'lottie-web/player/js/renderers/BaseRenderer.js',
  'lottie-web/player/js/renderers/SVGRenderer.js',

  'next/CCRenderer.js',

  'lottie-web/player/js/renderers/CanvasRenderer.js',
  'lottie-web/player/js/renderers/HybridRenderer.js',
  'lottie-web/player/js/mask.js',
  'lottie-web/player/js/elements/helpers/HierarchyElement.js',
  'lottie-web/player/js/elements/helpers/FrameElement.js',
  'lottie-web/player/js/elements/helpers/TransformElement.js',
  'lottie-web/player/js/elements/helpers/RenderableElement.js',
  'lottie-web/player/js/elements/helpers/RenderableDOMElement.js',
  'lottie-web/player/js/elements/helpers/shapes/ProcessedElement.js',
  'lottie-web/player/js/elements/helpers/shapes/SVGStyleData.js',
  'lottie-web/player/js/elements/helpers/shapes/SVGShapeData.js',
  'lottie-web/player/js/elements/helpers/shapes/SVGTransformData.js',
  'lottie-web/player/js/elements/helpers/shapes/SVGStrokeStyleData.js',
  'lottie-web/player/js/elements/helpers/shapes/SVGFillStyleData.js',
  'lottie-web/player/js/elements/helpers/shapes/SVGGradientFillStyleData.js',
  'lottie-web/player/js/elements/helpers/shapes/SVGGradientStrokeStyleData.js',
  'lottie-web/player/js/elements/helpers/shapes/ShapeGroupData.js',
  'lottie-web/player/js/elements/BaseElement.js',
  'lottie-web/player/js/elements/NullElement.js',
  'lottie-web/player/js/elements/svgElements/SVGBaseElement.js',
  'lottie-web/player/js/elements/ShapeElement.js',
  'lottie-web/player/js/elements/TextElement.js',
  'lottie-web/player/js/elements/CompElement.js',
  'lottie-web/player/js/elements/ImageElement.js',
  'lottie-web/player/js/elements/SolidElement.js',

  'next/elements/CCBaseElement.js',
  'next/elements/CCCompElement.js',
  'next/elements/CCImageElement.js',
  'next/elements/CCSolidElement.js',
  'next/elements/CCTextElement.js',

  'lottie-web/player/js/elements/svgElements/SVGCompElement.js',
  'lottie-web/player/js/elements/svgElements/SVGTextElement.js',
  'lottie-web/player/js/elements/svgElements/SVGShapeElement.js',
  'lottie-web/player/js/elements/svgElements/effects/SVGTintEffect.js',
  'lottie-web/player/js/elements/svgElements/effects/SVGFillFilter.js',
  'lottie-web/player/js/elements/svgElements/effects/SVGStrokeEffect.js',
  'lottie-web/player/js/elements/svgElements/effects/SVGTritoneFilter.js',
  'lottie-web/player/js/elements/svgElements/effects/SVGProLevelsFilter.js',
  'lottie-web/player/js/elements/svgElements/effects/SVGDropShadowEffect.js',
  'lottie-web/player/js/elements/svgElements/effects/SVGMatte3Effect.js',
  'lottie-web/player/js/elements/svgElements/SVGEffects.js',
  'lottie-web/player/js/elements/canvasElements/CVContextData.js',
  'lottie-web/player/js/elements/canvasElements/CVBaseElement.js',
  'lottie-web/player/js/elements/canvasElements/CVImageElement.js',
  'lottie-web/player/js/elements/canvasElements/CVCompElement.js',
  'lottie-web/player/js/elements/canvasElements/CVMaskElement.js',
  'lottie-web/player/js/elements/canvasElements/CVShapeElement.js',
  'lottie-web/player/js/elements/canvasElements/CVSolidElement.js',
  'lottie-web/player/js/elements/canvasElements/CVTextElement.js',
  'lottie-web/player/js/elements/canvasElements/CVEffects.js',
  'lottie-web/player/js/elements/htmlElements/HBaseElement.js',
  'lottie-web/player/js/elements/htmlElements/HSolidElement.js',
  'lottie-web/player/js/elements/htmlElements/HCompElement.js',
  'lottie-web/player/js/elements/htmlElements/HShapeElement.js',
  'lottie-web/player/js/elements/htmlElements/HTextElement.js',
  'lottie-web/player/js/elements/htmlElements/HImageElement.js',
  'lottie-web/player/js/elements/htmlElements/HCameraElement.js',
  'lottie-web/player/js/elements/htmlElements/HEffects.js',
  'lottie-web/player/js/animation/AnimationManager.js',
  'lottie-web/player/js/animation/AnimationItem.js',

  // Rewrite AnimationItem
  'next/rewriteAnimationItem.js',

  'lottie-web/player/js/utils/expressions/Expressions.js',
  'lottie-web/player/js/utils/expressions/ExpressionManager.js',
  'lottie-web/player/js/utils/expressions/ExpressionPropertyDecorator.js',
  'lottie-web/player/js/utils/expressions/ExpressionTextPropertyDecorator.js',
  'lottie-web/player/js/utils/expressions/ShapeInterface.js',
  'lottie-web/player/js/utils/expressions/TextInterface.js',
  'lottie-web/player/js/utils/expressions/LayerInterface.js',
  'lottie-web/player/js/utils/expressions/CompInterface.js',
  'lottie-web/player/js/utils/expressions/TransformInterface.js',
  'lottie-web/player/js/utils/expressions/ProjectInterface.js',
  'lottie-web/player/js/utils/expressions/EffectInterface.js',
  'lottie-web/player/js/utils/expressions/MaskInterface.js',
  'lottie-web/player/js/utils/expressions/ExpressionValue.js',
  'lottie-web/player/js/effects/SliderEffect.js',
  'lottie-web/player/js/effects/EffectsManagerPlaceholder.js',
  'lottie-web/player/js/EffectsManager.js',
]

gulp.task('buildFull', function() {
  return gulp
    .src(srcs)
    .pipe(concat('lottie.js'))
    .pipe(wrap(moduleWrap))
    .pipe(gulp.dest('dist/'))
})

gulp.task('default', function() {
  return gulp.watch(['lottie-web/player/**/*', 'next/**/*'], ['buildFull'])
})
