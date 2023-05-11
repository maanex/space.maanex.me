<template>
  <div class="login">
    <div
      v-for="prov of providers"
      :key="prov.id"
      @click="click(prov.id)"
      class="provider"
    >
      <NuxtIcon :name="prov.icon" />
      <span v-text="prov.display" />
    </div>
  </div>
</template>

<script setup lang="ts">
type Provider = {
  id: string
  display: string
  icon: string
}

const providers: Provider[] = [
  {
    id: 'discord',
    display: 'Log in with Discord',
    icon: 'brands/discord'
  },
  {
    id: 'github',
    display: 'Log in with GitHub',
    icon: 'brands/github'
  }
]

const api = useApi()
const router = useRouter()

async function click(id: string) {
  const { status, data } = await api.makeLoginRequest(id)
  if (status < 200 || status >= 400) alert(`http ${status}: ${JSON.stringify(data)}`)
  const url = data.url
  if (!url) alert('error. no url provided. please check console for more info')
  window.location.href = url
}
</script>

<style scoped lang="scss">
.provider {
  background-color: $color-beige;
  color: #000000dd;
  padding: 10pt 16pt;
  gap: 16pt;
  margin-top: 5pt;
  border-radius: 4pt;
  font-size: 11pt;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity .1s ease;

  .nuxt-icon {
    font-size: 16pt;
  }

  &:hover {
    opacity: .8;
  }
}
</style>

