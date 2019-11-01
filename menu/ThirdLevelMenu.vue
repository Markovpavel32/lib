<template>
  <div>
      <template v-if="show_menu">
      <div class="row row-no-padding page-wrapper page-heading page-heading-sm page-heading-no-bottom third_level_menu__title" :class="{'white-bg': white_background}">
        <slot name="footer"></slot>
        <div class="cell page-heading-actions">
        </div>
        <div class="page-heading-cell cell">
          <div>
            <!--TODO MPI: добавить отдельный стиль на #main-page-title -->
            <h2 v-if="!$yandex" id="main-page-title"><slot name="title"></slot></h2>
            <h1 v-else id="main-page-title"><slot name="title"></slot></h1>
            <div class="clearfix" id="breadcrumbs-menu">
                <ol class="breadcrumb third-level-menu">
                  <template v-if="menu_item">
                  <li v-for="menu in menu_item.children" :class="{'active bold': menu.is_active}" v-if="!menu.menu.is_hidden">
                    <router-link :to="{ name: menu.menu.name, params: $router.params }">{{menu.menu.title}}</router-link>
                    <ol class="breadcrumb four-level-menu" v-if="menu.children.length">

                      <li v-for="child_menu in menu.children" :class="{'active bold': child_menu.is_active}" v-if="!child_menu.menu.is_hidden">
                        <router-link :to="{ name: child_menu.menu.name, params: $router.params }">{{child_menu.menu.title}}</router-link>
                      </li>
                      <template v-if="menu.children.length">)</template>
                    </ol>
                  </li>
                  </template>
                </ol>
            </div>
          </div>
        </div>
        <slot name="heading_footer"></slot>
      </div>
    <div class="wrapper wrapper-content clearfix row row-no-padding third_level_menu__content">
      <slot name="content"></slot>
    </div>
    </template>
    <template v-else>
      <slot name="content"></slot>
    </template>
  </div>
</template>

<script>
  import {menu} from './content'
  import {RoutedMenu} from './menu'

  export default {
    name: 'third-level-menu',
    props: {
      show_menu: {
        default: true
      },
      white_background: {
        default: true
      }
    },
    data () {
      if (!this.$router) return {menu_item: null}
      let menu_item = menu.names_map[this.$router.currentRoute.name]
      if (menu_item) {
        menu_item = menu_item.get_from_root(1)
        menu_item = new RoutedMenu(menu_item, this.$router)
      }
      return {
        menu_item: menu_item
      }
    },
  }
</script>
