# 에듀잇티 브랜드 마크

## `mathmon-brand-mark-v1`

`mathmon-brand-mark-v1`은 모든 매스몬 단원·차시의 상단 브랜드 배지에서
공통으로 쓰는 보라색 구름 마크다.

- 원본: `mathmon-cloud-mark-source.png` (생성형 크로마키 원본)
- 마스터: `mathmon-cloud-mark.png` (배경 제거 RGBA PNG)
- 실행용: `mathmon-cloud-mark.webp` (학생 화면용 WebP)
- 공통 스타일: `mathmon-brand.css`
- 계약 등록: `mathmon-brand-mark.json`

빌드 시 `mathmon-brand.css` 내용은 각 standalone `index.html`의 inline
`<style>`에 포함된다. `_shared/brand/mathmon-brand.css`는 모든 차시가 같은
규칙을 공유하도록 하는 원본 계약이며, 학생용 실행 파일은 외부 CSS 링크 없이도
완성된 배지를 표시한다.

### 마크업 계약

보이는 차시 브랜드 배지는 다음 이미지 계약을 사용한다.

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

브랜드명은 접근성을 위해 실제 HTML 텍스트로 유지한다. 단원·상태 표시 점은
별도 요소이며 구름 마크로 대체하지 않는다. 구름은 생성형 비트맵이므로 CSS는
크기만 조정하고 pseudo-element·gradient로 실루엣을 다시 만들지 않는다.

기존 `eduitit-logo-mark.png`는 이전 패키지 호환을 위한 레거시 자산으로만
보관한다. 새 차시와 공통 수정에서는 `mathmon-brand-mark-v1`을 사용한다.
