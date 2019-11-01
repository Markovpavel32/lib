<template>
  <div class="jumbotron">
    <h2>{{ $gettext('404 Not Found!') }}</h2>
    <br />
    <p>{{ $gettext('Такой страницы не существует. Ничего страшного, вы всегда можете вернуться на') }}
        <a href="/">{{ $gettext('главную') }}</a></p>
    </div>
</template>

<script>
  export default {
    name: 'not-found'
  }
</script>
