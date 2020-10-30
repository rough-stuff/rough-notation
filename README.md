![Rough Notation logo](https://roughnotation.com/images/social.png)

# Rough Notation

A small JavaScript library to create and animate annotations on a web page.

Rough Notation uses [RoughJS](https://roughjs.com) to create a hand-drawn look and feel. Elements can be annotated in a number of different styles. Animation duration can be configured, or just turned off.

Rough Notation is 3.83kb in size when gzipped.

[Visit website to see it in action](https://roughnotation.com/) and check out the [source code](https://github.com/pshihn/rough-notation-web) for the website

## Installation

You can add rough-notation to your project via npm

```
npm install --save rough-notation
```

Or load the ES module directly

```html
<script type="module" src="https://unpkg.com/rough-notation?module"></script>
```

Or load the IIFE version which created a `RoughNotation` object in your scope.

```html
<script src="https://unpkg.com/rough-notation/lib/rough-notation.iife.js"></script>
```

## Usage

Create an `annotation` object by passing the element to annotate, and a config to describe the annotation style. 
Once you have the annotation object, you can call `show()` on it to show the annotation

```javascript
import { annotate } from 'rough-notation';
// Or using unpkg
// import { annotate } from 'https://unpkg.com/rough-notation?module';

const e = document.querySelector('#myElement');
const annotation = annotate(e, { type: 'underline' });
annotation.show();
```

*Note: This will add an SVG element as a sibling to the element, which may be troublesome in certain situations like in a `<table>`. You may want to create an inner `<span>` or `<div>` for the content to annotate.*

## Annotation Group

rough-notation provides a way to order the animation of annotations by creating an annotation-group. Pass the list of annotations to create a group. When show is called on the group, the annotations are animated in order.

```javascript
import { annotate, annotationGroup } from 'rough-notation';

const a1 = annotate(document.querySelector('#e1'), { type: 'underline' });
const a2 = annotate(document.querySelector('#e3'), { type: 'box' });
const a3 = annotate(document.querySelector('#e3'), { type: 'circle' });

const ag = annotationGroup([a3, a1, a2]);
ag.show();
```

## Live examples
I have created some basic examples on Glitch for you to remix and play with the code:

[Basic demo](https://glitch.com/~basic-rough-notation)

[Annotation group demo](https://glitch.com/~annotation-group)

## Configuring the Annotation

When you create an annotation object, you pass in a config. The config only has one mandatory field, which is the `type` of the annotation. But you can configure the annotation in many ways. 

#### type
This is a mandatory field. It sets the annotation style. Following are the list of supported annotation types:

* __underline__: This style creates a sketchy underline below an element.
* __box__: This style draws a box around the element.
* __circle__: This style draws a circle around the element.
* __highlight__: This style creates a highlight effect as if marked by a highlighter.
* __strike-through__: This style draws horizontal lines through the element.
* __crossed-off__: This style draws an 'X' across the element.
* __bracket__: This style draws a bracket around an element, usually a paragraph of text. By default on the right side, but can be configured to any or all of *left, right, top, bottom*.

#### animate
Boolean property to turn on/off animation when annotating. Default value is `true`.

#### animationDuration
Duration of the animation in milliseconds. Default is `800ms`.

#### color
String value representing the color of the annotation sketch. Default value is `currentColor`.

#### strokeWidth
Width of the annotation strokes. Default value is `1`. 

#### padding
Padding between the element and roughly where the annotation is drawn. Default value is `5` (in pixels).
If you wish to specify different `top`, `left`, `right`, `bottom` paddings, you can set the value to an array akin to CSS style padding `[top, right, bottom, left]` or just `[top & bottom, left & right]`.

#### multiline
This property only applies to inline text. To annotate multiline text (each line separately), set this property to `true`. 

#### iterations
By default annotations are drawn in two iterations, e.g. when underlining, drawing from left to right and then back from right to left. Setting this property can let you configure the number of iterations. 

#### brackets
Value could be a string or an array of strings, each string being one of these values: **left, right, top, bottom**. When drawing a bracket, this configures which side(s) of the element to bracket. Default value is `right`.

#### rtl
By default annotations are drawn from left to right. To start with right to left, set this property to `true`. 

## Annotation Object

When you call the `annotate` function, you get back an annotation object, which has the following methods:

#### isShowing(): boolean
Returns if the annotation is showing

#### show()
Draws the annotation. If the annotation is set to animate (default), it will animate the drawing. If called again, it will re-render the annotation, updating any size or location changes. 

*Note: to reanimate the annotation, call `hide()` and then `show()` again.

#### hide()
Hides the annotation if showing. This is not animated. 

#### remove()
Unlinks the annotation from the element. 

#### Updating styles
All the properties in the configuration are also exposed in this object. e.g. if you'd like to change the color, you can do that after the annotation has been drawn.

```javascript
const e = document.querySelector('#myElement');
const annotation = annotate(e, { type: 'underline', color: 'red' });
annotation.show();
annotation.color = 'green';
```

*Note: the type of the annotation cannot be changed. Create a new annotation for that.*

## Annotation Group Object

When you call the `annotationGroup` function, you get back an annotation group object, which has the following methods:

#### show()
Draws all the annotations in order. If the annotation is set to animate (default), it will animate the drawing. 

#### hide()
Hides all the annotations if showing. This is not animated.

## Wrappers

Others have created handy Rough Notation wrappers for multiple libraries and frameworks:

-   [React Rough Notation](https://github.com/linkstrifer/react-rough-notation)
-   [Svelte Rough Notation](https://github.com/dimfeld/svelte-rough-notation)
-   [Vue Rough Notation](https://github.com/Leecason/vue-rough-notation)
-   [Web Component Rough Notation](https://github.com/Matsuuu/vanilla-rough-notation)
-   [Angular Rough Notation](https://github.com/mikyaj/ngx-rough-notation)

## Contributors

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/rough/contribute)]

#### Individuals

<a href="https://opencollective.com/rough"><img src="https://opencollective.com/rough/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/rough/contribute)]

<a href="https://opencollective.com/rough/organization/0/website"><img src="https://opencollective.com/rough/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/rough/organization/1/website"><img src="https://opencollective.com/rough/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/rough/organization/2/website"><img src="https://opencollective.com/rough/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/rough/organization/3/website"><img src="https://opencollective.com/rough/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/rough/organization/4/website"><img src="https://opencollective.com/rough/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/rough/organization/5/website"><img src="https://opencollective.com/rough/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/rough/organization/6/website"><img src="https://opencollective.com/rough/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/rough/organization/7/website"><img src="https://opencollective.com/rough/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/rough/organization/8/website"><img src="https://opencollective.com/rough/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/rough/organization/9/website"><img src="https://opencollective.com/rough/organization/9/avatar.svg"></a>
