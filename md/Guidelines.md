# Guidelines
It's better we all follow the same rules when it comes to modifying Barry. You may not agree with every single one of the guidelines, which you're allowed to do, but if everyone follows them Barry stays consistent.

## Scss File Names
Barry uses `.scss` files during development so it can be built in a modular way. This makes it super easy to manage down the line and means merging in your pull requests is so much easier than if it was a single file.

Because it's modular and Project Barry comes with a lot of files lets make sure we follow the same naming convention.

	// Generic File
	_elements.button.scss
	
	// Partial
	_elements.button.scss
	^---- Lets Sass know not to parse it alone
	
	// Group
	_elements.button.scss
	     ^----- All objects are placed in groups.
	            Each object should have the group
	            prefixed to it's file name.
	            
	// Object
	_elements.button.scss
	             ^---- Object name. Singular.
	                   It should never be `buttons` or 
	                   `fields`. It's always singular.
	                   

## Modifier Names
- Flexible Width: `fluid`
- Fixed Width: `fixed`
- Large: `--large`
	