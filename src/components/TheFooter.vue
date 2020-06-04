<template>
  <footer class="footer">
    <b-container>
      <div class="footer__container">
        <div class="footer__nav">
          <ul class="footer__list">
            <li class="footer__item">
              <router-link class="footer__link" to="/">Home</router-link>
            </li>
            <li class="footer__item">
              <router-link class="footer__link" to="blocks">Blocks</router-link>
            </li>
            <li class="footer__item">
              <router-link class="footer__link" to="transactions">Transactions</router-link>
            </li>
          </ul>
          <ul class="footer__list">
            <li class="footer__item">
              <router-link class="footer__link" to="validators">
                Validators
              </router-link>
            </li>
            <li class="footer__item">
              <router-link class="footer__link" to="accounts">Accounts</router-link>
            </li>
            <li class="footer__item">
              <router-link class="footer__link" to="visualization">Stats</router-link>
            </li>
          </ul>
          <ul class="footer__list">
            <li class="footer__item">
              <router-link class="footer__link" to="resources">Resources</router-link>
            </li>
            <li class="footer__item">
              <div class="footer__socials">
                <TheSocials class="footer__social" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </b-container>
    <b-container>
      <b-row>
        <b-col cols="12">
          <div class="footer-line">
            <div class="footer-line__logo">
              <TheLogotype class="footer__logo" />
            </div>
            <div class="footer-copyright">Oasis Explorer © 2020 All Rights Reserved</div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>

<script>
import TheSocials from '@/components/TheSocials.vue';
import TheLogotype from '@/components/TheLogotype.vue';

export default {
  name: 'TheFooter',
  components: {
    TheSocials,
    TheLogotype,
  },
};
</script>

<style lang="scss">
  .footer {
    font-family: $open-sans;
    background-color: $color-gray;
    color: $color-white;

    &__container {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      margin-bottom: 50px;
      padding-top: 50px;
      padding-bottom: 50px;
      border-bottom: 1px solid rgba(255, 255, 255,  .3);

      @include from-1200-down {
        flex-direction: column;
      }
    }

    &__nav {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      flex-wrap: wrap;

      @include from-768-down {
        flex-basis: 35%;
      }
    }

    &__list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      max-height: 250px;
      justify-content: flex-start;
      align-self: flex-start;

      @include from-768-down {
        width: 100%;
        text-align: center;
      }

      &:not(:first-child) {
        @include from-768-down {
          margin-top: 30px;
        }
      }

      &:not(:first-child) {
        margin-left: 100px;

        @include from-1200-down {
          margin-left: 30px;
        }

        @include from-768-down {
          margin-left: 0;
          margin-bottom: 30px;
        }
      }
    }

    &__item {
      margin-bottom: 25px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1.4px;
      line-height: 23px;
      text-transform: uppercase;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__link {
      color: $color-white;

      &:hover {
        color: rgba(255,255,255,.6);
      }

      &.router-link-active {
        text-decoration: none !important;
      }
    }

    &__link:hover,
    &__link:visited,
    &__link:active {
      text-decoration: none;
    }

    &__title {
      margin-bottom: 40px;
      font-size: 14px;
      line-height: 23px;
      font-family: $nunito;
      font-weight: 600;
      letter-spacing: 1.4px;
      text-transform: uppercase;
    }

    &__socials .social__item:not(:last-child) {
      margin-right: 15px;
    }

    &__logo {
      font-size: 36px;

      @include from-768-down {
        margin-bottom: 15px;
        font-size: 24px;
      }
    }

    &-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 50px;

      @include from-768-down {
        flex-direction: column;
      }
    }

    &-copyright {
      font-family: $open-sans;
      font-size: 14px;
      letter-spacing: 1px;

      @include from-768-down {
        width: 220px;
        text-align: center;
      }
    }

    &__socials {
      margin-right: 30px;

      @include from-1200-down {
        margin-top: 50px;
        margin-right: 0;
        margin-left: 35px;
      }

      @include from-992-down {
        margin-left: 5px;
      }

      @include from-768-down {
        margin-top: 30px;
        margin-left: 0;
        text-align: center;
      }
    }

    &__social {
      display: inline-flex;

      & .social__icon {
        font-size: 25px;
        color: $color-white;

        &:hover {
          color: rgba(255,255,255,.6);
        }
      }
    }
  }
</style>
