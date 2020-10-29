# Focal point fieldtype for Perch CMS
`focalpoint` is a custom fieldtype allowing you to visually selecyt a focal point on an existing Perch image.

## Requirements
- Perch CMS v3+

## Installation
Download and place the `focalpoint` folder in `perch\addons\fieldtypes` folder

## Usage
Add new field with a type of `focalpoint`..
```html
<perch:content type="image" id="image_field_id" label="Image">
<perch:content id="focalpoint" type="focalpoint" image="image_field_id" output="background-position">
```
Ensure you set the correct `id` for the field that contains the image using the `image` attribute.  This will create a focal point button and preview in the editor.

The `output` attribute can be set to `background-position` which will produce an inline CSS `background-position: 12.5% 77.25%` for example.

This `output` attribute can be omitted to output raw, comma separated coordinate values. Coordinates range from `-1` to `1` on both the `x` and `y` axes. This can be used to calculate percentages for absolutely positioned images when the container size is known.

## Attributions
This fieldtype makes use of the excellent, dependency free [image-focus](https://github.com/third774/image-focus) utility by [Kevin Kipp](https://github.com/third774).


