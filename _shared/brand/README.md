# Mathmon brand mark

`mathmon-brand-mark-v1` is the shared Eduitit Mathmon cloud mark used by every
unit and lesson package.

- Source: `mathmon-cloud-mark-source.png` (generated chroma-key original)
- Master: `mathmon-cloud-mark.png` (background-removed RGBA PNG)
- Runtime: `mathmon-cloud-mark.webp` (student-facing WebP)
- Component stylesheet: `mathmon-brand.css`

The component stylesheet is copied into each standalone lesson `index.html` at
build time. The shared CSS file remains the canonical source for all packages;
student-facing pages do not depend on an external stylesheet request.

## Markup contract

Every visible lesson brand badge uses the same image contract:

```html
<img
  class="mathmon-brand-mark"
  data-brand-mark="mathmon-cloud-mark-v1"
  src="../_shared/brand/mathmon-cloud-mark.webp"
  width="1075"
  height="762"
  alt=""
  aria-hidden="true"
>
```

The brand name remains real HTML text for accessibility. Unit/status dots are
separate controls and must not be replaced by the cloud mark. The cloud is a
generated bitmap; CSS may size it, but must not recreate its silhouette with
pseudo-elements or gradients.
