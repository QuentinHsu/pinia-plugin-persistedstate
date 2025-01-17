import { destr } from 'destr'
import type { Pinia, PiniaPluginContext } from 'pinia'
import { createPersistence } from './core'
import { storages } from './storages'
import { defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from '#app'

function piniaPlugin(context: PiniaPluginContext) {
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const options = config.public.piniaPluginPersistedstate

  createPersistence(context, p => ({
    key: p.key ?? context.store.$id,
    debug: p.debug ?? options.debug ?? false,
    serializer: p.serializer ?? {
      serialize: data => JSON.stringify(data),
      deserialize: data => destr(data),
    },
    storage: p.storage ?? (options.storage
      ? options.storage === 'cookies'
        ? storages.cookies(options.cookieOptions)
        : storages[options.storage]()
      : storages.cookies()),
    beforeHydrate: p.beforeHydrate,
    afterHydrate: p.afterHydrate,
    beforePersist: p.beforePersist,
    afterPersist: p.afterPersist,
    pick: p.pick,
    omit: p.omit,
  }), nuxtApp.runWithContext)
}

export default defineNuxtPlugin(({ $pinia }) => {
  ($pinia as Pinia).use(piniaPlugin)
})
