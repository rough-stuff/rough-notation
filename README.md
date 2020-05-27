# Rough Notation

A small JavaScript library to create and animate annotations on a web page

Rough Notation uses [RoughJS](https://roughjs.com) to create a hand-drawn look and feel. Elements can be annotated in a number of different styles. Animation duration and delay can be configured, or just turned off.

Rough Notation is about 3.2kb in size when gzipped.

[Visit website to see it in action](https://roughnotation.com/)

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
<script type="module" src="https://unpkg.com/rough-notation"></script>
```

## Usage

Create an `annotation` object by passing the element to annotate, and a config to describe the annotation style. 
Once you have the annotation object, you can call `show()` or `hide()` on it to show the annotation

```javascript
import { annotate } from 'rough-notation';

const e = document.quereySelector('#myElement');
const annotation = annotate(e, { type: 'underline' });
annotation.show();
```

## Annotation Group

rough-notation provides a way to order the animation of annotations by creating an annotation-group. Pass the list of annotations to create a group. When show is called on the group, the annotations are animated in order.

```javascript
import { annotate, annotationGroup } from 'rough-notation';

const a1 = annotate(document.quereySelector('#e1'), { type: 'underline' });
const a2 = annotate(document.quereySelector('#e3'), { type: 'box' });
const a3 = annotate(document.quereySelector('#e3'), { type: 'circle' });

const ag = annotationGroup([a3, a1, a2]);
ag.show();
```

## Configuring the Annotation

When you create an annotation object, you pass in a config. The config only has one mandatory field, which is the `type` of the annotation. But you can configure the annotation in many ways. 

export interface RoughAnnotationConfig {
  type: RoughAnnotationType;
  animate?: boolean; // defaults to true
  animationDuration?: number; // defaulst to 1000ms
  animationDelay?: number; // default = 0
  color?: string; // defaults to currentColor
  strokeWidth?: number; // default based on type
  padding?: number; // defaults to 5px
}


#### type
This is a mandatory field. It sets the annotation style. Following are the list of supported annotation types:

* __underline__: Create a sketchy underline below an element.
* __box__: This style draws a box around the element.
* __circle__: Draw a circle around the element.
* __highlight__: Creates a highlight effect as if maked by a highlighter.
* __strike-through__: This style draws a box around the element.
* __crossed-off__: This style draws a box around the element.

#### animate
Boolean property to turn on/off animation when annotating. Default value is `true`.


#### animationDuration
Duration of the animation in milliseconds. Default is `800ms`.


#### animationDelay
Delay in animation in milliseconds. Default is `0ms`.


#### color
String value representing the color of the annotation sketch. Default value is `currentColor`.

#### strokeWidth
Width of the annotation strokes. Default value is `1`. 


#### padding
Padding between the element and roughly where the annotation is drawn. Default value is `5` (in pixels).


