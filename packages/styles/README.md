## General styles
`@xm-ngx/styles` is a part of the [xm-webapp].
This package is a collection of mixins, functions, and variables.

[xm-webapp]: https://github.com/xm-online/xm-webapp

### How to start
Provide the dependency into the root `/node_modules`.
In the root directory of the `xm-webapp` project you should run:
```shell script
npm run npm-link 
```

### How to create theme
You should create a `src/app/styles/theme.scss` file.

```scss
// Import material variables
@import '~@angular/material/theming';

// Override the variable
$xm-primary-palette: $mat-teal;

// Init a theme
@import '~@xm-ngx/styles/theming';
```

### How to use it
Create a component.
Add import your theme at your `component.scss` file: 

###### Example - use the variable:
```scss
// import from /src/app/styles/theme
@import 'theme'; 

// Create a class
.xm-body-feature{
  // Assign a variable
  background: $xm-background;
}
```
###### Example - use the $xm-theme
```scss
// import from /src/app/styles/theme
@import 'theme';

// Create a mixin
@mixin xm-body-feature-theme($theme){
  // Get variable
  $background: map-get($theme, xm-background);
  // Assign a variable
  background: $background;
}
```
```scss
// Create your class from theme
.xm-body-feature-theme{
  @include xm-body-feature($xm-theme);
}
```
### How to create and use a tenant theme
Create a tenant `feature-webapp-ext`.
And create a theme file `feature-webapp-ext/theme.scss`.
###### Example - feature-webapp-ext/theme.scss
```scss
@import '~@angular/material/theming';
$xm-primary-palette: $mat-teal;
@import '~@xm-ngx/styles/theming';
```

Create a component inside your tenant.
###### Example - use the tenant theme
```scss
// import from /src/app/ext/feature-webapp-ext/theme
@import 'feature-webapp-ext/theme';

// Create a class
.xm-feature-webapp-ext {
  // Assign a variable
  background: $xm-background;
}
```

### How to override the theme from your tenant
Run the next script and set a `file` path.
Make sure you do this before building your app.
```shell script
node ./scripts/replace-styles.js theme ./src/app/ext/feature-ext/your-theme.scss
```

### Vendors
Sync our styles with popular packages:

| Packages                  | Usage                                                            |
| ------------------------- |:----------------------------------------------------------------:|
| [@angular/material]       | `@import "~@xm-ngx/styles/src/vendor/angular-material"`          |
| [bootstrap]               | `@import "~@xm-ngx/styles/src/vendor/bootstrap-theme"`           |

[@angular/material]: https://github.com/angular/components
[bootstrap]: https://getbootstrap.com/docs/4.4/getting-started/introduction/

### Contribution

Please, follow the next suggestions:
- https://sass-guidelin.es/ ;
- Do not provide any css classes, only with mixins or functions, because this may effect other projects;
- Prevent style duplication;
- Use scss variables, extend and inherit them.
