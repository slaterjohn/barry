# Rules

## 1. Structural elements have no style
Structural element will never define styling. Structure should do only structure, styling is left to elements or theme.

Typically elements that are structural in Project Barry are within sass files prefixed with `_structure.`

## 2. Only set the properties you need to change
If you find yourself using CSS shorthand to set values for only a few of the properties then you're probably doing it wrong.

`margin:` and `padding:` are pretty dangerous in the OCSS world and lead to unnecessary overwriting of properties. So it's probably best you stick with `padding-top:5px`, `padding-right:10px` and `padding-bottom:5px` instead of `padding: 5px 10px 5px 0` if you don't need to reset `padding-left` to `0`.

## No IDs
The only time you'll see an `#id` in Barry is when someone made a mistake. IDs bring all sorts of problems when used for styling, so we don't use them. Classes do a very good job and play fairly when used without IDs in the mix.

Javascript however may sometimes target the IDs on an element, this is fine, as long as that's where it ends.