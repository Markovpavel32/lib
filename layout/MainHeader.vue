<template>
  <div class="row row-no-padding wrapper border-bottom white-bg page-heading page-heading-sm">
      <div class="cell">
        <slot name="actions">
        </slot>
      </div>
      <div class="cell full-with">
          <div class="m-l">
              <slot name="header">
                <h2 id="main-page-title">{{ title }}</h2>
              </slot>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Default header'
    },
  },
  name: 'main-header'
}
</script>
